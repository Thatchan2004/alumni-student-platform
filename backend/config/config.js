// backend/config/config.js
require('dotenv').config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/alumniconnect',
  JWT_SECRET: process.env.JWT_SECRET || 'alumniconnect_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@alumniconnect.com',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
};
