var http = require('http');
var fs = require('fs');
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
const readline = require('readline');
var fileSplit = require('./fileSplit');
var test = require('./test');
var event = new EventEmitter();

event.on('readLineFromMachineFile', function (req, res, line) {
  var lines = [];
  var fileName = __dirname + "/files/" + line + ".txt";
  fs.exists(fileName, function(exists){
    if(exists){
      const rl = readline.createInterface({
        input: fs.createReadStream(fileName),
        terminal: true
      });
      rl.on('line', (line) => {
          lines.push(line.toString());
      }).on('close', () => {
        res.write('<table border="1"><tr>');
        lines.forEach(function(item,index){  
          res.write('<th>' + item + '</th>');
        });
        res.write('</tr></table><br>');
        //console.log(util.inspect(lines));
      });
    }
    else{
      res.write('<table border="1"><tr><th>' + line + '</th><th>unknown</th></tr></table><br>');
    }
  });
});

function openMachineListFile(req, res, fileName)
{
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
          event.emit('readLineFromMachineFile', req, res, line.toString());
        }
    });
  }).on('close', () => {
    ;
  });
};

http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.write('<html><head><meta charset="utf-8"><title>machines</title></head> <body>');

  var fileName = __dirname.toString() + "/machines.txt";
  openMachineListFile(req, res, fileName);

//  console.log(util.inspect(lines));
  console.log("done!");

}).listen(8888);

