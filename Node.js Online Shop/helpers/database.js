const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'shop-js', 'root', 'P@ssw1rd#', 
    {dialect: 'mysql', host: 'localhost'}
);

module.exports = sequelize;
//creates a pool 