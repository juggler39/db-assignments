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
        $lookup: {
          from: 'employees',
          localField: 'ReportsTo',
          foreignField: 'EmployeeID',
          as: 'Chief',
        },
      },
      {
        $unwind: {
          path: '$Chief',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          EmployeeID: 1,
          FullName: {
            $concat: ['$TitleOfCourtesy', '$FirstName', ' ', '$LastName'],
          },
          ReportsTo: {
            $ifNull: [
              {
                $concat: ['$Chief.FirstName', ' ', '$Chief.LastName'],
              },
              '-',
            ],
          },
        },
      },
      {
        $sort: {
          EmployeeID: 1,
        },
      },
    ])

    .toArray(function (err, documents) {
      console.log(documents);
      client.close();
    });
});
