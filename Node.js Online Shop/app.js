const express = require('express');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(adminRoutes);
app.use(shopRoutes);

app.use('/', (req, res, next) => {
    res.send('<h1>Hello from Express</h1>')
});

app.listen(3000);