var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.enable('trust proxy');

app.post('/', function(req, res) {
    console.log(req.ip);
    if(req.ip == '::ffff:165.227.32.248') {
        console.log('Post accepted')
        if(req.method == 'POST') {
    			var content = req.body;
          //console.log(content);
    			handleServerNotice(content);
        }
    } else {
      console.log('Post failed')
    }
    res.end('ok');
});

io.on('connection', function(socket){
	socket.on('join', function (data) {
		socket.join(data.service); // We are using room of socket io
		console.log('A user has connected');
		console.log(data.service);
	});
	socket.on('disconnect', function(){
		console.log('A user has disconnected');
	});
});

function handleServerNotice(data) {
    var service = data.service;
    io.sockets.in(service).emit('msg', data);
}

http.listen(5000, function(){
	console.log('Listening on *:5000');
});
