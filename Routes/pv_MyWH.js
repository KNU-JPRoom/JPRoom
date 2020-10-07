exports.requestWH = function(req,res,app,session,db){
    db.query('SELECT * FROM Warehouse WHERE id=?', req.session['memberID'],
        function(error,results,fields){
          if(error) throw error;
          else {
            res.render('User/Provider/pv_MyWH',{'app':app,'session':session,'db':db, 'result':results});
          }
    })
}
