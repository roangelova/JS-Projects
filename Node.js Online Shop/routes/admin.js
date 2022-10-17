const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
    res.send('<h1>Add product</h1>')
});

router.post('/product', (req, res, next) => {
    res.redirect('/');
});

module.exports = router; 