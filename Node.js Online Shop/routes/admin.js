const path = require('path');

const express = require('express');

const { body, check } = require('express-validator')

const adminController = require('../controllers-mySQL/admin');

const router = express.Router();

const isAuthMiddleware = require('../middlewares/isAuthMiddleware')

router.get('/add-product',
    [
        body('title').
            isString().
            isLength({ min: 3 }.
                trim()),
      //  body('imageUrl')
       //     .isURL(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({ min: 10, max: 200 })
            .trim()
    ],
    isAuthMiddleware, adminController.getAddProduct);
//THE REQ WILL TRAVEL FROM THE LEFT TO RIGHT

router.get('/products', isAuthMiddleware, adminController.getProducts);

router.post('/add-product', isAuthMiddleware, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuthMiddleware, adminController.getEditProduct);

router.post('/edit-product',
    [
        body('title').
            isString().
            isLength({ min: 3 }.
                trim()),
       // body('imageUrl')
       //     .isURL(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({ min: 10, max: 200 })
            .trim()
    ], isAuthMiddleware, adminController.postEditProduct);

router.post('/delete-product', isAuthMiddleware, adminController.postDeleteProduct);

module.exports = router;
