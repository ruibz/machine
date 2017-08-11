var http = require('http');
var fs = require('fs');
var path = require('path');
const readline = require('readline');

var Hello = require('./machine');
hello = new Hello();
 
http.createServer(function(req, res){

  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

  const rl = readline.createInterface({
    input: fs.createReadStream('machines.txt'),
    terminal: true
  });

  rl.on('line', (line) => {
    var fileName = __dirname.toString() + "/files/" + line + ".txt";
    fs.exists(fileName, function(exists){
        if(!exists){
            //res.write(fileName + ' not exists.');
        }else{
          var data=fs.readFileSync(fileName,"utf-8");
          res.write(data.toString());
        }
    });

  }).on('close', () => {
    res.end();
  });

}).listen(8888);

