var http = require('http');
var fs = require('fs');
var path = require('path');
var util = require('util');
const readline = require('readline');

function splitFileToLines(fileName, lines) {
  const rl = readline.createInterface({
    input: fs.createReadStream(fileName),
    terminal: true
  });
  rl.on('line', (line) => {
    fs.exists(fileName, function(exists){
        if(!exists){
            ;
        }else{
          var data=fs.readFileSync(fileName,"utf-8");
          console.log(line.toString());
          lines.push(line.toString());
        }
    });
  }).on('close', () => {
  console.log(util.inspect(lines));
    ;
  });

}

http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.write('<html><head><meta charset="utf-8"><title>machines</title></head> <body>');

  var lines = [];
  var fileName = __dirname.toString() + "/machines.txt";
  splitFileToLines(fileName, lines);
  console.log("done!");

}).listen(8888);

