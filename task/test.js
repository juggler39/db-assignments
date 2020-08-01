const url = 'mongodb://localhost:27017/northwind';

var mongo = require('mongodb').MongoClient;

mongo.connect(url, function (err, client) {
  if (err) {
    throw err;
  }
  var collection = client.db('northwind').collection('orders');
  collection
    .aggregate([
      {
      $count: 'myCount',
      $project: { _id: 0,  CustomerID: 1 }
    }
    ])

    .toArray(function (err, documents) {
      console.log(documents);
      client.close();
    });
});
