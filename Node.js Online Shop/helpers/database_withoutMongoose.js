const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const uri = 'mongodb+srv://test:PqSlo69YGi47ul0h@shop-js.2e3xpfv.mongodb.net/?retryWrites=true&w=majority';
//if the db does not exist, MongoDb will create it as soon as we start writing data to it

let _db;

const MongoConnect = callback => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        console.log("connected");
        _db = client.db('js-shop'); // we are storing the access to the db 
        callback(client);
        client.close();
    });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No db found';
}

exports.getDb = getDb;
exports.MongoConnect = MongoConnect;