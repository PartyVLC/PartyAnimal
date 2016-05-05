var socket = io("/");

socket.on('addSong', function(data) {
  if (window.location.href.includes(data.dj)) {
    addSongHTML(data.id, data.title, data.score);
  }
})

socket.on('selectSong', function(data) {
  if (window.location.href.includes(data.dj)) {
    activeSongHTML(data.id,data.title);
    removeSong(data.id);
    delSongHTML(data.id);
  }
})

socket.on('removeSong', function(data) {
  if (window.location.href.includes(data.dj)) {
    delSongHTML(data.id);
  }
})

socket.on('changePlaylist', function(data) {
  if (window.location.href.includes(data.dj)) {
    changePlaylistHTML(data.playlist);
  }
})

socket.on('upvote', function(data) {
  if (window.location.href.includes(data.dj)) {
    upvoteHTML(data.id);
  }
})

socket.on('downvote', function(data) {
  if (window.location.href.includes(data.dj)) {
    downvoteHTML(data.id);
  }
})

socket.on('addPlaylist', function(data) {
  if (window.location.href.includes(data.dj)) {
    addPlaylistHTML(data.title);
  }
})

socket.on('delPlaylist', function(data) {
  if (window.location.href.includes(data.dj)) {
    deletePlaylistHTML(data.title);
  }
})

socket.on('nosong', function(data) {
  if (window.location.href.includes(data.dj)) {
    nosongHTML();
  }
})