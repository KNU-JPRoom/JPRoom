exports.enrollWH = function(req,res,app,db){
    db.query('SELECT * FROM RequestForBuy', function(error,results,fields){
        if(error) throw error;
        else {
          res.render(results);
          res.send(ejs.render(data, {
            data: results
          }))
        }
    })
}
