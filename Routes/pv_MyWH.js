exports.requestWH = function(req,res,app,session,db){
    db.query('SELECT * FROM requestforbuy WHERE provideServiceID = ?', 1,
        function(error,results,fields){
          if(error)
            throw error;
          else {
            res.render('User/Provider/pv_MyWH',{'app':app,'session':session,'db':db, 'result':results});
          }
    })
}

exports.requestWH_OK = function(req,res,app,session,db) {
  var enrollWarehouse = {
      "providerID" : req.body.providerID,
      "buyerID" : req.body.buyerID,
  }
  var sql = 'UPDATE requestforbuy SET reqType = "Accept" WHERE provideServiceID = ? AND buyerID = ?';
  db.query(sql, [enrollWarehouse.providerID, enrollWarehouse.buyerID], function (error, results, fields) {
      if (error) {
          console.log("error ocurred", error);
          res.redirect('/Provider/MyWarehouse');
      } else {
          res.redirect('/Provider/MyWarehouse');
      }
  });
}

exports.requestWH_NO = function(req,res,app,session,db) {
  var enrollWarehouse = {
    "providerID" : req.body.providerID,
    "buyerID" : req.body.buyerID,
  }
    var sql = 'UPDATE requestforbuy SET reqType = "Reject" WHERE provideServiceID = ? AND buyerID = ?';
    db.query(sql, [enrollWarehouse.providerID, enrollWarehouse.buyerID], function (error, results, fields) {
      if (error) {
          console.log("error ocurred", error);
          res.redirect('/Provider/MyWarehouse');
      } else {
          res.redirect('/Provider/MyWarehouse');
      }
  });
}
