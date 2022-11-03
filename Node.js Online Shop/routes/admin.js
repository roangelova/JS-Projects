const path = require('path');

const express = require('express');

const adminController = require('../controllers-mySQL/admin');

const router = express.Router();

const isAuthMiddleware = require('../middlewares/isAuthMiddleware')

router.get('/add-product', isAuthMiddleware, adminController.getAddProduct);
//THE REQ WILL TRAVEL FROM THE LEFT TO RIGHT

router.get('/products', isAuthMiddleware, adminController.getProducts);

router.post('/add-product', isAuthMiddleware, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuthMiddleware, adminController.getEditProduct);

router.post('/edit-product', isAuthMiddleware, adminController.postEditProduct);

router.post('/delete-product', isAuthMiddleware, adminController.postDeleteProduct);

module.exports = router;
