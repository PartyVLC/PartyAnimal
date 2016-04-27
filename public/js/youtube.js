var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    playerVars: {'controls':1, 'disablekb':1, 'modestbranding':1,'rel':0,'showinfo':0},
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
    fs:0,
    iv_load_policy:3,
    disablekb:1,
  });
}

function onPlayerReady(event) {
  $.get("/dj/user_data", function(user) {
    setInterval(refreshProgress,100);
    var songs = user.currentPlaylist.songs;
    if (songs[0]) {
      selectSongSocket(songs[0].id)
    }
    else {
      console.log("No queued song to play")
    }
  });
}

function onPlayerStateChange(event) {
  var progressbarplaypause = document.getElementById("progressbarplaypause");
  if (event.data == YT.PlayerState.ENDED) {
    $.get("/dj/user_data", function(user) {
      var songs = user.currentPlaylist.songs;
      var playedSong = songs[0].id;
      $.post('/songs/remove',{id: playedSong});
      socket.emit('removeSong',{id : playedSong, url : window.location.href});

      var nextSong = songs[1].id;
      if (nextSong) {
        selectSongSocket(nextSong);
      }
    })
  }
  else if (event.data == YT.PlayerState.PLAYING) {
    progressbarplaypause.removeChild(progressbarplaypause.childNodes[0]);
    var icon = document.createElement("i");
    icon.className = 'fa fa-pause';
    progressbarplaypause.appendChild(icon);
  }
  else if (event.data == YT.PlayerState.PAUSED) {
    progressbarplaypause.removeChild(progressbarplaypause.childNodes[0]);
    var icon = document.createElement("i");
    icon.className = 'fa fa-play';
    progressbarplaypause.appendChild(icon);
  }
}

function selectSongSocket(id) {
  socket.emit('selectSong',{id: id, url: window.location.href});
}

function activeSongHTML(id) {
  player.loadVideoById(id);
  var activeSongs = document.getElementsByClassName("playlistsongactive");

  for (i in activeSongs) {
    activeSongs[i].className = "playlistsong";
  }

  var playlistsong = document.getElementById(id);
  playlistsong.className = "playlistsong playlistsongactive";
}

function playPause() {
  var state = player.getPlayerState();
  if (state == 1) {
    player.pauseVideo();

  }
  else if (state == 2) {
    player.playVideo();
  }
}

function searchKeyPress() {
  if (event.keyCode == 13) {
    search();
  }
}

function search() {
  var keyword = document.getElementById("searchinput").value;
  clearSearch();
  $.get('https://www.googleapis.com/youtube/v3/search',{
    q:keyword,
    part:'snippet',
    key:'AIzaSyBS_lekQxyiMLv9VKc4iqzMxufvPln4y9w',
    maxResults:5,
    type:'video'
    },
    function(response){
      var searchresults = document.getElementById("searchresults");
      for (i in response.items) {
        (function(index) {
            var song = {
              id:response.items[index].id.videoId,
              title:response.items[index].snippet.title,
            }
          showSearchResultsHTML(index,song);
        })(i);
      }
    }
  );
}

function clearSearch() {
  var searchresults = document.getElementById("searchresults");
  var length = searchresults.childNodes.length;
  for (i=0; i < length; i++) {
    searchresults.removeChild(searchresults.childNodes[0]);
  }
  var searchinput = document.getElementById("searchinput");
  searchinput.value = "";
}

function showSearchResultsHTML(index,song) {
  var playlistsong = document.createElement("div");
  playlistsong.className = 'playlistsong';

  var songadd = document.createElement("button");
  songadd.className = "songadd";
  var icon = document.createElement("i");

  $.get('/dj/user_data', function(user) {
    var isInPlaylist = false;
    var songs = user.currentPlaylist.songs;
    for (i in songs) {
      if (songs[i].id == song.id) {
        isInPlaylist = true;
        break;
      }
    }
    if (isInPlaylist) {
      icon.className = "fa fa-check";
      songadd.disabled = true;
    }
    else {
      icon.className = "fa fa-plus";
    }
  });

  songadd.appendChild(icon);
  songadd.onclick = function() {addSong(song.id,song.title,this)};

  var p = document.createElement("p");
  p.innerHTML = song.title;

  playlistsong.appendChild(songadd);
  playlistsong.appendChild(p);
  searchresults.appendChild(playlistsong);
}

function changePlaylist(playlist) {
  $.post("/dj/set/current", {playlist : playlist}, function(err, res) {
    socket.emit("changePlaylist", {playlist : playlist, url : window.location.href });
  });
}

function changePlaylistHTML(playlist) {
  $.get("/dj/user_data", function(user) {
    clearSongs();

    var songs = user.currentPlaylist.songs
    for (i in songs) {
      addSongHTML(songs[i].id, songs[i].title, songs[i].score);
    }

    var currentPlaylistTitle = document.getElementById('currentPlaylistTitle');
    currentPlaylistTitle.innerHTML = playlist;
    var pagetitle = document.getElementById('pagetitle');
    pagetitle.innerHTML = user.username + ' - ' + playlist;
    var currentPlaylistMenu = document.getElementById('currentPlaylistMenu');
    currentPlaylistMenu.innerHTML = "CurrentPlaylist - " + playlist;
  }) 
}

function addSong(id, title, element) {
  element.disabled = true;
  element.removeChild(element.firstChild);
  var icon = document.createElement('i');
  icon.className = 'fa fa-check';
  element.appendChild(icon);

  $.post("/songs/add", {id: id, title: title});
  socket.emit('addSong',{id: id, title: title, score: 0, url: window.location.href});
}

