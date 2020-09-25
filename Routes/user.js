module.exports = function(app,db){
    var express = require('express');
    var router = express.Router();

    const register = require('./user_Register');
    const login = require('./user_Login');
    const edit = require('./user_Edit');
    const del = require('./user_Delete');
    const logout = require('./user_Logout');
    const emailIDF = require('./user_EmailIDF');
    router.post('/Register/MemberID',function(req,res,next){
        register.checkID(req,res,app,db);
    })
    router.post('/Register/EmailIDF',function(req,res,next){
        emailIDF.emailIDF(req,res,app,db);
    });
    router.post('/Register',function(req,res,next){
        register.register(req,res,app,db);
    });

    router.get('/Register',function(req,res,next){
        res.render('User/user_Register',{'app':app,'session':req.session,'db':db});
    });

    router.get('/Login',function(req,res,next){
        res.render('User/user_Login',{'app':app,'session':req.session,'db':db});
    });
    router.post('/Login',function(req,res,next){
        login.login(req,res,app,db);
    });

    router.get('/Edit',function(req,res,next){
        res.render('User/user_Edit',{'app':app,'session':req.session,'db':db});
    });
    router.post('/Edit',function(req,res,next){
        edit.edit(req,res,app,db);
    });

    router.get('/Show',function(req,res,next){
        res.render('User/user_Show',{'app':app,'session':req.session,'db':db});
    });

    // router.get('/Delete',function(req,res,next){
    //     res.render('User/user_Delete',{'app':app,'session':req.session,'db':db});
    // });
    router.get('/Delete',function(req,res,next){
        require('../module/global').result = false; 
        del.del(req,res,app,db);
        if( require('../module/global').result){
            req.session.destroy();
            res.redirect('/');
        }
        else res.send(false);
    });
    router.get('/Logout',function(req,res,next){
        req.session.destroy();
        logout.logout(req,res,app,db);
    });


    return router;
};