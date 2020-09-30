
module.exports = function(app,session,db){
    const express = require('express');
    const router = express.Router();
    const ejs = require('ejs');

    const requestE = require('./ad_RequestEnroll');
    const requestB = require('./ad_RequestBuy');

    router.get('/Description',function(req,res,next){
      res.render('User/Admin/ad_Description',{'app':app,'session':session,'db':db});
    });

    router.get('/RequestEnroll',function(req,res,next){
      requestE.requestWH(req,res,app,db);
      res.render('User/Admin/ad_RequestEnroll',{'app':app,'session':session,'db':db});
    });

    router.get('/RequestBuy',function(req,res,next){
      requestB.requestBuy(req,res,app,db);
      res.render('User/Admin/ad_RequestBuy',{'app':app,'session':session,'db':db});
    });

    router.get('/Question',function(req,res,next){
        res.render('User/Admin/ad_Question',{'app':app,'session':session,'db':db});
    });

    return router;
};
