exports.findWH = function (req, res,app,db) {
    var items="{";
    let results = db.query('SELECT * from Warehouse where warehouseID IN (SELECT warehouseID from EnrolledWarehouse)');
    if(results.length > 0) {
        var step;
        for(step =0;step<results.length;step++){
            items+= ("\"item"+step+"\":");
            var obj="{"+
                "\"warehouseID\" :"+ results[step].warehouseID+","+
                "\"warehouseName\" :\""+ results[step].warehouseName+"\","+
                "\"enrolledDate\" :\"" + results[step].enrolledDate+"\","+
                "\"address\" :\""+ results[step].address+"\","+
                "\"latitude\" :"+ results[step].latitude+","+
                "\"longitude\" :"+ results[step].longitude+","+
                "\"landArea\" :"+ results[step].landArea +","+
                "\"floorArea\" :"+ results[step].floorArea +","+
                "\"useableArea\" :"+ results[step].useableArea +","+
                "\"infoComment\" :\""+ results[step].infoComment+"\","+
               "\"etcComment\" :\""+ results[step].etcComment+"\""+
            "}";
            items+=obj;
            if(step+1!=results.length)items+=","
        }
    }
    items +="}";
    return items;
}

exports.findImage =function (req, res,app,db) {
    var items="{";
    let results = db.query(`SELECT * from FileInfo where warehouseID=${req.body.warehouseID}`);
    if(results.length > 0) {
        var step;
        for(step =0;step<results.length;step++){
            items+= ("\"image"+step+"\":");
            var obj="{"+
                "\"title\" : \""+ results[step].filename+"\","+
                "\"url\" :\"../../Public/Upload/"+results[step].filename+"\""+
            "}";
            items+=obj;
            if(step+1<results.length)items+=","
        }
    }
    items +="}";
    return items;
}

exports.RequestWH = function(req,res,app,db){
    var mysql = require('mysql');
    var connection = mysql.createConnection(require('../Module/db').info);
    connection.connect();
    let reqResult = db.query('SELECT * from RequestForBuy ORDER BY reqID DESC');
    let logResult = db.query('SELECT * from Log ORDER BY logID DESC')
    var reqno = 1;
    var logno = 1;
    if(reqResult.length>0)
    reqno = reqResult[0].reqID+1;
    if(logResult.length>0)
    logno = logResult[0].logID+1;
    
    var reqBuy = {
        "reqID": reqno,
        "reqDate": CURRENT_TIMESTAMP(),
        "reqType": "RequestBuy_byBuyer",
        "warehouseID": req.body.warehouseID,
        "buyerID": req.body.buyerID,
        "area": req.body.area,
        "logID": logno
    };
    connection.query('INSERT INTO RequestForBuy SET ?' , reqBuy, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send(false);
        } else {
            var logitem={
                "logID":logno,
                "logType":"RequestBuy_byBuyer",
                "logDate":CURRENT_TIMESTAMP(),
                "logComment":`${req.body.buyerID}가${req.body.warehouseID}를 창고공유요청함`
            }
            connection.query('INSERT INTO Log SET ?' , logitem, function (error, results, fields) {
              if (error) {
                console.log("error ocurred", error);
                res.send(false);
              }
              else{
                res.send(true);
              }
            });
          }
      });
    connection.end()
}