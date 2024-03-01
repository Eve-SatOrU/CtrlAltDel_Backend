const User = require('../models/user');
const AmbulanceRequest = require('../models/AmbulanceRequest');
const Notification = require('../models/notification');

const isPolice = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'police') {
    next(); 
  } else {
    res.status(403).json({ error: 'Unauthorized' }); 
  }
};

exports.policeNotifications = [isPolice, async (req, res) => {
  try {
    const userId = req.params.id;
    const notifications = await Notification.findAll({
      where: { userId, type: 'police' },
      order: [['createdAt', 'DESC']], 
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}];