exports.register = function (req, res,app,db) {
    var user = {
        "memberID": req.body.memberID,
        "type": req.body.type,
        "name": req.body.name,
        "password": req.body.password,
        "RN": req.body.RN,
        "email": req.body.email,
        "contactNumber": req.body.contactNumber,
        "address": req.body.address,
        "national":req.body.national,
        "CN": req.body.CN,
        "CA" :req.body.CA,
        "CCN": req.body.CCN
    }
    db.query('INSERT INTO Member SET ?' , user, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.redirect('/User/Register');
        } else {
            req.session['memberID'] = user.memberID;
            req.session['type'] = user.type;
            req.session['username'] = user.name;
            req.session['password'] = user.password;
            req.session['RN'] = user.RN;
            req.session['contractNumber'] = user.contactNumber;
            req.session['email'] = user.email;
            req.session['address'] = user.address;
            req.session['CN'] = user.CN;
            req.session['CCN'] = user.CCN;
            req.session['CA'] = user.CA;
            res.redirect('/');
        }
    });
}


exports.checkID = function(req,res,app,db){
    var memberID = req.body.memberID;
    console.log(memberID);
    var b = false;
    db.query(`SELECT * FROM Member WHERE memberID='${memberID}'`,function(error,results,fields){
        if(error){
            console.log("error ocurred",error);
            res.send(false);
        }
        else{
            console.log(results.length);
            if(!results.length)res.send(true);
            else res.send(false);
        }
    })
}