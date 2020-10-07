module.exports = function(app,session,db){
    const express = require('express');
    const router = express.Router();

    const ad_RequestEnroll = require('./ad_RequestEnroll');
    const ad_Requestbuy = require('./ad_RequestBuy');
    const ad_Requestlog = require('./ad_RequestLog');

    router.get('/RequestEnroll',function(req,res,next){
        ad_RequestEnroll.requestWH(req,res,app,session,db);
    });

    router.get('/RequestEnroll',function(req,res,next){
        ad_RequestEnroll.requestWH_OK(req,res,app,db);
    });

    router.get('/RequestEnroll',function(req,res,next){
        ad_RequestEnroll.requestWH_NO(req,res,app,db);
    });

    router.get('/RequestBuy',function(req,res,next){
      ad_Requestbuy.requestBuy(req,res,app,session,db);
    });

    router.get('/Question',function(req,res,next){
        res.render('User/Admin/ad_Question',{'app':app,'session':session,'db':db});
    });

    router.get('/Log',function(req,res,next){
        ad_Requestlog.requestLOG(req,res,app,db);
    });

    return router;
};
