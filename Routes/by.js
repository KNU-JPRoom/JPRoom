module.exports = function(app,db){
    var express = require('express');
    var router = express.Router();
    var findWH = require('./by_Find');

    router.get('/',function(req,res,next){
        res.render('User/Buyer/by_FindWH',{'app':app,'session':req.session,'db':db});
    });

    router.get('/FindWH',function(req,res,next){
        var items = findWH.findWH(req,res,app,db);
        console.log(items);
        res.render('User/Buyer/by_FindWH',{'app':app,'session':req.session,'db':db,'items':items});
    });

    router.get('/MyWarehouse',function(req,res,next){
        res.render('User/Buyer/by_MyWH',{'app':app,'session':req.session,'db':db});
    });

    return router;
};
