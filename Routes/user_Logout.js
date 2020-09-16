exports.logout = function(req,res,app,session,db){
   session.nickname=null;
   res.redirect('/');

}