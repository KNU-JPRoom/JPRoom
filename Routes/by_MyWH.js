exports.RequestForBuy = function (req, res,app,db) {
  var items="{";
  var sql = `select * from RequestForBuy where buyerID='`+req.session['memberID']+"'";
  let results = db.query(sql);
  if(results.length > 0) {
      var step;
      for(step =0;step<results.length;step++){
          items+= ("\"item"+step+"\":");
          var obj="{"+
              "\"reqID\" :"+ results[step].reqID+","+
              "\"reqDate\" :\""+ results[step].reqDate+"\","+
              "\"reqType\" :\"" + results[step].reqType+"\","+
              "\"warehouseID\" :"+ results[step].warehouseID +","+
              "\"buyerID\" :\""+ results[step].buyerID+"\","+
              "\"area\" :"+ results[step].area+""+
          "}";
          items+=obj;
          if(step+1<results.length)items+=","
      }
  }
  items +="}";
  return items;
}


exports.Mywarehouse = function(req,res,app,db){
  var items="{";
  let results = db.query('SELECT * from Warehouse where warehouseID IN (SELECT warehouseID from Buyer where memberID = ?)',[req.session['memberID']]);
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

exports.ReqBuyWithAnswer = function(req,res,app,db){
  var reqID = req.body.reqID;
  var reqType = req.body.reqType;
  var answer = req.body.answer;
  var mysql = require('mysql');
  var connection = mysql.createConnection(require('../Module/db').info);
  connection.connect();
  if(answer=="Cancel"){
      connection.query(`UPDATE RequestForBuy SET reqType='RejByBuyer' WHERE reqID =${reqID}`,function (error, results, fields){
          res.redirect('/Buyer/MyWarehouse');
          connection.end();
      });
  }
  else if(answer=="Confirm"){
    if(reqType=="RejByAd"||reqType=="RejByPv"){
      connection.query(`DELETE FROM RequestForBuy WHERE reqID =${reqID}`,function (error, results, fields) {
        res.redirect('/Buyer/MyWarehouse');
        connection.end();
    });
    }
  }
  else if(answer=="Accept"){
    if(reqType=="ReqPayByBuyer"){
      connection.query(`UPDATE RequestForBuy SET reqType='ReqPayAcpt' WHERE reqID =${reqID}`,function (error, results, fields) {
          if(error){
            res.send(false);
            connection.end();
          }
          else{
            var info = {
              memberID: req.session['memberID'],
              warehouseID: req.body.warehouseID,
              area: req.body.area
            };
            connection.query(`INSERT INTO Buyer SET ?`,info,function (error, results, fields) {
                if(error){
                  res.send(false);
                  connection.end()
                }
                else{
                  let result = db.query('select * from Contract');
                  var conno = result.length+1;
                  var contract = {
                      contractID : conno,
                      buyerID : info['memberID'],
                      warehouseID : info['warehouseID'],
                      area : info['area'],
                      logID : 1
                  };
                  connection.query(`INSERT INTO Contract SET ?`,contract,function (error, results, fields) {
                    if(error){
                      res.send(false);
                      connection.end()
                    }
                    else{
                      res.send(true);
                      connection.end();
                    }
                  });
                }
            });
          }
      });
    }
  }
}