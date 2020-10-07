
// 회원가입 핸들러
exports.register = function (req, res,app,db) {
    var mysql = require('mysql');
    var connection = mysql.createConnection(require('../Module/db').info);
    connection.connect();
    var user = {
        "memberID": req.body.memberID,
        "type": req.body.type,
        "name": req.body.name,
        "password": req.body.password,
        "RN": req.body.RN1+'-'+req.body.RN2,
        "email": req.body.email,
        "contactNumber": req.body.contactNumber1+'-'+req.body.contactNumber2+'-'+req.body.contactNumber3,
        "address": req.body.address,
        "national":req.body.national,
        "CN": req.body.CN,
        "CA" :req.body.CA,
        "CCN": req.body.CCN
    }
    connection.query('INSERT INTO Member SET ?' , user, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.redirect('/User/Register');
        } else {
            req.session['memberID'] = user.memberID;
            req.session['type'] = user.type;
            req.session['username'] = user.name;
            req.session['password'] = user.password;
            req.session['RN'] = user.RN;
            req.session['contactNumber'] = user.contactNumber;
            req.session['email'] = user.email;
            req.session['address'] = user.address;
            req.session['national'] = user.national;
            req.session['CN'] = user.CN;
            req.session['CCN'] = user.CCN;
            req.session['CA'] = user.CA;
            res.redirect('/');
        }
        connection.end()
    });
}


exports.checkID = function(req,res,app,db){
    var memberID = req.body.memberID;
    console.log(memberID);
    var b = false;
    var results = db.query(`SELECT * FROM Member WHERE memberID='${memberID}'`);
    if(!results.length)res.send(true);
    else res.send(false);
}