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
      "reqID" : req.body.reqID,
  }
  db.query('UPDATE SET RequestForEnroll re ?', enrollWarehouse, function (error, results, fields) {
      if (error) {
          console.log("error ocurred", error);
          res.redirect('/Admin/RequestEnroll');
      } else {
          req.session['reqID'] = enrollWarehouse.reqID;
          req.session['logID'] = enrollWarehouse.logID;
          res.redirect('/');
      }
  });
}

exports.requestWH_NO = function(req,res,app,session,db) {
  var enrollWarehouse = {
      "reqID" : req.body.reqID,
  }
  db.query('UPDATE SET RequestForEnroll re ?', enrollWarehouse, function (error, results, fields) {
      if (error) {
          console.log("error ocurred", error);
          res.redirect('/Admin/RequestEnroll');
      } else {
          req.session['reqID'] = enrollWarehouse.reqID;
          req.session['logID'] = enrollWarehouse.logID;
          res.redirect('/');
      }
  });
}
