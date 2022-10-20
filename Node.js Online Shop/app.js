const path = require('path');
const sequelize = require('./helpers/database');
const express = require('express');
const bodyParser = require('body-parser');

const Product = require('./models/product');
const User = require('./models/user');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

//force will overwrite with the new tables
sequelize.sync({force: true})
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    });

//has a look at all of our defined models and creates tables for them

app.listen(3000);
