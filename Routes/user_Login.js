
// 로그인 핸들러
exports.login = function (req, res,app,session,db) {
    var nickname = req.body.nickname;
    var password = req.body.password;
    db.query('SELECT * FROM memberInfoTable WHERE nickname = ?', [nickname],
    function( error, results, fields) {
        if (error) {
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            if(results.length > 0) {
                if(results[0].password == password) {
                    console.log("error ocurred", error);
                    session['id'] = results[0].id;
                    session['nickname'] = results[0].nickname;
                    session['password'] = results[0].password;
                    session['RRN'] = results[0].RRN;
                    session['contractNumber'] = results[0].contactNumber;
                    session['email'] = results[0].email;
                    session['address'] = results[0].address;
                    session['CN'] = results[0].CN;
                    session['CCN'] = results[0].CCN;
                    session['CA'] = results[0].CA;
                    session['type'] = 'provider';
                    session['name'] = 'kim su hyun';
                    res.redirect('/');
                } else {
                    res.send({
                        "code": 204,
                        "success": "id and password does not match"
                    });
                }
            } else {
                res.send({
                    "code":204,
                    "success": "id does not exists"
                });
            }
        }
    })
}

