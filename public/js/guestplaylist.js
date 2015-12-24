window.addEventListener('load', function() {
  socket.emit('getActivePlaylist');
  socket.on('getActivePlaylist',function(pid) {
    activePlaylist = pid;
    loadSongs();
  });
});

socket.on('setActivePlaylist',function(pid) {
  activePlaylist = pid;
  loadSongs();
});

function loadSongs() {
  var playlistList = document.getElementById('pll');

  while (playlistList.hasChildNodes()) {
    playlistList.removeChild(playlistList.lastChild);
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var songs = JSON.parse(xhttp.responseText);
      if (songs.length !== 0) {
        var name = songs[0].Name;

        var currPlaylistTitle = document.getElementById('currPlaylist');
        currPlaylistTitle.innerHTML = "Current Playlist: "+name;

        for (i in songs) {

          var song = songs[i];

          var songli = document.createElement('li');
          songli.className = 'playlistSong';
          songli.innerHTML = song.Title;

          var downV = document.createElement('button');
          downV.type='button';
          downV.className='btn btn-default';
          downV.onclick = new Function("","downVote(this,'"+song.SongID+"',"+activePlaylist+")");
          var downSpan = document.createElement('span');
          downSpan.id='downVoteButt';
          downSpan.className='glyphicon glyphicon-thumbs-down';
          downV.appendChild(downSpan);
          
          var score = document.createElement('span');
          score.innerHTML = song.Score;
          
          var upV = document.createElement('button');
          upV.type='button';
          upV.className='btn btn-default';
          upV.onclick = new Function("","upVote(this,'"+song.SongID+"',"+activePlaylist+")");
          var upSpan = document.createElement('span');
          upSpan.id='upVoteButt';
          upSpan.className='glyphicon glyphicon-thumbs-up';
          upV.appendChild(upSpan);
          
          songli.appendChild(downV);
          songli.appendChild(score);
          songli.appendChild(upV);

          playlistList.appendChild(songli);
        }
      }
    }
  };
  console.log(activePlaylist);
  xhttp.open("GET", "/api/getSongsByPlaylist?pid="+activePlaylist, true);
  xhttp.send();
}