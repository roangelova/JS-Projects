const express = require('express');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');



app.use('/admin',adminRoutes); //adds the admin part as a filter + commo starting segment
app.use(shopRoutes);

//catch all middleware
app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found</h1>');
});

app.listen(3000);