exports.edit = function (req, res,app,db) {
    var password = req.body.password;
    var email = req.body.email;
    var contactNumber = req.body.contactNumber;
    var address = req.body.address;
    var national = req.body.national;
    var CN = req.body.CN;
    var CA = req.body.CA;
    var CCN = req.body.CCN;
    var SQL = `UPDATE Member SET password=?,email=?,contactNumber=?,
    address=?,national=?,CN=?,CA=?,CCN=? WHERE memberID='${req.session.memberID}'`
    db.query(SQL,[password,email,contactNumber,address,national,CN,CA,CCN],
    function( error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.redirect('/User/Edit');
        } else {
                req.session['password'] = password;
                req.session['email'] = email;
                req.session['contactNumber'] = contactNumber;
                req.session['address'] = address;
                req.session['national'] = national;
                req.session['CN'] = CN;
                req.session['CA'] = CA;
                req.session['CCN'] = CCN;
                res.redirect('/');    
        }
    })
}