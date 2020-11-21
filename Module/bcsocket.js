const net = require('net');
function getConnection(connName){
      var client = net.connect({port:7777,host:'localhost'},function(){
        console.log(connName+"Connected: ");
        this.setTimeout(500);
        this.setEncoding('utf8');
      })
      return client;
}
var client = getConnection("WEB_SERVER");

module.exports = {
    socket : client
}