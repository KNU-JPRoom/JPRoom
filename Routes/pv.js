module.exports = function(app,session,db){
    var express = require('express');
    var router = express.Router();

    const pv_myWH = require('./pv_MyWH');

    router.get('/',function(req,res,next){
        res.render('User/Provider/pv_Description',{'app':app,'session':session,'db':db});
    });

    router.get('/EnrollWH',function(req,res,next){
        res.render('User/Provider/pv_EnrollWH',{'app':app,'session':session,'db':db});
    });

    router.get('/MyWarehouse',function(req,res,next){
        pv_myWH.requestWH(req,res,app,session,db);
    });

    router.get('/MyWarehouse',function(req,res,next){
        res.render('User/Provider/pv_MyWH',{'app':app,'session':session,'db':db});
    });

    return router;
};
