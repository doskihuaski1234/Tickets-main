const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'sqlite';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'tickets_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect,
    storage: process.env.DB_STORAGE || path.join(__dirname, '..', '..', 'database.sqlite'),
    logging: false
  }
);

module.exports = sequelize;