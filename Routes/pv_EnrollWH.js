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
  });
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
  let logResult = db.query('SELECT * from Log ORDER BY logID DESC')
  var reqno = 1;
  var logno = 1;
  if(reqResult.length>0)
  reqno = reqResult[0].reqID+1;
  if(logResult.length>0)
  logno = logResult[0].logID+1;
  connection.query('INSERT INTO warehouse SET ?' , item, function (error, results, fields) {
      if (error) {
          console.log("error ocurred", error);
          res.send(false);
      } else {
          var reqItem ={
            "reqID":reqno,
            "reqDate":new Date(),
            "reqType":"RequestEnroll_byProvider",
            "providerID":req.body.providerID,
            "warehouseID":req.body.warehouseID,
            "logID":logno
          };
          connection.query('INSERT INTO RequestForEnroll SET ?' , reqItem, function (error, results, fields) {
            if (error) {
              console.log("error ocurred", error);
              res.send(false);
            }
            else{
              var logitem={
                "logID":logno,
                "logType":"RequestEnroll_byProvider",
                "logDate":new Date(),
                "logComment":`${req.body.providerID}가${req.body.warehouseID}를 창고등록요청함`
              }
              connection.query('INSERT INTO Log SET ?' , logitem, function (error, results, fields) {
                if (error) {
                  console.log("error ocurred", error);
                  res.send(false);
                }
                else{
                  res.redirect('/');
                  connection.end();
                }
              });
            }
          });
        }
    });
}