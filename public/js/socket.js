var socket = io.connect("/");

socket.on('updateActivePlaylist',function(pid) {

})

socket.on('updateActiveSong',function(sid) {

})

socket.on('updateScore', function(sid) {

})

socket.on('updatePlaylistOrder', function() {

})

socket.on('addSong', function(song) {
  
  addSongHTML(song.id, song.title);
})