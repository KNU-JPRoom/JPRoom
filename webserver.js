// 0. 모듈 불러오기
// 1) Express Module 불러오기
const express = require('express');
const app = express();
// 2) bodyParser Module 불러오기
const bodyParser = require('body-parser');
// 3) MySQL Module 불러오기
const mySQL  = require('./Module/db');
// 4) EJS Module 불러오기
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const paypal = require("paypal-rest-sdk");
const nodePickle= require('pickle');
const bcsock = require('./Module/bcsocket');
// 1. 설정
// 1) View 경로 설정
app.set('views',__dirname+'/Views');
// 2) 화면 Engine을 ejs로 설정
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);
// 3) Session 설정(생성)
var session = require('express-session');
// 4) 중첩된 객체허용 여부 결정
app.use(bodyParser.urlencoded({extended: true}));
// 5) JSON 방식의 Content-Type 데이터를 받기
app.use(bodyParser.json());
// 6) 'Public' Directory에 정적 파일(사진, 이미지)을 위치시키기
app.use(express.static('Public'));
// 7) CORS 허용
app.use(function(req,res,next){
 	res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
	next();
});
app.use(fileUpload({
  limits:{fileSize:50*1024*1024}
}));

// 8) 세션을 적용
app.use(session({
		// 8-1) 세션 암호화
    secret: '@#@$SIGN#@$#$',
		// 8-2) 수정사항이 생기지 않은 세션 요청이 왔을 때 다시 저장할지
    resave: false,
		// 8-3) 세션에 저장할 내역이 없더라도, 세션 저장할지
    saveUninitialized: true
}));
// 9) mySQL Connection 변수를 저장
var dbConnection = mySQL.init();

// 10) 각 라우터에 인자값을 넘겨주는 것
app.use('/',require('./Routes/main')(app,dbConnection));
app.use('/User',require('./Routes/user')(app,dbConnection));
app.use('/Admin',require('./Routes/ad')(app,dbConnection));
app.use('/Provider',require('./Routes/pv')(app,dbConnection));
app.use('/Buyer',require('./Routes/by')(app,dbConnection));

app.get('/Public/Upload/:filename',function(req,res){
  console.log(req);
  console.log(req.params.filename);
  fs.readFile(__dirname+`/Public/Upload/${req.params.filename}`,function(err,data){
    if (err) throw err;
    res.write(data);
  })
});


app.post('/RFID',function(req,res){
  var rfid = req.body.param;
  var url = "select * from jpdatabase.Order where idRFID='"+rfid+"'";
  let orders = dbConnection.query(url);
  var items=[];
  var data = {"info":items};
  if(orders.length>0){
    for(var i =0;i<orders.length;++i){
      var obj = {};
      obj['oid']=orders[i].oid;
      obj['orderer']=orders[i].orderer;
      obj['destination']=orders[i].destination;
      obj['status']=orders[i].status;
      obj['orderinfo']=[];
      url = "select * from OrderInfo where oid="+orders[i].oid;
      let orderInfos = dbConnection.query(url); 
      for(var t=0;t<orderInfos.length;++t){
        var packet = {};
        packet['partname'] = orderInfos[t].partname;
        packet['cnt'] = orderInfos[t].cnt;
        obj['orderinfo'].push(packet);
      }
      data["info"].push(obj);
    }
  }
  res.json(data);
});


app.post('/RFID/Update',function(req,res){
  var mysql = require('mysql');
  var oid = req.body.oid;
	console.log(req.body);
  var connection = mysql.createConnection(require('./Module/db').info);
  connection.connect();
  var url = `update jpdatabase.Order set jpdatabase.Order.status='complete' where oid=${oid}and jpdatabase.Order.status='ready'`;
  connection.query(url,function(error,results,fields){
    if(error)
    res.send({
      "success":false,
      "reason":"unknown error!"
    });
    else
    res.send({
      "success":true
    });
  });
});



// 11) 서버를 열 때 설정 함수
app.listen(5000,function(req,res){
    console.log('connected!!');
});


                            
