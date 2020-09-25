
exports.del = function (req, res,app,db,result) {
    var DeletedDate = new Date();
    var WDeletedDate = new Date();
    WDeletedDate.setDate(WDeletedDate.getDate()+30)
    var user = {
        "memberID": req.session['memberID'],
        "type": req.session['type'],
        "name": req.session['username'],
        "password": req.session['password'],
        "RN": req.session['RN'],
        "email": req.session['email'],
        "contactNumber": req.session['contactNumber'],
        "address": req.session['address'],
        "national": req.session['national'],
        "CN": req.session['CN'],
        "CA" : req.session['CA'],
        "CCN": req.session['CCN'],
        "DeletedDate" : DeletedDate,
        "WDeletedDate" : WDeletedDate
    }
    console.log(DeletedDate);
    console.log(WDeletedDate);
    var tablename = "Provider";
    if(user.type=="buyer")tablename="Buyer";
    tablename.replace("'","");
    user.memberID.replace("'","");
    console.log(tablename);
    console.log(user.memberID);

    db.query(`SELECT * FROM ${tablename} WHERE memberID='${user.memberID}'`,
            function( error, results, fields) {
                if (error) {
                    console.log("error ocurred", error);
                } else {
                    if(results.length==0){
                        db.query('DELETE FROM Member WHERE memberID=?' , user.memberID, function (error, results, fields) {
                            if (error) {
                                console.log("error ocurred", error);
                            } else {
                                db.query('INSERT INTO DeletedMember SET ?' , user, function (error, results, fields) {
                                    if (error) {
                                        console.log("error ocurred", error);
                                    } else {
                                        result = true;
                                    }
                                });
                            }
                        });
                    }

                }
        })
}