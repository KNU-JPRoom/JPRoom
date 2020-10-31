module.exports = function(app,db){
    var express = require('express');
    var router = express.Router();
    var findWH = require('./by_FindWH');
    var MyWH = require('./by_MyWH');

    router.get('/',function(req,res,next){
        res.render('User/Buyer/by_FindWH',{'app':app,'session':req.session,'db':db});
    });
    router.post('/FindWH/FindImage',function(req,res,next){
        var items = findWH.findImage(req,res,app,db);
        res.send(JSON.parse(items));
    });
    router.post('/FindWH/Inquire',function(req,res,next){
        findWH.inquireWH(req,res,app,db);
    });
    router.get('/FindWH',function(req,res,next){
        var items = findWH.findWH(req,res,app,db);
        res.render('User/Buyer/by_FindWH',{'app':app,'session':req.session,'db':db,'items':items});
    });

    router.get('/MyWarehouse',function(req,res,next){
        var items = MyWH.RequestForBuy(req,res,app,db);
        items = JSON.parse(items);
        res.render('User/Buyer/by_MyWH',{'app':app,'session':req.session,'db':db,'items':items});
    });

    router.post('/MyWarehouse/Buy/Ans',function(req,res,next){
        MyWH.ReqBuyWithAnswer(req,res,app,db);
    });

    return router;
};