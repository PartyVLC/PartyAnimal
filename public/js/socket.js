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
  if (window.location.href == data.url) {
    addSongHTML(data.id, data.title, data.score);
  }
})

socket.on('delSong', function(data) {
  if (window.location.href == data.url) {
    delSongHTML(data.id);
  }
})

socket.on('upvote', function(data) {
  if (window.location.href == data.url) {
    upvoteHTML(data.id);
  }
})

socket.on('downvote', function(data) {
  if (window.location.href == data.url) {
    downvoteHTML(data.id);
  }
})

socket.on('selectSong', function(data) {
  if (window.location.href == data.url) {
    activeSongHTML(data.id);
  }
})

socket.on('removeSong', function(data) {
  if (window.location.href == data.url) {
    delSongHTML(data.id);
  }
})