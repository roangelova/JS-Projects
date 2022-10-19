const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'shop-js', 'root', 'password', 
    {dialect: 'mysql', host: 'localhost'}
);

module.exports = sequelize;
//creates a pool 