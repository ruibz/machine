var http = require('http');

http.createServer(function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end('Hello World\n');
}).listen(8888);

var Client = require('ssh2').Client;

var conn = new Client();
conn.on('ready', function() {
    conn.exec('touch /home/ruibz/node.touch', function(err, stream) {
        if (err) throw err;

        stream.on('close', function(code, signal) {
            conn.end();
        }).on('data', function(data) {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', function(data) {
            console.log('STDERR: ' + data);
        });
    });
}).connect({
    host: '172.24.220.86',
    port: 22,
    username: 'ruibz',
    password: 'asb~1234'
    //privateKey: require('fs').readFileSync('/home/admin/.ssh/id_dsa')
});


console.log('Server running at http://127.0.0.1:8888/');
