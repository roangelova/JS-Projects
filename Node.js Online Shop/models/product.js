const getDb = require('../helpers/database').getDb;

class Product{
    constructor(title, price, description, imageUrl){
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save(){

    }
}