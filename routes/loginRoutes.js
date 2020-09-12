// 회원가입 핸들러
exports.register = function (req, res) {
    var today = new Date();
    var users = {
        "id": req.body.id,
        "nickname": req.body.nickname,
        "password": req.body.password,
        "RRN": req.body.RRN,
        "contactNumber": req.body.contactNumber,
        "email": req.body.email,
        "address": req.body.address,
        "CN": req.body.CN,
        "CCN": req.body.CCN
    }
    connenction.query('INSERT INTO memberInfoTable SET ?' , users, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code" : 400,
                "failed": "error ocurred"
            })
        } else {
            console.log('The solution is: ', results);
            res.send({
                "code": 200,
                "success": "user registered"
            });
        }
    });
}

// 로그인 핸들러
exports.login = function (req, res) {
    var id = req.body.id;
    var password = req.body.password;
    connection.query('SELECT * FROM memberInfoTable WHERE id = ?', [id],
    function( error, results, fields) {
        if (error) {
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            if(results.length > 0) {
                if(results[0].password == password) {
                    res.send({
                        "code": 200,
                        "success": "login sucessfull"
                    });
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
