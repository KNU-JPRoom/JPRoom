const mysql = require('mysql');
var db_info = {
    host : 'localhost',
    user : 'root',
    password : 'rkfaorl4!',
    database : 'JPdatabase'
};

module.exports = {
    init : function(){
        var connection = mysql.createConnection(db_info);
        connection.connect(function (err){
            if(err)console.log('mysql connect error!');
            else console.log('mysql connection success!');
        });
        return connection;
    }
}