// Server side socket code

module.exports = function (io) {
  io.on('connection', function(socket) {
    socket.on('addSong', function(msg){
      console.log(msg);
    });
    socket.on('playsong',function(id) {
      io.emit('playsong',id);
    })
  });
}