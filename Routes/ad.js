module.exports = function(app,db){
    const express = require('express');
    const router = express.Router();


    router.get('/RequestEnroll',function(req,res,next){
        res.render('User/Admin/ad_RequestEnroll',{'app':app,'session':req.session,'db':db});
    });
    router.post('/RequestEnroll',function(req,res,next){

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