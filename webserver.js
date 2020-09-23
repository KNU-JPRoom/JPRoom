// 0. ��� �ҷ�����
// 1) Express Module �ҷ�����
const express = require('express');
const app = express();
// 2) bodyParser Module �ҷ�����
const bodyParser = require('body-parser');
// 3) MySQL Module �ҷ�����
const mySQL  = require('./module/db');
// 4) EJS Module �ҷ�����
const ejs = require('ejs');

// 1. ����
// 1) View ��� ����
app.set('views',__dirname+'/views');
// 2) ȭ�� Engine�� ejs�� ����
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);
// 3) Session ����(����)
var session = require('express-session');
// 4) ��ø�� ��ü��� ���� ����
app.use(bodyParser.urlencoded({extended: true}));
// 5) JSON ����� Content-Type �����͸� �ޱ�
app.use(bodyParser.json());
// 6) 'Public' Directory�� ���� ����(����, �̹���)�� ��ġ��Ű��
app.use(express.static('Public'));
// 7) CORS ���
app.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
// 8) ������ ����
app.use(session({
		// 8-1) ���� ��ȣȭ
    secret: '@#@$SIGN#@$#$',
		// 8-2) ���������� ������ ���� ���� ��û�� ���� �� �ٽ� ��������
    resave: false,
		// 8-3) ���ǿ� ������ ������ ������, ���� ��������
    saveUninitialized: true
}));
// 9) mySQL Connection ������ ����
var dbConnection = mySQL.init();
// 10) �� ����Ϳ� ���ڰ��� �Ѱ��ִ� ��
app.use('/',require('./Routes/main')(app,dbConnection));
app.use('/User',require('./Routes/user')(app,dbConnection));
app.use('/Admin',require('./Routes/ad')(app,dbConnection));
app.use('/Provider',require('./Routes/pv')(app,dbConnection));
app.use('/Buyer',require('./Routes/by')(app,dbConnection));
// 11) ������ �� �� ���� �Լ�
app.listen(5000,function(req,res){
    console.log('connected!!');
});
