var http = require('http');
var fs = require('fs');
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
const readline = require('readline');
var fileSplit = require('./fileSplit');
var test = require('./test');
var event = new EventEmitter();

event.on('readDoneFromMachineFile', function(req, res) { 
  res.write('</table></body></html>');
  res.end();
}); 


event.on('readLineFromMachineFile', function (req, res, line) {
  res.write('<tr><th>' + line + '</th></tr>');
});

function openMachineListFile(req, res, fileName)
{
  res.write('<table border="1">');
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
    event.emit('readDoneFromMachineFile', req, res);
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

