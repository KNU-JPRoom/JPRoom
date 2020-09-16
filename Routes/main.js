module.exports = function(app,session,db){
    var express = require('express');
    var router = express.Router();

    session['nickname']='jjj';
    session['type']='admin';
    session['email']='ABC@naver.com';
    session['name']='kim su hyun';

    router.get('/',function(req,res,next){
        res.render('main_Home',{'app':app,'session':session,'db':db});
    });

    router.get('/About',function(req,res,next){
        res.render('main_about',{'app':app,'session':session,'db':db});
    });

    return router;
};
