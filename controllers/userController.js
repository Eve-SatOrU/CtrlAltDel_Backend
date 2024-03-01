const bcrypt = require('bcrypt');
const session = require('express-session');
const { Op } = require('sequelize');
const User = require('../models/user');
const AmbulanceRequest = require('../models/AmbulanceRequest');
const Notification = require('../models/notification');



User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt();
  user.userPassword = await bcrypt.hash(user.userPassword, salt);
});


function validateStrongPassword(password) {
  if (password.length < 8) {
    return false;
  }
  const letterRegex = /[a-zA-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*]/;
  if (!letterRegex.test(password) || !numberRegex.test(password) || !specialCharRegex.test(password)) {
    return false;
  }
  return true;
}

exports.getRegister = (req, res, next) => {
  res.json({ message: 'Render Register form' });
};

exports.postRegister = async (req, res, next) => {
  const { firstName,lastName,userName,phoneNumber,Id_card, userPassword, email,role } = req.body;

  // Validate password strength
  if (!validateStrongPassword(userPassword)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long and must contain a combination of letters, numbers, and special characters."
    });
  }

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { userName },
          { email },
          {Id_card},
          {phoneNumber}
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email is already taken.' });
    }

    const user = await User.create({
      firstName,
      lastName,
      userName,
      phoneNumber,
      Id_card,
      userPassword,
      email,
      role
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getLogin = (req, res, next) => {
  res.json({ message: 'Render Login form' });
};

exports.postLogin = async (req, res) => {
  const { email, userPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    req.session.user = user;
    req.session.userId = user.id;
    res.status(200).json({ message: 'User logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('sid');
    return res.status(200).json({ message: 'Logout successful' });
  });
};

// profile 
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  }catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


// delete account
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userRole = user.role;

    const associations = [
      {
        model: AmbulanceRequest,
        where: { userId: id },
        required: userRole === 'civilprotection',
      },
      {
        model: Notification,
        where: { userId: id },
        required: userRole === 'hospital',
      },
      {
        model: Notification,
        where: { userId: id },
        required: userRole === 'police',
      }
    ];

    await user.destroy({ include: associations });

    res.status(200).json({ message: 'User and related data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
