
module.exports = function(app,session,db){
    const express = require('express');
    const router = express.Router();
    const ejs = require('ejs');
    const request = require('./ad_Request');

    router.get('/Description',function(req,res,next){
      res.render('User/Admin/ad_Description',{'app':app,'session':session,'db':db});
    });

    router.get('/Request',function(req,res,next){
      request.requestWH(req,res,app,db);
      res.render('User/Admin/ad_Request',{'app':app,'session':session,'db':db});
    });

    router.get('/Question',function(req,res,next){
        res.render('User/Admin/ad_Question',{'app':app,'session':session,'db':db});
    });

    return router;
};
