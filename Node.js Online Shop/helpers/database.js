const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const uri = 'mongodb+srv://roan97:P@ssw1rd@shop-js.2e3xpfv.mongodb.net/?retryWrites=true&w=majority'

const MongoConnect = callback => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        console.log("connected");
        callback(client);
        client.close();
    });
};
module.exports = MongoConnect;
