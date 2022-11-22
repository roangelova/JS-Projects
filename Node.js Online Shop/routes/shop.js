const path = require('path');

const express = require('express');

const shopController = require('../controllers-mySQL/shop');

const router = express.Router();

const isAuthMiddleware = require('../middlewares/isAuthMiddleware')

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuthMiddleware, shopController.getCart);

router.post('/cart', isAuthMiddleware, shopController.postCart);

router.post('/cart-delete-item', isAuthMiddleware, shopController.postCartDeleteProduct);

router.post('/create-order', isAuthMiddleware, shopController.postOrder);

router.get('/orders', isAuthMiddleware, shopController.getOrders);

router.get('/checkout', isAuthMiddleware, shopController.getCheckout);

router.get('/orders/:orderId', isAuthMiddleware, shopController.getInvoice);

module.exports = router;
