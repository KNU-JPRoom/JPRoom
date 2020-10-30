module.exports = function(app,db){
    var express = require('express');
    var router = express.Router();
    var findWH = require('./by_FindWH');

    router.get('/',function(req,res,next){
        res.render('User/Buyer/by_FindWH',{'app':app,'session':req.session,'db':db});
    });
    router.post('/FindWH/FindImage',function(req,res,next){
        console.log('here!!');
        var items = findWH.findImage(req,res,app,db);
        console.log(items);
        res.send(JSON.parse(items));
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