function clearSongs() {
  var sidebarplaylistcontainer = document.getElementById("sidebarplaylistcontainer");
  while (sidebarplaylistcontainer.firstChild) {
    sidebarplaylistcontainer.removeChild(sidebarplaylistcontainer.firstChild);
  }
}

function addSongHTML(id, title, score) {
  var sidebarplaylistcontainer = document.getElementById("sidebarplaylistcontainer");

  var playlistsong = document.createElement('div');
  playlistsong.id = id;
  playlistsong.className = "playlistsong";

  var votebox = document.createElement('div');
  votebox.className = "votebox";

  var voteboxvoteup = document.createElement("button");
  voteboxvoteup.className = "voteboxvote";
  voteboxvoteup.onclick = function() { upvote(id); }

  var voteboxvoteupicon = document.createElement("i");
  voteboxvoteupicon.className = "fa fa-chevron-up";
  voteboxvoteup.appendChild(voteboxvoteupicon);

  var voteboxvotedown = document.createElement("button");
  voteboxvotedown.className = "voteboxvote";
  voteboxvotedown.onclick = function() { downvote(id); }

  var voteboxvotedownicon = document.createElement("i");
  voteboxvotedownicon.className = "fa fa-chevron-down";
  voteboxvotedown.appendChild(voteboxvotedownicon);

  var voteboxnumber = document.createElement("div");
  voteboxnumber.className = "voteboxnumber";
  voteboxnumber.innerHTML = score;
  voteboxnumber.id = "score-"+id

  var a = document.createElement("a");
  a.href="#";
  a.onclick = function() {selectSongSocket(id);}
  a.innerHTML = title;

  var songx = document.createElement("button");
  songx.className = "songx";
  songx.onclick = function() {delSong(id);}
  songx.innerHTML = "x"

  playlistsong.appendChild(votebox);
  votebox.appendChild(voteboxvoteup);
  votebox.appendChild(voteboxvotedown);

  playlistsong.appendChild(voteboxnumber);
  playlistsong.appendChild(a);
  playlistsong.appendChild(songx);

  sidebarplaylistcontainer.appendChild(playlistsong);
}

function delSong(id) {
  $.post("/songs/delete", {id : id});
  socket.emit('delSong',{id: id, url: window.location.href});
}

function removeSong(id) {
  $.post('/songs/remove',{id: id});
  socket.emit('delSong', {id : id, url : window.location.href});
}

function delSongHTML(id) {
  var playlistsong = document.getElementById(id);
  playlistsong.parentNode.removeChild(playlistsong);
}

function disableVoting(id) {
  var votebox = document.getElementById(id).firstChild;
  votebox.firstChild.disabled = true;
  votebox.children[1].disabled = true;
} 

function upvote(id) {
  $.post("/songs/upvote", {id : id});
  socket.emit('upvote', {id : id, url : window.location.href});
}

function upvoteHTML(id) {
  var scorebox = document.getElementById("score-"+id);
  var score = parseInt(scorebox.innerHTML);
  scorebox.innerHTML = score + 1;
  disableVoting(id);
}

function downvote(id) {
  $.post("/songs/downvote", {id : id});
  socket.emit('downvote', {id : id, url : window.location.href});
}

function downvoteHTML(id) {
  var scorebox = document.getElementById("score-"+id);
  var score = parseInt(scorebox.innerHTML);
  scorebox.innerHTML = score - 1;
  disableVoting(id);
}

function reorderSongsHTML() {
  $.get('/dj/user_data', function(user) {
    clearSongs();

    var songs = user.currentPlaylist.songs;
    for (i in songs) {
      addSongHTML(songs[i].id, songs[i].title, songs[i].score);
    }
  })
}

function addPlaylistKeypress() {
  if (event.keyCode == 13) {
    addPlaylist();
  }
}

function addPlaylist() {
  var newplaylistinput = document.getElementById('newplaylistinput');
  $.post('/dj/set/new', {title : newplaylistinput.value});
  socket.emit('addPlaylist', {title : newplaylistinput.value, url : window.location.href});
  newplaylistinput.value = '';
}

function addPlaylistHTML(title) {
  var playlistmanager = document.getElementById('playlistmanager');

  var playlistsong = document.createElement('div');
  playlistsong.className = "playlistsong";

  var playlistadd = document.createElement('button');
  playlistadd.className = 'songadd';
  playlistadd.onclick = function(){ changePlaylist(title); }

  var icon = document.createElement('i');
  icon.className = 'fa fa-caret-right';
  playlistadd.appendChild(icon);

  var p = document.createElement('p');
  p.innerHTML = title;

  var playlistx = document.createElement('button');
  playlistx.className = 'songx';
  playlistx.innerHTML = 'x';
  playlistx.onclick = function() { deletePlaylist(title); }

  playlistsong.appendChild(playlistadd);
  playlistsong.appendChild(p);
  playlistsong.appendChild(playlistx);

  playlistmanager.appendChild(playlistsong);
}

function deletePlaylist(title) {
  $.post('/dj/set/delete', {playlist : title});
  socket.emit('delPlaylist', {title : title, url : window.location.href});
}

function deletePlaylistHTML(title) {
  var playlistsong = document.getElementById('playlist-'+title);
  playlistsong.parentNode.removeChild(playlistsong);
}

function refreshProgress() {
  var progressbartime = document.getElementsByClassName('progressbartime')[0];
  var currTime = player.getCurrentTime();

  var minCurr = Math.floor(currTime / 60);
  var secCurr = Math.floor(currTime) % 60;

  var width = currTime / player.getDuration() * 100;
  setProgressPercent(width);
  progressbartime.innerHTML = minCurr.toString() + ':'+ ("0"+secCurr).slice(-2);
}

function setProgressPercent(percent)
{
    progressbar = document.getElementsByClassName("progressbar")[0];
    progressbar.style.width = percent + "%";
}