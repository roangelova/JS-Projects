const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const MongoConnect = require('./helpers/database');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers-mySQL/error.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//register a middleware
app.use((req, res, next) => {
    //  User.findByPk(1)
    //      .then(user => {
    //          req.user = user;
    //          next();
    //      })
    //      .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//User.hasMany(Product);
//User.hasOne(Cart);
//Cart.belongsTo(User);
//Cart.belongsToMany(Product, { through: CartItem });
//Product.belongsToMany(Cart, { through: CartItem });
//
////create a default user
//sequelize
//    .sync()
//    .then(result => {
//        return User.findByPk(1);
//    })
//    .then(user => {
//        if (!user) {
//            return User.create({ name: 'Test', email: 'test@testov.com' });
//        }
//        return user;
//    })
//    .then(user => {
//        user.createCart();
//    })
//    .then(cart => {
//         app.listen(3000);
//    })
//    .catch(err => {
//        console.log(err);
//    });

MongoConnect((client) => {
    console.log(client)
    app.listen(3000);
})