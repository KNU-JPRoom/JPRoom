exports.requestWH = function(req,res,app,db){
    db.query('SELECT * FROM RequestForEnroll', function(error,results,fields){
        if(error) throw error;
        else {
          res.render(results);
          res.send(ejs.render(data, {
            data: results
          }))
        }
    })
}
