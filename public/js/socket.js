var socket = io("/");

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

socket.on('changePlaylist', function(data) {
  if (window.location.href == data.url) {
    changePlaylistHTML(data.playlist);
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

socket.on('addPlaylist', function(data) {
  if (window.location.href == data.url) {
    addPlaylistHTML(data.title);
  }
})

socket.on('delPlaylist', function(data) {
  if (window.location.href == data.url) {
    deletePlaylistHTML(data.title);
  }
})