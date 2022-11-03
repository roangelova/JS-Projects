const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);

const app = express();

//const MongoConnect = require('./helpers/database').MongoConnect;
const User = require('./models/user')

const store = new MongoDbStore({
  uri: uri,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers-mySQL/error.js');
const { uri } = require('./helpers/database_withoutMongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use((req, res, next) => {
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user; //returns a mongoos user
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

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

//CONNECT TO MONGO WITHOUT MONGOOSE 
//MongoConnect(() => {
//    app.listen(3000);
//})

mongoose.connect(uri)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });