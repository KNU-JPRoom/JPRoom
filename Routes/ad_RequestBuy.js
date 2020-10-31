exports.RequestForBuy = function (req, res,app,db) {
  var items="{";
  var sql = `select * from RequestForBuy`;
  console.log(sql);
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
              "\"area\" :"+ results[step].area+
          "}";
          items+=obj;
          if(step+1<results.length)items+=","
      }
  }
  items +="}";
  return items;
}

exports.withAnswer = function(req,res,app,db){
  var reqID = req.body.reqID;
  var reqType = req.body.reqType;
  var answer = req.body.answer;
  var mysql = require('mysql');
  var connection = mysql.createConnection(require('../Module/db').info);
  connection.connect();
  if(answer=="Approve"){
    if(reqType=="ReqByBuyer"){
      connection.query(`UPDATE RequestForBuy SET reqType='ReqByAdmin' WHERE reqID=?`,[reqID],function (error, results, fields) {
        if(error){res.send(false);connection.end()}
        else{
          res.send(true);
          connection.end();
        }
      });
    }
  }
  else if(answer=="Reject"){
    connection.query(`UPDATE RequestForBuy SET reqType='RejByAdmin' WHERE reqID =?`,[reqID],function (error, results, fields) {
      if(error){res.send(false);connection.end()}
      else{
        res.send(true);
        connection.end();
      }
    });
  }
}