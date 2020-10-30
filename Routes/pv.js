module.exports = function(app,db){
    var express = require('express');
    var router = express.Router();

    const pv_myWH = require('./pv_MyWH');
    const pv_EnrollWH = require('./pv_EnrollWH');
    router.get('/',function(req,res,next){
        res.render('User/Provider/pv_EnrollWH',{'app':app,'session':req.session,'db':db});
    });

    router.get('/EnrollWH',function(req,res,next){
        res.render('User/Provider/pv_EnrollWH',{'app':app,'session':req.session,'db':db});
    });

    router.post('/EnrollWH',function(req,res,next){
        let upLoadFile = req.files
        const fileName = req.files.profile_img.name ;
        console.log(upLoadFile);
        console.log(fileName);
        upLoadFile.profile_img.mv(
            `./Public/Upload/${fileName}`,
            function(err){
                if(err){
                    return req.status(500).send(err);
                }
                pv_EnrollWH.EnrollWH(req,res,app,db,fileName);
            }
        )
    });

    router.get('/MyWarehouse',function(req,res,next){
        pv_myWH.requestWH(req,res,app,req.session,db);
    });

    router.get('/MyWarehouse',function(req,res,next){
        res.render('User/Provider/pv_MyWH',{'app':app,'session':req.session,'db':db});
    });

    return router;
};