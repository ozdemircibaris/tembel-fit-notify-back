let dotenv = require('dotenv');
dotenv.config();

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: "localhost",
        dialect: "mysql"
    }
)

const tokens = require('../models/tokens');
const tokensModel = tokens(sequelize, Sequelize);
const notifications = require('../models/notifications');
const notificationsModel = notifications(sequelize, Sequelize);

module.exports = {
    sequelize,
    tokensModel,
    notificationsModel,
}