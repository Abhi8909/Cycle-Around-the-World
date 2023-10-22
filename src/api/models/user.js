const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import your Sequelize instance

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
  },
});

module.exports = User;