const express = require('express');
const path = require('path');

const rootDir = require('../helpers/path.js');

const router = express.Router();

router.get('/', (req, res, next) => {
    //requires an absolute path 
    res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    //WE DONT ADD SLASHES, THIS IS BUILT AUTOMATICALLY to be supported on Linux and Windows
});

module.exports = router; 