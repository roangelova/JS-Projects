exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Logins',
        isAuthenticated: req.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('id')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            })
        })
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false
    });
  };

  exports.postSignup = (req, res, next) => {};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        //what to do once the session is destroyed
        res.redirect('/');
    });
};