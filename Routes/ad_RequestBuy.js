exports.RequestForBuy = function (req, res,app,db) {
  var items="{";
  let results = db.query('SELECT * from RequestForBuy');
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

exports.withAnswer = function(req,res,app,db){
  var reqID = req.body.reqID;
  var reqType = req.body.reqType;
  var answer = req.body.answer;
  var group = req.body.group;
  var mysql = require('mysql');
  var connection = mysql.createConnection(require('../Module/db').info);
  connection.connect();
  if(answer="Accept"){
    if(reqType=="RequestBuy_byBuyer"){
      
    }
    else if(reqType="RequestPay_Accepted"){
      
    }
  }
  else if(answer="Reject"){
    connection.query(`UPDATE RequestForBuy SET reqType='RequestRejected_byAdmin' WHERE reqID =?`,[reqID],function (error, results, fields) {
      if(error){
        res.send(false);
      }
      else
        res.send(true);
    });
  }
  connection.end();
}