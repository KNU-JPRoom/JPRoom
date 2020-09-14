// Express 설정
const express = require("express");
const app = express();
// 라우터 핸들러 만들기
const login = require('./routes/loginRoutes');
// bodyParser 기능 설정
const bodyParser = require('body-parser');

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 라우터 설정
var router = express.Router();

// 테스트
router.get('/', function(req, res) {
    res.render("");
});

// 라우터 핸들러로 처리
router.post('/register', login.register);
router.post('/login', login.login)
app.use('/api', router);
app.listen(5000);
