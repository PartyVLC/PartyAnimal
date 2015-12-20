// Server side socket code

module.exports = function (io) {
  io.on('connection', function(socket) {
    socket.on('playsong',function(sid,pid) {
      io.emit('playsong',{'sid':sid,'pid':pid});
      io.emit('activeplaylist',pid);
    });

    socket.on('loadplaylist',function() {
      io.emit('loadplaylist');
    });

  });
}