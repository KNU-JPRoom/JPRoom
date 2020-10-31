exports.RequestForEnroll = function (req, res,app,db) {
  var items="{";
  let results = db.query('SELECT * from RequestForEnroll where providerID =?',[req.session.memberID]);
  if(results.length > 0) {
      var step;
      for(step =0;step<results.length;step++){
          items+= ("\"item"+step+"\":");
          var obj="{"+
              "\"reqID\" :"+ results[step].reqID+","+
              "\"reqDate\" :\""+ results[step].reqDate+"\","+
              "\"reqType\" :\"" + results[step].reqType+"\","+
              "\"warehouseID\" :"+ results[step].warehouseID+","+
              "\"providerID\" :\""+ results[step].providerID  +"\","+
              "\"logID\" :"+ results[step].logID+","+
          "}";
          items+=obj;
          if(step+1!=results.length)items+=","
      }
  }
  items +="}";
  return items;
}

exports.RequestForBuy = function (req, res,app,db) {
  var items="{";
  let results = db.query('SELECT * from RequestForBuy where warehouseID IN (SELECT warehouseID from Provider where memberID = ?)',[req.session['memberID']]);
  if(results.length > 0) {
      var step;
      for(step =0;step<results.length;step++){
          items+= ("\"item"+step+"\":");
          var obj="{"+
              "\"reqID\" :"+ results[step].reqID+","+
              "\"reqDate\" :\""+ results[step].reqDate+"\","+
              "\"reqType\" :\"" + results[step].reqType+"\","+
              "\"warehouseID\" :"+ results[step].warehouseID+","+
              "\"buyerID\" :\""+ results[step].buyerID+"\","+
              "\"logID\" :"+ results[step].logID+","+
          "}";
          items+=obj;
          if(step+1!=results.length)items+=","
      }
  }
  items +="}";
  return items;
}



exports.Mywarehouse = function(req,res,app,db){
  var items="{";
  let results = db.query('SELECT * from Warehouse where warehouseID IN (SELECT warehouseID from Provider where memberID = ?)',[req.session['memberID']]);
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

exports.withAnswer = function(req,res,app,db){
  var reqID = req.body.reqID;
  var reqType = req.body.reqType;
  var answer = req.body.answer;
  var group = req.body.group;
  var mysql = require('mysql');
  var connection = mysql.createConnection(require('../Module/db').info);
  connection.connect();
  if(answer=="Delete"){
    connection.query(`DELETE FROM ${group} WHERE reqID =?`,[reqID],function (error, results, fields) {
        if(error){
          res.send(false);
        }
        else
          res.send(true);
    });
  }
  else if(answer="Accept"){
    if(reqType=="RequestBuy_byBuyer"){
      connection.query(`UPDATE RequestForBuy SET reqType='RequestBuy_Accepted_byProvider' WHERE reqID =?`,[reqID],function (error, results, fields) {
        if(error){
          res.send(false);
        }
        else
          res.send(true);
      });
    }
    else if(reqType=="RequestPay_Accepted"){
      connection.query('DELETE FROM RequestForBuy WHERE reqID =?',[reqID],function (error, results, fields) {
        if(error){
          res.send(false);
        }
        else
          res.send(true);
      });
    }
  }
  else if(answer="Reject"){
    connection.query(`UPDATE RequestForBuy SET reqType='RequestRejected_byProvider' WHERE reqID =?`,[reqID],function (error, results, fields) {
      if(error){
        res.send(false);
      }
      else
        res.send(true);
    });
  }
  connection.end();
}

exports.withInfo = function(req,res,app,db){
  var warehouseID = req.body.warehouseID;
    let results = db.query('SELECT * from Warehouse where warehouseID =?',[warehouseID]);
    var obj ="";
    if(results.length > 0) {
      obj="{"+
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
    }
    return obj;
}
