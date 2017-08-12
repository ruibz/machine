var http = require('http');
var fs = require('fs');
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
const readline = require('readline');
var test = require('./test');
var event = new EventEmitter();
var express = require('express');
var app = express();
var querystring = require('querystring');

app.post('/', function (req, res) {
  console.log("post /");
})

app.get('/', function (req, res) {
  console.log("get /");
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    body = querystring.parse(body);
    console.log(util.inspect(body));
 
    if(body.ip) {
      console.log("ip:" + body.ip);
    }
    else {
        ;
    }
  });

  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.write('<html><head><meta charset="utf-8"><title>machines</title></head> <body>');

  var fileName = __dirname.toString() + "/machines.txt";
  openMachineListFile(req, res, fileName);

//  console.log(util.inspect(lines));
})

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
          var indexOfSep = item.indexOf(":");
          var id = item.slice(0, indexOfSep);
          var value = item.slice(indexOfSep+1);
          if(id == "cpu") {
            res.write('<th>' + id + '</th>');
          }
          else{
            res.write('<th>' + value + '</th>');
          }
        });
        res.write('</tr></table><br>');
        //console.log(util.inspect(lines));
      });
    }
    else{
      var formData = '<form action="/" method="get"><input name="ip" value="' + line + '"/> <input type="submit" name="" value="update" /> </form>';
      res.write('<table border="1"><tr><th>' + line + '</th><th>lost</th><th>' + formData + '</th></tr></table><br>');
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

//http.createServer(function(req, res){
//}).listen(8888);

var server = app.listen(8888, function () {
})

