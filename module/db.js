const mysql = require('mysql');
var db_info = {
    host : 'localhost',
    user : 'root',
    password : '6059',
    database : 'jpdatabase',
};

module.exports = {
    init : function(){
        var connection = mysql.createConnection(db_info);
        connection.connect(function (err){
            if(err) throw err;
            else
              console.log('mysql connection success!');
        });
        return connection;
    }
}
