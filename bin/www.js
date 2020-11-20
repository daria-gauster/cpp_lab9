var app = require('../app');

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var debug = require('debug')('web_course_auction_2:server');
var logger = require('../logger');


var port = 4445;
server.listen(port, ()=>{
    logger.verbose(`HTTP server started at http://localhost:${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

    var pictureInfo = require('../public/lib/pictures');
    var participantsInfo = require('../public/lib/participants');

var paintings = [];
var participants = [];
var i = 0;
for (key in pictureInfo.arr) {
    //pictureInfo.arr[key].ind = Number(key);
    if (pictureInfo.arr[key].inAuction == true) {
        paintings.push(pictureInfo.arr[key]);
        pictureInfo.arr[key].ind = i;
        i++;
    }
}
for (key in participantsInfo.arr) {
    participantsInfo.arr[key].ind = Number(key);
    participants.push(participantsInfo.arr[key]);
}

io.sockets.on('connection', (socket) => {
    socket.on('hello', (msg) => {
        let time = (new Date()).toLocaleTimeString();
        socket['name'] = msg.name;
        send(socket, `${msg.name} присоединился`, `${time}`)
    });
    socket.on('admin',  (msg) => {
        let time = (new Date()).toLocaleTimeString();
        send(socket, ` админ: ${msg.value}`, `${time}`)
    });
    socket.on('msg', (msg) => {
        let time = (new Date()).toLocaleTimeString();
        send(socket, `${socket['name']}: ${msg.value}`, `${time}`);
    });
    socket.on('disconnect', (msg) => {
        if (socket['name']) {
            let time = (new Date()).toLocaleTimeString();
            send(socket, `${socket['name']} вышел`, `${time}`);
        }
    });
    socket.on('startauction', (msg) => {
        socket.broadcast.emit('startauction', {
            info: msg.msg
        });
    });
    socket.on('auctionstep', (msg) => {
        socket.broadcast.emit('auctionstep', {
            info: msg.msg,
        });
    });
    socket.on('researchstep', (msg) => {
        socket.broadcast.emit('researchstep', {
            info: msg.msg
        });
    });
    socket.on('changepicture', (msg) => {
        socket.broadcast.emit('changepicture', {
            ind: msg.ind,
            name: paintings[msg.ind].name,
            author: paintings[msg.ind].author,
            imgsrc: paintings[msg.ind].link,
            price: paintings[msg.ind].beginning_price,
            disc: paintings[msg.ind].description,
            min: paintings[msg.ind].min_step,
            max: paintings[msg.ind].max_step
        });
    });
    socket.on('refreshtimer', (msg) => {
        socket.broadcast.emit('refreshtimer', {
            time: msg.time
        });
    });
    socket.on('setcurrentbet', (msg) => {
        socket.json.emit('setcurrentbet', {
            money: msg.money
        });
        socket.broadcast.emit('setcurrentbet', {
            money: msg.money
        });
    });
    socket.on('updatepictureinfo', (msg) => {
        socket.broadcast.emit('updatepictureinfo', {
            name: msg.name,
            price: msg.price,
            id: msg.id
        });
    });
    socket.on('updatemoney', (msg) => {
        socket.broadcast.emit('updatemoney', {name: msg.name, money: msg.money});
    });
    socket.on('stopauction', (msg) => {
        socket.broadcast.emit('stopauction', {ind: msg.ind});
    });
});

function send(socket, msg, time) {
    socket.json.emit('msg', {'message': msg, 'time': time});
    socket.broadcast.emit('msg', {'message': msg, 'time': time});
}


function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = server;