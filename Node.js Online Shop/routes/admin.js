const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', adminController.getAddProduct); //we just  pass a reference to the func
router.get('/products', adminController.getProducts); 

router.post('/add-product', adminController.postAddProduct);

module.exports = router;
