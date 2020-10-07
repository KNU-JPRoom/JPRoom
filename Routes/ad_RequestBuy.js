exports.requestBuy = function(req,res,app,session,db){
    db.query('SELECT * FROM RequestForBuy', function(error,results,fields){
        if(error) throw error;
        else {
          res.render('User/Admin/ad_RequestBuy',{'app':app,'session':session,'db':db, 'result':results});
        }
    })
}
