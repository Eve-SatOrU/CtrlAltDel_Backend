const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const AmbulanceRequest = sequelize.define('ambulanceRequest', {
  currentLocation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roadCondition: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  patientStateDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maladeSituationDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = AmbulanceRequest;