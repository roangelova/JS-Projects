const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Logins',
        isAuthenticated: req.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const passord = req.body.passord;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.redirect('login');
            }
            bcrypt.compare(passord, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        req.session.save((err) => {
                            console.log(err);
                            res.redirect('/');
                        })
                    } else {
                        res.redirect('login')
                    }
                })
                .catch(err => res.redirect('login'))
        })
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.redirect('/signup');
            } else {
                return bcrypt.hash(password, 12)
                    .then(hashedPassword => {
                        const user = new User({
                            name: 'Pesho',
                            email: email,
                            password: hashedPassword,
                            cart: { items: [] }
                        });
                        return user.save();
                    })
            };
        }).then(result => {
            res.redirect('/login');
        }).catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        //what to do once the session is destroyed
        res.redirect('/');
    });
}