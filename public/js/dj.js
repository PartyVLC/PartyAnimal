var dj = getDJ();

function getDJ() {
  var url = window.location.href;
  var dj = "";
  for (var i = url.length - 1; i >= 0; i--) {
    if (url[i] === '/') {
      break;
    }
    else {
      dj = url[i] + dj;
    }
  }
  return dj;
}

function selectSongSocket(id) {
  socket.emit('selectSong',{id: id, dj: dj});
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

function search() {
  var keyword = document.getElementById("searchinput").value;
  clearSearch();
  var dj = getDJ();

  $.get('/dj/user_data', function(data) {
    $.get('https://www.googleapis.com/youtube/v3/search',{
      q:keyword,
      part:'snippet',
      key:'AIzaSyBS_lekQxyiMLv9VKc4iqzMxufvPln4y9w',
      maxResults:15,
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

            showSearchResultsHTML(index,song,data.currentPlaylist.songs);
          })(i);
        }
      }
    );
  });
}

function clearSearch() {
  var searchresults = document.getElementById("searchresults");
  if (searchresults.childNodes) {
    var length = searchresults.childNodes.length;
    for (i=0; i < length; i++) {
      searchresults.removeChild(searchresults.childNodes[0]);
    }
    var searchinput = document.getElementById("searchinput");
    searchinput.value = "";
  }
}

function showSearchResultsHTML(index,song,playlist) {
  var playlistsong = document.createElement("div");
  playlistsong.className = 'playlistsong';

  var songadd = document.createElement("button");
  songadd.className = "songadd";
  var icon = document.createElement("i");
  
  var isInPlaylist = false;

  for (i in playlist) {
    if (playlist[i].id == song.id) {
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

  songadd.appendChild(icon);
  songadd.onclick = function() {addSong(song.id,song.title,this)};

  var p = document.createElement("p");
  p.innerHTML = song.title;

  playlistsong.appendChild(songadd);
  playlistsong.appendChild(p);
  searchresults.appendChild(playlistsong);
}


function searchKeyPress() {
  if (event.keyCode == 13) {
    search();
  }
}


function changePlaylist(playlist) {
  $.post("/dj/set/current", {playlist : playlist}, function(err, res) {
    socket.emit("changePlaylist", {playlist : playlist, dj : dj });
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
  $.get("/dj/user_data", function(data) {
    $.post("/songs/add/"+dj+"/"+data.currentPlaylist.title, {id: id, title: title});
  })
  socket.emit('addSong',{id: id, title: title, score: 0, dj : dj });
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
  socket.emit('delSong',{id: id, dj : dj});
}

function removeSong(id) {
  $.post('/songs/remove',{id: id});
  socket.emit('delSong', {id : id, dj : dj});
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
  socket.emit('upvote', {id : id, dj : dj});
  disableVoting(id);
}

function upvoteHTML(id) {
  var scorebox = document.getElementById("score-"+id);
  var score = parseInt(scorebox.innerHTML);
  scorebox.innerHTML = score + 1;
}

function downvote(id) {
  $.post("/songs/downvote", {id : id});
  socket.emit('downvote', {id : id, dj : dj});
  disableVoting(id);
}

function downvoteHTML(id) {
  var scorebox = document.getElementById("score-"+id);
  var score = parseInt(scorebox.innerHTML);
  scorebox.innerHTML = score - 1;
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
  socket.emit('addPlaylist', {title : newplaylistinput.value, dj : dj});
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
  socket.emit('delPlaylist', {title : title, dj : dj});
}

function deletePlaylistHTML(title) {
  var playlistsong = document.getElementById('playlist-'+title);
  playlistsong.parentNode.removeChild(playlistsong);
}
