module.exports = function(app,session,db){
    var express = require('express');
    var router = express.Router();
    const multer = require('multer');
    const upload = multer({ dest: 'Public/Image/'});

    const pv_myWH = require('./pv_MyWH');
    const pv_enrollWH = require('./pv_EnrollWH');

    router.get('/',function(req,res,next){

    });

    router.get('/Enroll',function(req,res,next){
        res.render('User/Provider/pv_EnrollWH',{'app':app,'session':session,'db':db});
    });

    router.post('/Enroll/Submit',upload.single('profile_img'),function(req,res,next){
        console.log(req.file);
        // pv_enrollWH.enrollWH(req,res,app,session,db);
    });

    router.get('/MyWarehouse',function(req,res,next){
        pv_myWH.requestWH(req,res,app,session,db);
    });

    router.post('/MyWarehouse/OK',function(req,res,next){
        pv_myWH.requestWH_OK(req,res,app,session,db);
    });

    router.post('/MyWarehouse/No',function(req,res,next){
        pv_myWH.requestWH_NO(req,res,app,session,db);
    });


    return router;
};
