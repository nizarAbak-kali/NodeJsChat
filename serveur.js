/**
 * Created by nizar on 10/04/2016.
 */

var http = require('http');
var md5 = require('md5');

httpServer = http.createServer(function(req, res) {
    res.end('hello world');
    console.log("Un utilisateur c'est co")

});

httpServer.listen(1338);

var io = require('socket.io').listen(httpServer);

var users = {};
var messages = [];

io.sockets.on('connection', function(socket) {

    var me = false;
    console.log("new user");

    for (var k in users) {
        socket.emit("newuser", users[k]);

    }

    for (var k in messages) {
        socket.emit("newmsg", messages[k]);
        
    }


    socket.on('newmsg',function (message) {
    	 message.user = me;
    	 date = new Date();
    	 message.h = date.getHours();
    	 message.m = date.getMinutes();
    	 messages.push(message);
    	 if (messages.length > 4){
    	 	messages.shift();
    	 }

    	 io.sockets.emit('newmsg',message);
    })

    socket.on('login', function(user) {
        me = user;
        me.id = user.mail.replace('@', '-').replace('.', '-');
        me.avatar = 'https//gravatar.com/avatar' + md5(user.mail);
        socket.emit('logged');
        users[me.id] = me;
        io.sockets.emit('newuser', me);
        console.log('login from');
        console.log(user);

    });
    socket.on('disconnect', function() {
        if (!me) {
            return false;
        }
        delete users[me.id];
        io.sockets.emit('disuser',me)
    })

    socket.on('error', function(er) {
       
        console.log(er);
        
    });
});