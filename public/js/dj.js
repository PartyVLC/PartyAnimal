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

function selectSongSocket(id,title) {
  socket.emit('selectSong',{id: id, title: title, dj: dj});
}

function activeSongHTML(id,title) {
  player.loadVideoById(id);
  var songtitle = document.getElementById('songtitle');
  songtitle.innerHTML = title;


  // var activeSongs = document.getElementsByClassName("psactive");

  // for (i in activeSongs) {
  //   activeSongs[i].className = "playlistsong";
  // }
  // var playlistsong = document.getElementById(id);
  // playlistsong.className = "playlistsong psactive";
}

function search() {
  var keyword = document.getElementById("searchinput").value;
  clearSearch();

  $.get('/dj/user_data', function(data) {
    $.get('https://www.googleapis.com/youtube/v3/search',{
      q:keyword,
      part:'snippet',
      key:'AIzaSyBS_lekQxyiMLv9VKc4iqzMxufvPln4y9w',
      maxResults:15,
      type:'video'
      },
      function(response){
        for (i in response.items) {
          (function(index) {
            var song = {
              id : response.items[index].id.videoId,
              title : response.items[index].snippet.title,
              thumbnail : response.items[index].snippet.thumbnails.default.url,
              desc : response.items[index].snippet.description
            }

            showSearchResultsHTML(song,data.currentPlaylist.songs);
          })(i);
        }
      }
    );
  });
}

