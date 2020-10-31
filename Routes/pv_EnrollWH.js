exports.EnrollWH = function(req,res,app,db,fileName){
  var mysql = require('mysql');
  var connection = mysql.createConnection(require('../Module/db').info);
  connection.connect();
  var fileInfo = {
    "warehouseID":req.body.warehouseID,
    "filename": fileName
  };
  connection.query('INSERT INTO FileInfo SET ?' , fileInfo, function (error, results, fields) {
      if (error) {
          console.log("error ocurred", error);
          res.send(false);
      }
      else{
        var item = {
          "warehouseID": req.body.warehouseID,
          "warehouseName": req.body.warehouseName,
          "enrolledDate": new Date(),
          "address": req.body.address,
          "latitude": req.body.latitude,
          "longitude": req.body.longitude,
          "landArea": req.body.landArea,
          "floorArea": req.body.floorArea,
          "useableArea": 0,
          "infoComment": req.body.infoComment,
          "etcComment" :req.body.etcComment
      }
      let reqResult = db.query('SELECT * from RequestForEnroll ORDER BY reqID DESC');
      let logResult = db.query('SELECT * from Log ORDER BY logID DESC');
      var reqno = 1;
      var logno = 1;
      if(reqResult.length>0)
      reqno = reqResult[0].reqID+1;
       connection.query('INSERT INTO warehouse SET ?' , item, function (error, results, fields) {
          if (error) {
              console.log("error ocurred", error);
              res.send(false);
          } else {
              var reqItem ={
                "reqID":reqno,
                "reqDate":new Date(),
                "reqType":"ReqEnrollPV",
                "providerID":req.session['memberID'],
                "warehouseID":req.body.warehouseID,
                "logID":logno
              };
              connection.query('INSERT INTO RequestForEnroll SET ?' , reqItem, function (error, results, fields) {
                if (error) {
                  console.log("error ocurred", error);
                  res.send(false);
                }
                else{
                  res.redirect('/Provider/MyWarehouse');
                }
              });
            }
        });
      }
  });
}