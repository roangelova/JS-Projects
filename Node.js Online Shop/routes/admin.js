const path = require('path');

const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();

router.get('/add-product', productsController.getAddProduct); //we just  pass a reference to the func

router.post('/add-product', productsController.postAddProduct);

module.exports = router;
