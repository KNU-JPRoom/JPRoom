module.exports = function(app,session,db){
    var express = require('express');
    var router = express.Router();

    router.get('/',function(req,res,next){
        res.render('User/Buyer/by_FindWH',{'app':app,'session':session,'db':db});
    });

    router.get('/FindWH',function(req,res,next){
        res.render('User/Buyer/by_FindWH',{'app':app,'session':session,'db':db});
    });

    router.get('/MyWarehouse',function(req,res,next){
        res.render('User/Buyer/by_MyWH',{'app':app,'session':session,'db':db});
    });

    return router;
};
