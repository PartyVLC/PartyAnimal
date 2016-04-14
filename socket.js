// Server side socket code
module.exports = function (io) {
  var activeplaylist;
  var currSong;

  io.on('connection', function(socket) {
    // socket.on('playsong',function(sid,pid) {
    //   io.emit('playsong',{'sid':sid,'pid':pid});
    //   if (activeplaylist != pid) {
    //     io.emit('activeplaylist',pid);
    //   }
    // });

    // socket.on('loadplaylist',function() {
    //   io.emit('loadplaylist');
    // });

    // socket.on('getActivePlaylist',function() {
    //   io.emit('getActivePlaylist',activeplaylist);
    // });

    // socket.on('setActivePlaylist',function(pid) {
    //   io.emit('setActivePlaylist',pid);
    //   activeplaylist = pid;
    // });

    // socket.on('loadSongs',function() {
    //   io.emit('loadSongs');
    // });

    socket.on('addSong', function(song) {
      io.emit('addSong',song)
    })

  });
}