function suggested() {
  clearSuggested();
  $.get('/dj/user_data', function(data) {
    for (i in data.currentPlaylist.songs) {
      $.get('https://www.googleapis.com/youtube/v3/search',{
        part: 'snippet',
        relatedToVideoId: data.currentPlaylist.songs[i].id,
        type: 'video',
        maxResults: 1,
        key:'AIzaSyBS_lekQxyiMLv9VKc4iqzMxufvPln4y9w'
      },
      function(response) {
        var song = {
              id : response.items[0].id.videoId,
              title : response.items[0].snippet.title,
              thumbnail : response.items[0].snippet.thumbnails.default.url,
              desc : response.items[0].snippet.description
        }
        showSuggestedResultsHTML(song,data.currentPlaylist.songs);
      });
    }
    if (data.currentPlaylist.songs.length < 10) {
      $.get('https://www.googleapis.com/youtube/v3/videos', {
        chart:'mostPopular',
        key:'AIzaSyBS_lekQxyiMLv9VKc4iqzMxufvPln4y9w',
        part:'snippet',
        type: 'video',
        maxResults: 10 - data.currentPlaylist.songs.length
      },
      function(response) {
        for (i in response.items) {
          (function(index) {
            var song = {
                  id : response.items[index].id,
                  title : response.items[index].snippet.title,
                  thumbnail : response.items[index].snippet.thumbnails.default.url,
                  desc : response.items[index].snippet.description
            }
            showSuggestedResultsHTML(song,data.currentPlaylist.songs);
          })(i);
        }
      });
    }
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

function showSearchResultsHTML(song,playlist) {
  var searchresults = document.getElementById('searchresults');
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

  var thumb = document.createElement('img');
  thumb.src = song.thumbnail;
  thumb.className = 'thumb';

  var rescontent = document.createElement('div');
  rescontent.className = "rescontent";
  
  var titdesc = document.createElement("div");
  titdesc.className = "titdesc";

  var title = document.createElement("div");
  title.innerHTML = song.title;
  title.className = 'restitle';

  var hr = document.createElement('hr');
  hr.style.margin = 0;

  var desc = document.createElement("div");
  desc.innerHTML = song.desc;
  desc.className = "resdesc";

  playlistsong.appendChild(songadd);
  rescontent.appendChild(thumb);
  titdesc.appendChild(title);
  titdesc.appendChild(hr);
  titdesc.appendChild(desc);
  rescontent.appendChild(titdesc)
  playlistsong.appendChild(rescontent);

  searchresults.appendChild(playlistsong);
}

function clearSuggested() {
  var suggestedresults = document.getElementById("suggestedresults");
  if (suggestedresults.childNodes) {
    var length = suggestedresults.childNodes.length;
    for (i=0; i < length; i++) {
      suggestedresults.removeChild(suggestedresults.childNodes[0]);
    }
  }
}

function showSuggestedResultsHTML(song,playlist) {
  var suggestedresults = document.getElementById('suggestedresults');

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

  var thumb = document.createElement('img');
  thumb.src = song.thumbnail;
  thumb.className = 'thumb';

  var rescontent = document.createElement('div');
  rescontent.className = "rescontent";

  var titdesc = document.createElement("div");
  titdesc.className = "titdesc";

  var title = document.createElement("div");
  title.innerHTML = song.title;
  title.className = 'restitle';

  var desc = document.createElement("div");
  desc.innerHTML = song.desc;
  desc.className = 'resdesc';

  playlistsong.appendChild(songadd);
  rescontent.appendChild(thumb);
  titdesc.appendChild(title);
  titdesc.appendChild(desc);
  rescontent.appendChild(titdesc)
  playlistsong.appendChild(rescontent);

  suggestedresults.appendChild(playlistsong);
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

    if (user.currentPlaylist) {
      var songs = user.currentPlaylist.songs
      for (i in songs) {
        addSongHTML(songs[i].id, songs[i].title, songs[i].score);
      }
    }

    var currentPlaylistTitle = document.getElementById('currentPlaylistTitle');
    currentPlaylistTitle.innerHTML = playlist;
    var pagetitle = document.getElementById('pagetitle');
    pagetitle.innerHTML = user.username + ' - ' + playlist;
    var currentPlaylistMenu = document.getElementById('currentPlaylistMenu');
    currentPlaylistMenu.innerHTML = "CurrentPlaylist - " + playlist;

    if (songs.length == 0) {
      var plcontainer = document.getElementById('sidebarplaylistcontainer');

      var nosongs = document.createElement('div');
      nosongs.className = 'nosongs';
      var p1 = document.createElement('p');
      p1.innerHTML = 'This playlist has no songs :(';
      var p2 = document.createElement('p');
      p2.innerHTML = 'Why not add some?'

      nosongs.appendChild(p1);
      nosongs.appendChild(p2);

      plcontainer.appendChild(nosongs);
    }

    currentPlaylistMenu.disabled = false;
    var searchbutt = document.getElementById('searchbutt');
    searchbutt.disabled = false;
    var suggestedbutt = document.getElementById('suggestedbutt');
    suggestedbutt.disabled = false;
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
    var songs = data.currentPlaylist.songs;
  })
  socket.emit('addSong',{id: id, title: title, score: 0, dj : dj });
  window.setTimeout(playIfOneSong, 1000); //async call 1 second later so it has time to add the song
}

function playIfOneSong()
{
  $.get("/dj/user_data", function(data) {
    var songs = data.currentPlaylist.songs;
    if(songs.length == 1 && player.getPlayerState() % 5 == 0) { //0 ended 5 video cued (nothing)
      socket.emit('selectSong',{id : songs[0].id, title: songs[0].title, dj : dj}); //lol I hope this works
    }
  })
}

function clearSongs() {
  var sidebarplaylistcontainer = document.getElementById("sidebarplaylistcontainer");
  while (sidebarplaylistcontainer.firstChild) {
    sidebarplaylistcontainer.removeChild(sidebarplaylistcontainer.firstChild);
  }
  var donezos = document.getElementById('donezos');
  while (donezos.firstChild) {
    donezos.removeChild(donezos.firstChild);
  }
}

function addSongHTML(id, title, score) {
  var nosongs = document.getElementsByClassName('nosongs');
  if (nosongs.length > 0) {
    nosongs[0].parentNode.removeChild(nosongs[0]);
  }

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

  var div = document.createElement("div");
  div.onclick = function() {selectSongSocket(id,title);}
  div.innerHTML = title;
  div.className = 'ptitle';

  var songx = document.createElement("button");
  songx.className = "songx";
  songx.onclick = function() {delSong(id);}
  songx.innerHTML = "x"

  playlistsong.appendChild(votebox);
  votebox.appendChild(voteboxvoteup);
  votebox.appendChild(voteboxvotedown);

  playlistsong.appendChild(voteboxnumber);
  playlistsong.appendChild(div);
  playlistsong.appendChild(songx);

  sidebarplaylistcontainer.appendChild(playlistsong);
}

function delSong(id) {
  $.post("/songs/delete", {id : id});
  socket.emit('removeSong',{id: id, dj : dj});
}

function removeSong(id) {
  $.post('/songs/remove',{id: id});
  // socket.emit('delSong', {id : id, dj : dj});
}

function delSongHTML(id) {
  var playlistsong = document.getElementById(id);
  var donezos = document.getElementById('donezos');
  playlistsong.className = 'playlistsong donezo';
  playlistsong.id = '';
  playlistsong.parentNode.removeChild(playlistsong);
  donezos.appendChild(playlistsong);
  playlistsong.firstChild.children[0].disabled = true;
  playlistsong.firstChild.children[1].disabled = true;
  playlistsong.removeChild(playlistsong.children[3]);

  playlistsong.children[1].innerHTML = '';
  playlistsong.children[2].style.textDecoration = 'line-through';
}

function disableVoting(id,idx) {
  var votebox = document.getElementById(id).firstChild;
  votebox.firstChild.disabled = true;
  votebox.children[1].disabled = true;
  votebox.children[idx].firstChild.style.color = 'orange';
}

function upvote(id) {
  $.post("/songs/upvote", {id : id});
  socket.emit('upvote', {id : id, dj : dj});
  disableVoting(id,0);
}

function upvoteHTML(id) {
  var scorebox = document.getElementById("score-"+id);
  var score = parseInt(scorebox.innerHTML);
  scorebox.innerHTML = score + 1;
}

function downvote(id) {
  $.post("/songs/downvote", {id : id});
  socket.emit('downvote', {id : id, dj : dj});
  disableVoting(id,1);
}

function downvoteHTML(id) {
  var scorebox = document.getElementById("score-"+id);
  var score = parseInt(scorebox.innerHTML);
  scorebox.innerHTML = score - 1;
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
  playlistsong.id = 'playlist-'+title;

  var playlistadd = document.createElement('button');
  playlistadd.className = 'songadd';
  playlistadd.onclick = function(){ changePlaylist(title); }

  var icon = document.createElement('i');
  icon.className = 'fa fa-caret-right';
  playlistadd.appendChild(icon);

  var p = document.createElement('span');
  p.className = 'playlisttitle';
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
  clearSongs();
  nosongHTML();
  var pagetitle = document.getElementById('pagetitle');
  pagetitle.innerHTML = dj + "- No playlist selected";
  var currentPlaylistTitle = document.getElementById('currentPlaylistTitle');
  currentPlaylistTitle.innerHTML = 'No playlist selected';
  var currentPlaylistMenu = document.getElementById('currentPlaylistMenu');
  currentPlaylistMenu.innerHTML = "CurrentPlaylist - No playlist selected";

  currentPlaylistMenu.disabled = true;
  var searchbutt = document.getElementById('searchbutt');
  searchbutt.disabled = true;
  var suggestedbutt = document.getElementById('suggestedbutt');
  suggestedbutt.disabled = true;
}

function nosongHTML() {
  var songtitle = document.getElementById('songtitle');
  songtitle.innerHTML = 'No song playing'
}
