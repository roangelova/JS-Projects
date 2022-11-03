const getDb = require('../helpers/database_withoutMongoose').getDb;
const mongodb = require('mongodb');

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            db.collection('products')
                .updateOne(
                    { _id: this._id },
                    { $set: this });
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp.then(res => console.log(res))
            .catch(res => console.log(res))
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                return products
            })
            .catch(err => console.log(err));
    }

    static findById(productId) {
        const db = getDb();
        return db.collection('products')
            .find({ _id: new mongodb.ObjectId(productId) })
            .next() //get the last or in this case the ony el
            .then(product => {
                return product
            })
            .catch(err => console.log(err));
    }

    static deleteById(productId) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({ _id: new mongodb.ObjectId(productId) })
            .then(res => {
                return res
            })
            .catch(err => console.log(err));
    }
}