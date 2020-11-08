exports.RequestForEnroll = function (req, res,app,db) {
  var items="{";
  var sql = "SELECT * from RequestForEnroll where providerID ='"+req.session['memberID']+"'";
  let results = db.query(sql);
  if(results.length > 0) {
      var step;
      for(step =0;step<results.length;step++){
          items+= ("\"item"+step+"\":");
          var obj="{"+
              "\"reqID\" :"+ results[step].reqID+","+
              "\"reqDate\" :\""+ results[step].reqDate+"\","+
              "\"reqType\" :\"" + results[step].reqType+"\","+
              "\"warehouseID\" :"+ results[step].warehouseID+","+
              "\"providerID\" :\""+ results[step].providerID  +"\""+
          "}";
          items+=obj;
          if(step+1<results.length)items+=","
      }
  }
  items +="}";
  return items;
}

exports.RequestForBuy = function (req, res,app,db) {
  var items="{";
  var sql = "select * from RequestForBuy where warehouseID in (SELECT warehouseID from Provider where memberID='"+req.session['memberID']+"')";
  let results = db.query(sql);
  if(results.length > 0) {
      var step;
      for(step =0;step<results.length;step++){
          items+= ("\"item"+step+"\":");
          var obj="{"+
              "\"reqID\" :"+ results[step].reqID+","+
              "\"reqDate\" :\""+ results[step].reqDate+"\","+
              "\"reqType\" :\"" + results[step].reqType+"\","+
              "\"warehouseID\" :"+ results[step].warehouseID+","+
              "\"buyerID\" :\""+ results[step].buyerID+"\""+
          "}";
          items+=obj;
          if(step+1<results.length)items+=","
      }
  }
  items +="}";
  console.log(items);
  return items;
}



exports.Mywarehouse = function(req,res,app,db){
  var items="{";
  let sql = `SELECT * from Warehouse,Provider where Warehouse.warehouseID=Provider.warehouseID and Provider.memberID=\'${req.session['memberID']}\'`;
  let results = db.query(sql);
  if(results.length > 0) {
      var step;
      for(step =0;step<results.length;step++){
          sql = `select  distinct memberID from Buyer where warehouseID=${results[step].warehouseID}`;
          let idList = db.query(sql);
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
              "\"etcComment\" :\""+ results[step].etcComment+"\","+
              "\"memberList\": ["; 
              for(i =0;i<idList.length;i++){
               obj+="\""+idList[i].memberID+"\"";
                if(i+1<idList.length)obj+=",";
              }
              obj+="]";
          obj+="}";
          items+=obj;
          if(step+1<results.length)items+=",";
      }
  }
  items +="}";
  console.log(items)
  return items;
}

exports.ReqEnrollAns = function(req,res,app,db){
  var warehouseID = req.body.whID;
  var reqID = req.body.reqID;
  var answer = req.body.answer;
  var mysql = require('mysql');
  var connection = mysql.createConnection(require('../Module/db').info);
  connection.connect();
  if(answer="Confirm"){
    connection.query(`DELETE FROM RequestForEnroll WHERE reqID =${reqID}`,function (error, results, fields) {
      if(error){
        console.log(error);
        res.send(false);
        connection.end();
      }
      else{
        res.send(true);
        connection.end();
      }
    });    
  }
    else if(answer="Cancel"){
      connection.query(`DELETE FROM RequestForEnroll WHERE reqID =${reqID}`,function (error, results, fields) {
        if(error){
          console.log(error);
          res.send(false);
          connection.end();
        }
        else{
          connection.query(`DELETE FROM Warehouse WHERE warehouseID =${warehouseID}`,function (error, results, fields) {
            if(error){
              console.log(error);
              res.send(false);
              connection.end();
            }
            else{
              connection.query(`DELETE FROM FileInfo WHERE warehouseID =${warehouseID}`,function (error, results, fields) {
                if(error){
                  console.log(error);
                  res.send(false);
                  connection.end();
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

exports.ReqBuyAns = function(req,res,app,db){
  var reqID = req.body.reqID;
  var reqType = req.body.reqType;
  var answer = req.body.answer;
  console.log(answer);
  var mysql = require('mysql');
  var connection = mysql.createConnection(require('../Module/db').info);
  connection.connect();
  if(answer=="Approve"){
      if(reqType=="ReqByAdmin"){
        connection.query(`UPDATE RequestForBuy SET reqType='ReqPayByBuyer' WHERE reqID =${reqID}`,function (error, results, fields){
          if(error){res.send(false);connection.end();}
          else{
            res.send(true);
            connection.end();
          }
        });
      }
    }
  else if(answer=="Cancel"){
    connection.query(`UPDATE RequestForBuy SET reqType='RejByPv' WHERE reqID =${reqID}`,function (error, results, fields){
      if(error){res.send(false);connection.end();}
          else{
            res.send(true);
            connection.end();
          }
    });
  }
  else if(answer=="Confirm"){
    if(reqType=="ReqPayAcpt"||reqType=="RejByBuyer"){
        connection.query(`DELETE FROM RequestForBuy WHERE reqID =${reqID}`,function (error, results, fields) {
          if(error){res.send(false);connection.end();}
          else{
            res.send(true);
            connection.end();
          }
        });
    }
  }
}