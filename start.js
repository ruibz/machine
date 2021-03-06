var Client = require('ssh2').Client;
var url = require('url');
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

app.get('/', function (req, res) {
  console.log("get /");
  var params = url.parse(req.url, true).query;
 
  if(params.ip && params.action) {
    var allInfo = "";
    console.log("ip:" + params.ip);
    console.log("action:" + params.action);
    cmd = 'sh /home/ruibz/machine.sh'
    stateFile = __dirname + "/files/" + params.ip + ".txt";
    if(params.action == "reboot" || params.action == "clean") {
      cmd += " " + params.action;
      fs.unlink(stateFile, function(err) {
        console.log("rm file " + stateFile);
      });
    }
    else {
      cmd += " update"
    }
    var conn = new Client();
    conn.on('ready', function() {
    conn.exec(cmd, function(err, stream) {
      stream.on('close', function(code, signal) {
      if(params.action == "reboot" || params.action == "clean") {
      }
      else {
        fs.writeFile(stateFile, allInfo,  function(err) {
        if (err) { return console.error(err); }
        });
      }
      conn.end();
      }).on('data', function(data) {
        console.log('STDOUT: ' + data);
        allInfo += data;
      }).stderr.on('data', function(data) {
        console.log('STDERR: ' + data);
      });
    });
    }).connect({
      host: params.ip,
      port: 22,
      username: 'ruibz',
      privateKey: require('fs').readFileSync('/home/ruibz/.ssh/id_rsa')
    });
  }

  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.write('<html><head><meta charset="utf-8"><title>machines</title></head> <body>');

  var fileName = __dirname.toString() + "/machines.txt";
  openMachineListFile(req, res, fileName);

//  console.log(util.inspect(lines));
})

event.on('readLineFromMachineFile', function (req, res, line) {
  var lines = [];
  var fileName = __dirname + "/files/" + line + ".txt";
  //var formData = '<form action="/" method="get"><input name="ip" value="' + line + '"/> <input type="submit" name="" value="update" /> </form>';
  //var updateLink = '<a href="http://127.0.0.1:8888/?ip=' + line + '&action=update' + '#' + line + '">update</a>';
  var updateLink = '<a href="http://127.0.0.1:8888/?ip=' + line + '&action=update">update</a>';
  var rebootLink = '<a href="http://127.0.0.1:8888/?ip=' + line + '&action=reboot">reboot</a>';
  var cleanLink = '<a href="http://127.0.0.1:8888/?ip=' + line + '&action=clean">clean</a>';
  fs.exists(fileName, function(exists){
    if(exists){
      const rl = readline.createInterface({
        input: fs.createReadStream(fileName),
        terminal: true
      });
      rl.on('line', (line) => {
          lines.push(line.toString());
      }).on('close', () => {
        res.write('<table border="1" height="20px"><tr><td id="' + line + '">' + line + '</td>');
        lines.forEach(function(item,index){  
          var indexOfSep = item.indexOf(":");
          var id = item.slice(0, indexOfSep);
          var value = item.slice(indexOfSep+1);
          var colorRedFlag = false;
          if(id == "host") {
            ;
          }
          else if(id == "cpt_" && value) {
            if(Number(value) > 0) {
              colorRedFlag = true;
            }
          }
          else if(id == "/local" && value) {
            var indexOfPercent = value.indexOf("%");
            var exactValue = value.slice(0, indexOfPercent);
            if(Number(exactValue) > 80) {
              colorRedFlag = true;
            }
          }
          else if(id == "user" && value) {
            colorRedFlag = true;
          }
          else{
          }

          if(colorRedFlag) {
            res.write('<td><font size="3" color="red">' + item + '</font></td>');
          }
          else {
            res.write('<td><font size="3">' + item + '</font></td>');
          }


        });
        res.write('<td height="10px">' + updateLink + '</td>');
        res.write('<td height="10px">' + rebootLink + '</td>');
        res.write('<td height="10px">' + cleanLink + '</td>');
        res.write('</tr></table>');
        //console.log(util.inspect(lines));
      });
    }
    else{
      res.write('<table border="1"><tr><td>' + line + '</td><td>lost</td><td>' + updateLink + '</td></tr></table>');
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

