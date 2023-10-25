// File to handle DB 


const { Sequelize } = require('sequelize');
const config = require('./config/config');

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: config.dialect,
  logging: false
});

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testDatabaseConnection();

module.exports = sequelize;