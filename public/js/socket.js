var socket = io.connect("/");

socket.on('updateActivePlaylist',function(pid) {

})

socket.on('updateActiveSong',function(sid) {

})

socket.on('updateScore', function(sid) {

})

socket.on('updatePlaylistOrder', function() {

})

socket.on('addSong', function(data) {
  console.log(window.location.href);
  console.log(data.url)
  if (window.location.href == data.url) {
    addSongHTML(data.id, data.title);
  }
})