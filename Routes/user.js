module.exports = function(app,session,db){
    var express = require('express');
    var router = express.Router();

    const register = require('./user_Register');
    const login = require('./user_Login');
    const edit = require('./user_Edit');
    const del = require('./user_Delete');
    const logout = require('./user_Logout');

    router.get('/Register',function(req,res,next){
        res.render('User/user_Register',{'app':app,'session':session,'db':db});
    });
    router.post('/Register',function(req,res,next){
        register.register(req,res,app,session,db);
    });

    router.get('/Login',function(req,res,next){
        res.render('User/user_Login',{'app':app,'session':session,'db':db});
    });
    router.post('/Login',function(req,res,next){
        login.login(req,res,app,session,db);
    });

    router.get('/Edit',function(req,res,next){
        res.render('User/user_Edit',{'app':app,'session':session,'db':db});
    });
    router.post('/Edit',function(req,res,next){
        edit.edit(req,res,app,session,db);
    });

    router.get('/Show',function(req,res,next){
        res.render('User/user_Show',{'app':app,'session':session,'db':db});
    });

    router.get('/Delete',function(req,res,next){
        res.render('User/user_Delete',{'app':app,'session':session,'db':db});
    });
    router.post('/Delete',function(req,res,next){
        del.del(req,res,app,session,db);
    });
    router.get('/Logout',function(req,res,next){
        logout.logout(req,res,app,session,db);
    });

    return router;
};