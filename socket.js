// Server side socket code
module.exports = function (io) {
  var activeplaylist = null;

  io.on('connection', function(socket) {
    socket.on('playsong',function(sid,pid) {
      io.emit('playsong',{'sid':sid,'pid':pid});
      io.emit('activeplaylist',pid);
    });

    socket.on('loadplaylist',function() {
      io.emit('loadplaylist');
    });

    socket.on('requestActivePlaylist',function() {
      io.emit('requestActivePlaylist',activeplaylist);
    })

    socket.on('setActivePlaylist',function(pid) {
      io.emit('setActivePlaylist',pid);
      activeplaylist = pid;
    })

  });
}