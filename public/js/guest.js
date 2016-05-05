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

function activeSongHTML(id) {
  var activeSongs = document.getElementsByClassName("psactive");

  for (i in activeSongs) {
    activeSongs[i].className = "playlistsong";
  }

  var playlistsong = document.getElementById(id);
  playlistsong.className = "playlistsong psactive";
}

function search() {
  var keyword = document.getElementById("searchinput").value;
  clearSearch();

  $.post('/guest/dj_data', {dj : dj}, function(data) {
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
  $.post('/guest/dj_data', {dj : dj}, function(data) {
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
                  id : response.items[index].id.videoId,
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


function clearSuggested() {
  var suggestedresults = document.getElementById("suggestedresults");
  if (suggestedresults.childNodes) {
    var length = suggestedresults.childNodes.length;
    for (i=0; i < length; i++) {
      suggestedresults.removeChild(suggestedresults.childNodes[0]);
    }
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

function searchKeyPress() {
  if (event.keyCode == 13) {
    search();
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

function changePlaylistHTML(playlist) {
  $.post("/guest/dj_data", {dj : dj}, function(user) {
    clearSongs();

    var songs = user.currentPlaylist.songs
    for (i in songs) {
      addSongHTML(songs[i].id, songs[i].title, songs[i].score);
    }

    var pagetitle = document.getElementById('pagetitle');
    pagetitle.innerHTML = user.username + ' - ' + playlist;
  }) 
}

function addSong(id, title, element) {
  element.disabled = true;
  element.removeChild(element.firstChild);
  var icon = document.createElement('i');
  icon.className = 'fa fa-check';
  element.appendChild(icon);

  $.post('/guest/dj_data', { dj : dj }, function(data) {
    $.post("/songs/add/"+dj+"/"+data.currentPlaylist.title, {id: id, title: title}); 
  })

  socket.emit('addSong',{id: id, title: title, score: 0, dj : dj});
}

function clearSongs() {
  var playlistcontainer = document.getElementsByClassName("playlistcontainer")[0];
  while (playlistcontainer.firstChild) {
    playlistcontainer.removeChild(playlistcontainer.firstChild);
  }
}

function addSongHTML(id, title, score) {
  var playlistcontainer = document.getElementsByClassName("playlistcontainer")[0];

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
  div.innerHTML = title;
  div.className = 'ptitle';

  playlistsong.appendChild(votebox);
  votebox.appendChild(voteboxvoteup);
  votebox.appendChild(voteboxvotedown);

  playlistsong.appendChild(voteboxnumber);
  playlistsong.appendChild(div);

  playlistcontainer.appendChild(playlistsong);
}

function removeSong(id) {
  $.post('/songs/remove',{id: id});
  socket.emit('delSong', {id : id, dj : dj});
}

function delSongHTML(id) {
  var playlistsong = document.getElementById(id);
  playlistsong.parentNode.removeChild(playlistsong);
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
