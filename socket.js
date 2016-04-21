// Server side socket code

module.exports = function (io) {
  var activeplaylist;
  var currSong;

  io.on('connection', function(socket) {

    socket.on('addSong', function(data) {
      io.emit('addSong',data)
    })

    socket.on('delSong', function(data) {
      io.emit('delSong',data)
    })
    
  });
}