
module.exports = function(app,session,db){
    var express = require('express');
    var router = express.Router();

    router.get('/',function(req,res,next){
        res.render('User/Admin/ad_Description',{'app':app,'session':session,'db':db});
    });

    router.get('/Description',function(req,res,next){
    	res.render('User/Admin/ad_Description',{'app':app,'session':session,'db':db});
    });
    router.get('/Request',function(req,res,next){
        res.render('User/Admin/ad_Request',{'app':app,'session':session,'db':db});
    });

    router.get('/Question',function(req,res,next){
        res.render('User/Admin/ad_Question',{'app':app,'session':session,'db':db});
    });

    return router;
};
