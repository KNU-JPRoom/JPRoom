exports.RequestForEnroll = function (req, res,app,db) {
  var items="{";
  let results = db.query('SELECT * from RequestForEnroll');
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

exports.withAnswer = function(req,res,app,db){
  var reqID = req.body.reqID;
  var reqType = req.body.reqType;
  var answer = req.body.answer;
  var group = req.body.group;
  var mysql = require('mysql');
  var connection = mysql.createConnection(require('../Module/db').info);
  connection.connect();
  if(answer="Accept"){
    if(reqType=="RequestEnroll_byProvider"){
     
    }
  }
  else if(answer="Reject"){
    connection.query(`UPDATE RequestForBuy SET reqType='RequestRejected_byBuyer' WHERE reqID =?`,[reqID],function (error, results, fields) {
      if(error){
        res.send(false);
      }
      else
        res.send(true);
    });
  }
  connection.end();
}
