const url = 'mongodb://localhost:27017/northwind';

var mongo = require('mongodb').MongoClient;

mongo.connect(url, function (err, client) {
  if (err) {
    throw err;
  }
  var collection = client.db('northwind').collection('order-details');
  collection
    .aggregate([
      // $match: {
      //   CustomerID: 'VINET',
      // },
      { $group: { _id: '$OrderID', 
      'Order Total Price':    

      {      
        $sum: { $multiply: ['$UnitPrice', '$Quantity'] }     
      
      }, 
        'TotalDiscount': { $sum: { $multiply: [100, '$Discount', '$Quantity'] }},
    
    
    } },
      { 
        $project: { 
          _id: 0,
          'Order Id': '$_id',
          'Order Total Price': {$round: ['$Order Total Price', 3]},
          'Total Order Discount, %': {
            $round: [{ $divide: ['$TotalDiscount', '$Order Total Price'] }, 3]
          },
      } 
    },
      { $sort: { 'Order Id': -1 } },

      { $limit: 5 },
    ])
    .toArray(function (err, documents) {
      console.log(documents);
      client.close();
    });
});
