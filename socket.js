// Server side socket code

module.exports = function (io) {
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

    socket.on('changePlaylist', function(data) {
      io.emit('changePlaylist', data)
    })

    socket.on('addPlaylist', function(data) {
      io.emit('addPlaylist', data)
    })

    socket.on('delPlaylist', function(data) {
      io.emit('delPlaylist', data)
    })

  });
}