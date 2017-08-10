var http = require('http');
var fs = require('fs');
var path = require('path');
const readline = require('readline');

http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.write('<html><head><meta charset="utf-8"><title>machines</title></head> <body>');

  const rl = readline.createInterface({
    input: fs.createReadStream('machines.txt'),
    terminal: true
  });

  res.write('<table border="1">');
  rl.on('line', (line) => {
    var fileName = __dirname.toString() + "/files/" + line + ".txt";
    fs.exists(fileName, function(exists){
        if(!exists){
            //res.write(fileName + ' not exists.');
        }else{
          var data=fs.readFileSync(fileName,"utf-8");
          //res.write(data.toString());
          res.write('<tr><td>' + data.toString() + '</td></tr>');
        }
    });

  }).on('close', () => {
    res.write('</table>');
    res.write('</body></html>');
    res.end();
  });
}).listen(8888);

