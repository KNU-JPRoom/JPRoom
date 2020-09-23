module.exports = function(app,db){
    var express = require('express');
    var router = express.Router();
    router.get('/',function(req,res,next){
        res.render('main_Home',{'app':app,'session':req.session,'db':db});
    });
    router.get('/About',function(req,res,next){
        res.render('main_About',{'app':app,'session':req.session,'db':db});
    });
    return router;
};
