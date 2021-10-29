const Sequelize = require('sequelize');
var config = require('../common/database.json');

module.exports = new Sequelize(
    config.database,
    config.user,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        port: config.port,
        operatorsAliases: false,
        define: {
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            accuire: 30000,
            idle: 10000
        }
    });

