const url = 'mongodb://localhost:27017/northwind';

var mongo = require('mongodb').MongoClient;

mongo.connect(url, function (err, client) {
  if (err) {
    throw err;
  }
  var collection = client.db('northwind').collection('order-details');
  collection
    .aggregate([
      {
        $group: {
          _id: '$OrderID',
          OrderPrice: {
            $sum: {
              $multiply: ['$UnitPrice', '$Quantity'],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'OrderID',
          as: 'orders',
        },
      },
      {
        $unwind: {
          path: '$orders',
        },
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'orders.CustomerID',
          foreignField: 'CustomerID',
          as: 'orders',
        },
      },
      {
        $unwind: {
          path: '$orders',
        },
      },
      {
        $group: {
          _id: '$orders.CustomerID',
          'TotalOrdersAmount, $': {
            $sum: '$OrderPrice',
          },
        },
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: 'CustomerID',
          as: 'orders',
        },
      },
      {
        $unwind: {
          path: '$orders',
        },
      },
      {
        $project: {
          _id: 0,
          CustomerID: '$_id',
          CompanyName: '$orders.CompanyName',
          'TotalOrdersAmount, $': {
            $round: ['$TotalOrdersAmount, $', 2],
          },
        },
      },
      {
        $sort: {
          'TotalOrdersAmount, $': -1,
          CustomerID: 1,
        },
      },
    ])

    .toArray(function (err, documents) {
      console.log(documents);
      client.close();
    });
});
