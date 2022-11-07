const User = require('../models/user')

const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport')

const { validationResult } = require('express-session/check')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGGRID_KEY
    }
}))

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Logins',
        errorMessage: message
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset password',
        errorMessage: message
    });
}

exports.postReset = (req, res, next) => {

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'We found no account with this email');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() = 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('new-password')
                return transporter.sendMail({
                    to: req.body.email,
                    from: 'shop@nodeTraining.com',
                    subject: 'Password reset requested',
                    html: `<p>You requested a password reset. Click <a href="http://localhost:3000?reset/${token}">here</a> link for a new password`
                })
            })
            .catch(err => console.log(err))
    })

}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
};


exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const passord = req.body.passord;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password');
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
                        req.flash('error', 'Invalid email or password');
                        res.redirect('login')
                    }
                })
                .catch(err => res.redirect('login'))
        })
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    };
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.flash('error', 'Such user already exists!');
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
            return transporter.sendMail({
                to: email,
                from: 'shop@nodeTraining.com',
                subject: 'Signup successfull!',
                html: '<h1>You are now a user</h1>'
            })

        }).catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        //what to do once the session is destroyed
        res.redirect('/');
    });
}