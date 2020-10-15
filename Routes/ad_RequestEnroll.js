exports.requestWH = function(req,res,app,session,db){
    db.query('SELECT * FROM RequestForEnroll', function(error,results,fields){
        if(error) throw error;
        else {
          res.render('User/Admin/ad_RequestEnroll',{'app':app,'session':session,'db':db, 'result':results});
        }
    })
}

exports.requestWH_OK = function(req,res,app,session,db) {
  var enrollWarehouse = {
      "reqID" : req.body.reqID,
  }
  console.log(enrollWarehouse.reqID);
  db.query('UPDATE RequestForEnroll SET reqType = "Accept" WHERE providerID = ?', enrollWarehouse.reqID, function (error, results, fields) {
      if (error) {
          console.log("error ocurred", error);
          res.redirect('/Admin/RequestEnroll');
      } else {
          console.log("Success");
          res.redirect('/Admin/RequestEnroll');
      }
  });
}

exports.requestWH_NO = function(req,res,app,session,db) {
  var enrollWarehouse = {
      "reqID" : req.body.reqID,
  }

  db.query('UPDATE RequestForEnroll SET reqType = "Reject" WHERE providerID = ?', enrollWarehouse.reqID, function (error, results, fields) {
      if (error) {
          console.log("error ocurred", error);
          res.redirect('/Admin/RequestEnroll');
      } else {
        console.log("Success");
        res.redirect('/Admin/RequestEnroll');
      }
  });
}
