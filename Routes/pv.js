module.exports = function(app,db){
    var express = require('express');
    var router = express.Router();

    router.get('/',function(req,res,next){
        res.render('User/Provider/pv_Description',{'app':app,'session':req.session,'db':db});
    });

    router.get('/Description',function(req,res,next){
        res.render('User/Provider/pv_Description',{'app':app,'session':req.session,'db':db});
    });

    router.get('/EnrollWH',function(req,res,next){
        res.render('User/Provider/pv_EnrollWH',{'app':app,'session':req.session,'db':db});
    });

    router.get('/MyWarehouse',function(req,res,next){
        res.render('User/Provider/pv_MyWH',{'app':app,'session':req.session,'db':db});
    });

    return router;
};
