exports.login = function (req, res,app,db) {
    var memberID = req.body.memberID;
    var password = req.body.password;
    db.query('SELECT * FROM Member WHERE memberID = ?', [memberID],
    function( error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.redirect('/User/Login');
        } else {
            if(results.length > 0) {
                if(results[0].password == password) {
                    req.session['memberID'] = results[0].memberID;
                    req.session['type'] =  results[0].type;
                    req.session['username'] = results[0].name;
                    req.session['password'] = results[0].password;
                    req.session['RN'] = results[0].RN;
                    req.session['email'] = results[0].email;
                    req.session['contactNumber'] = results[0].contactNumber;
                    req.session['address'] = results[0].address;
                    req.session['national'] = results[0].national;
                    req.session['CN'] = results[0].CN;
                    req.session['CA'] = results[0].CA;
                    req.session['CCN'] = results[0].CCN;
                    res.redirect('/');
                } else {
                    res.redirect('/User/Login');
                }
            } else {
                res.redirect('/User/Login');
            }
        }
    })
}