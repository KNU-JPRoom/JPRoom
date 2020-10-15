exports.requestBuy = function(req,res,app,session,db){
    db.query('SELECT * FROM RequestForBuy', function(error,results,fields){
        if(error)
          throw error;
        else {
          res.render('User/Admin/ad_RequestBuy',{'app':app,'session':session,'db':db, 'result':results});
        }
    })
}

exports.requestBuy_OK = function(req,res,app,session,db) {
  var buyWarehouse = {
      "buyerID" : req.body.buyerID,
  }
  console.log("하이" + buyWarehouse.buyerID);
  db.query('UPDATE RequestForBuy SET reqType = "Accept" WHERE buyerID = ?', buyWarehouse.buyerID, function (error, results, fields) {
      if (error) {
          console.log("error ocurred", error);
          res.redirect('/Admin/RequestBuy');
      } else {
          console.log("Success");
          res.redirect('/Admin/RequestBuy');
      }
  });
}

exports.requestBuy_NO = function(req,res,app,session,db) {
  var buyWarehouse = {
      "buyerID" : req.body.buyerID,
  }

  db.query('UPDATE RequestForBuy SET reqType = "Reject" WHERE buyerID = ?', buyWarehouse.buyerID, function (error, results, fields) {
      if (error) {
          console.log("error ocurred", error);
          res.redirect('/Admin/RequestBuy');
      } else {
        console.log("Success");
        res.redirect('/Admin/RequestBuy');
      }
  });
}
