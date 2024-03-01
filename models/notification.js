const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Notification = sequelize.define('notification', {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Notification;
