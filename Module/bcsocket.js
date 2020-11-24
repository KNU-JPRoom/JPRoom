const net = require('net');
function getConnection(connName){
      var client = net.connect({port:7777,host:'localhost'},function(){
        console.log(connName+"Connected: ");
        this.setTimeout(500);
        this.setEncoding('utf8');
      })
      client.write("WEBSERVER");
      return client;
}
var client;

module.exports = {
    socket : client,
    init : function(){
      client = getConnection("WEB_SERVER");
    }
}