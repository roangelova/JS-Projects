const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const app = express();
const flash = require('connect-flash')

require('dotenv').config()

const uri = process.env.MONGO_URI;

//const MongoConnect = require('./helpers/database').MongoConnect;
const User = require('./models/user')

const store = new MongoDbStore({
  uri: uri,
  collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers-mySQL/error.js');
const { env } = require('process');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(csrfProtection);
app.use(flash()) // now we can use it anywhere in our app on the req 

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfTpken = req.csrfToken();
  //set local vars that are paed to every view
  next();
})

app.use((req, res, next) => {

  if (!req.session.user) {
    return next()
  }

  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next()
      }
      req.user = user; //returns a mongoos user
      next();
    })
    .catch(err => {
     // throw new Error(err) --> this does not GET PASSED TO OUR ERROR-HANDLING MIDDLEWARE,
     //BECAUSE WE ARE IN AN ASYNC CODE (PROMISE)
     //WE HAVE TO PASS THE ERROR TO NEXT 
     next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500)

app.use(errorController.get404);

app.use((error, req, res, next) => {
  //this defines an error-handlng middleware
  res.redirect('/500')
})

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