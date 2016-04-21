// var socket = io("/");
var socket = io("/");

socket.on('updateActivePlaylist',function(pid) {

})

socket.on('updateActiveSong',function(sid) {

})

socket.on('updateScore', function(sid) {
  
})

socket.on('updatePlaylistOrder', function() {

})

socket.on('addSong', function(data) {
  //custom namespace!!
  console.log(window.location.href)
  if (window.location.href == data.url) {
    addSongHTML(data.id, data.title);
  }
})

socket.on('delSong', function(data) {
  if (window.location.href == data.url) {
    delSongHTML(data.id);
  }
})

