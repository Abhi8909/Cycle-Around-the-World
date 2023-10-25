// File to handle DB 


const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config');

const sequelize = new Sequelize(config.database, config.username, config.password, config);

module.exports = sequelize;