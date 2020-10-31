exports.emailIDF = function(req,res,app,db){
    console.log('!!!')
    let authNum = Math.random().toString().substr(2,6);
    
    const ejs = require('ejs');
    let emailTemplete;
    ejs.renderFile('Views/User/user_EmailIDF.ejs', {'authCode' : authNum}, function (err, data) {
      if(err){console.log('ejs.renderFile err:' +err)}
      emailTemplete = data;
    });

    var nodemailer= require('nodemailer');
    var mailConfig = require('../config/mailconfig');

    let smtpTransport = nodemailer.createTransport({
        service: mailConfig.mailservice,
        host: mailConfig.mailhost,
        auth: {
            user: 'kcl5363@naver.com',
            pass: 'ljh5363019892!'
        },
        tls:{
            rejectUnauthorized :false
        }
      });
    

    const mailOptions = {
        from: `IDENTIFY YOUR EMAIL <kcl5363@naver.com>` ,
        to: req.body.email,
        subject: 'identfiy mail',
        html : emailTemplete
      };
      

    smtpTransport.sendMail(mailOptions, (error, info) =>{
        if(error){
            console.log(error);
            res.send(false);
        }else{
            res.send(true);
        }
      });
}