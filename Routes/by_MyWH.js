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
  let sql = `SELECT * from Warehouse,Buyer where Warehouse.warehouseID=Buyer.warehouseID and Buyer.memberID=\'${req.session['memberID']}\'`;
  let results = db.query(sql);
  if(results.length > 0) {
      var step;
      for(step =0;step<results.length;step++){
          items+= ("\"item"+step+"\":");
          sql = `SELECT DISTINCT memberID from Provider where warehouseID=${results[step].warehouseID}`;
          let idList = db.query(sql);
          var obj="{"+
              "\"warehouseID\" :"+ results[step].warehouseID+","+
              "\"warehouseName\" :\""+ results[step].warehouseName+"\","+
              "\"providerID\":\""+idList[0].memberID+"\","+
              "\"enrolledDate\" :\"" + results[step].enrolledDate+"\","+
              "\"address\" :\""+ results[step].address+"\","+
              "\"latitude\" :"+ results[step].latitude+","+
              "\"longitude\" :"+ results[step].longitude+","+
              "\"landArea\" :"+ results[step].landArea +","+
              "\"floorArea\" :"+ results[step].floorArea +","+
              "\"useableArea\" :"+ results[step].useableArea +","+
              "\"price\" :"+ results[step].price +","+
              "\"area\":" +results[step].area+","+
              "\"infoComment\" :\""+ results[step].infoComment+"\","+
              "\"etcComment\" :\""+ results[step].etcComment+"\""+
          "}";
          items+=obj;
          if(step+1<results.length)items+=","
      }
  }
  items +="}";
  console.log(items)
  return items;
}

exports.ReqBuyWithAnswer = function(req,res,app,db){
  var reqID = req.body.reqID;
  var reqType = req.body.reqType;
  var answer = req.body.answer;
  var mysql = require('mysql');
  var connection = mysql.createConnection(require('../Module/db').info);
  const nodePickle= require('pickle');
  connection.connect();
  if(answer=="Cancel"){
      connection.query(`UPDATE RequestForBuy SET reqType='RejByBuyer' WHERE reqID =${reqID}`,function (error, results, fields){
        if(error){res.send(false);connection.end()}
        else{
          res.send(true);
          connection.end();
        }
      });
  }
  else if(answer=="Confirm"){
    if(reqType=="RejByAd"||reqType=="RejByPv"){
      connection.query(`DELETE FROM RequestForBuy WHERE reqID =${reqID}`,function (error, results, fields) {
        if(error){res.send(false);connection.end()}
        else{
          res.send(true);
          connection.end();
        }
    });
    }
  }
  else if(answer=="Accept"){
    if(reqType=="ReqPayByBuyer"){
      connection.query(`UPDATE RequestForBuy SET reqType='ReqPayAcpt' WHERE reqID =${reqID}`,function (error, results, fields) {
          if(error){
            console.log(error);
            res.send(false);
            connection.end();
          }
          else{
            var info = {
              memberID: req.session['memberID'],
              warehouseID: req.body.whID,
              area: req.body.area
            };
            connection.query(`UPDATE Warehouse SET useableArea=useableArea-${info.area} WHERE warehouseID=${info.warehouseID}`);
            connection.query(`INSERT INTO Buyer SET ?`,info,function (error, results, fields) {
                if(error){
                  console.log(error);
                  res.send(false);
                  connection.end()
                }
                else{
                  var sDate = new Date();
                  var eDate = new Date();
                  eDate.setDate(sDate.getDate()+30)
                  let result = db.query('select * from Contract');
                  var conno = result.length+1;
                  var contract = {
                      contractID : conno,
                      buyerID : info['memberID'],
                      warehouseID : info['warehouseID'],
                      startDate : sDate,
                      endDate : eDate,
                      area : info['area'],
                      price : 8,
                      logID : 1
                  };
                  connection.query(`INSERT INTO Contract SET ?`,contract,function (error, results, fields) {
                    if(error){
                      console.log(error);
                      res.send(false);
                      connection.end()
                    }
                    else{
                          var net = require('net');
                          function getConnection(connName){
                                var client = net.connect({port:7777,host:'localhost'},function(){
                                  console.log(connName+"Connected: ");
                                  this.setTimeout(500);
                                  this.setEncoding('utf8');
                                })
                                client.write("WEBSERVER");
                                var dic = {
                                    'MSGTYPE':'RECORD',
                                    'ID':'WEBSERVER',
                                    'data':{
                                        'timestamp':new Date(),
                                        'transaction':`${contract.buyerID} pay ${contract.price} for warehouseID(${contract.warehouseID})`
                                      }
                                }
                                nodePickle.dumps(dic,function(pickled){
                                      client.write(pickled)
                                })
                                client.end();
                            }
                            getConnection("WEB_SERVER");
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