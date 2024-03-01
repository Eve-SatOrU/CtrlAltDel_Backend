const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
  firstName:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phoneNumber:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Id_card : {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  }
});


module.exports = User;