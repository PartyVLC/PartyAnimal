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

    socket.on('upvote', function(data) {
      io.emit('upvote', data)
    })

    socket.on('downvote', function(data) {
      io.emit('downvote', data)
    })

    socket.on('selectSong', function(data) {
      io.emit('selectSong', data)
    })

    socket.on('removeSong', function(data) {
      io.emit('removeSong', data)
    })
    
  });
}