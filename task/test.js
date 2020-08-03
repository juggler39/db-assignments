const url = 'mongodb://localhost:27017/northwind';

var mongo = require('mongodb').MongoClient;

mongo.connect(url, function (err, client) {
  if (err) {
    throw err;
  }
  var collection = client.db('northwind').collection('products');
  collection
    .find(
      {

        limit: 20,
      },
      // {
      //   projection: {
      //     _id: 0,
      //     ProductName: 1,
      //     UnitPrice: 1,
      //   },
      //   sort: {
      //     UnitPrice: 1,
      //   },
      // }
    )

    .toArray(function (err, documents) {
      console.log(documents);
      client.close();
    });
});
