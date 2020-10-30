module.exports = function(app,db){
    const express = require('express');
    const router = express.Router();
    const ad_ReqEnroll = require('./ad_RequestEnroll');

    router.get('/RequestEnroll',function(req,res,next){
        var items = ad_ReqEnroll.RequestForEnroll(req,res,app,db);
        console.log(items);
        res.render('User/Admin/ad_RequestEnroll',{'app':app,'session':req.session,'db':db,'items':JSON.parse(items)});
    });
    router.post('/RequestEnroll',function(req,res,next){
        console.log('!!!!!');
        ad_ReqEnroll.withAnswer(req,res,app,db);
    });
    router.get('/RequestBuy',function(req,res,next){
        res.render('User/Admin/ad_RequestBuy',{'app':app,'session':req.session,'db':db});
    });
    router.post('/RequestBuy',function(req,res,next){
       
    });
    router.get('/Question',function(req,res,next){
        res.render('User/Admin/ad_Question',{'app':app,'session':req.session,'db':db});
    });

    return router;
};