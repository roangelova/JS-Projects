const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {

  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      })
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      })
    })
};

exports.getIndex = (req, res, next) => {
  Product.find().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/s'
    })
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;

    return next(error);
  })
};

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId') //does not return a promise; the data will be nested in THE PRODUCTID FFILD
    .execPopulate()
    .then(data => {
      let products = data.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    })
};

exports.postOrder = (req, res, next) => {
  req.user.populate('cart.items.productId')
    .execPopulate()
    .then(data => {
      let products = data.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } } //productId stores he whole product now, as we have populated the data
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user //mongoose will auto pick just the id
        },
        products: products
      })

      order.save()
        .then(result => {
          req.user.clearCart();
        })
        .then(result => {
          res.redirect('/orders');
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;

          return next(error);
        })
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then(order => {
      if (!order)
        return next(new Error('No such order was found'));

      if (order.user.userId.toString() === req.user._id.toString()) {
        return next(new Error('Not authorized'))
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';

      const invoicePath = path.join('data', 'invoices', invoiceName);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="invoice"'); //how the content should be served to the client

      let totalPrice = 0;

      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(invoicePath));
      doc.pipe(res);

      doc.fontSze(26).text('Invoice', {
        underline: true
      });
      doc.text('------------------');

      order.products.forEach(x => {
        doc.fontSize(14).text(x.pduct.title + ' - ' + x.quantity + ' x ' + '$' + x.product.price);
        totalPrice += x.quantity * x.product.price;
      })

      doc.text('---------');
      doc.fontSize(20).text('Total price: $ ' + totalPrice);
      doc.end();

    })
    .catch(err => next(err))
};

