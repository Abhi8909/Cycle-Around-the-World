'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import your Sequelize instance

const Spot = sequelize.define('Spot', {
  name: {
    type: DataTypes.STRING,
  },
  latitude: {
    type: DataTypes.STRING,
  },
  longitude: {
    type: DataTypes.STRING,
  },
  cycling: {
    type: DataTypes.BOOLEAN,
  },
});

module.exports = Spot;