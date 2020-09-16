
// 회원가입 핸들러
exports.register = function (req, res,app,session,db) {
    var today = new Date();
    var user = {
        "id": req.body.id,
        "nickname": req.body.nickname,
        "password": req.body.password,
        "RRN": req.body.RRN,
        "contactNumber": req.body.contactNumber,
        "email": req.body.email,
        "address": req.body.address,
        "CN": req.body.CN,
        "CCN": req.body.CCN,
        "CA" :req.body.CA
    }
    db.query('INSERT INTO memberInfoTable SET ?' , user, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code" : 400,
                "failed": "error ocurred"
            })
        } else {
            session['id'] = user.id;
            session['nickname'] = user.nickname;
            session['password'] = user.password;
            session['RRN'] = user.RRN;
            session['contractNumber'] = user.contactNumber;
            session['email'] = user.email;
            session['address'] = user.address;
            session['CN'] = user.CN;
            session['CCN'] = user.CCN;
            session['CA'] = user.CA;
            session['type'] = 'provider';
            session['name'] = 'kim su hyun';
            res.redirect('/');
        }
    });
}
