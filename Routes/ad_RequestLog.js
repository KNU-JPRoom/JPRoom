exports.requestLOG = function(req,res,app,session,db){
    db.query('SELECT * FROM ?', function(error,results,fields){
        if(error) throw error;
        else {
          res.render('User/Admin/ad_RequestLog',{'app':app,'session':session,'db':db, 'result':results});
        }
    })
}
