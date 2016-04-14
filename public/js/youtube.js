var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    playerVars: {'controls':0, 'disablekb':1, 'modestbranding':1,'rel':0,'showinfo':0},
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
  //event.target.playVideo();
}

function onPlayerStateChange(event) {
  var progressbarplaypause = document.getElementById("progressbarplaypause");
  if (event.data == YT.PlayerState.ENDED) {
  }
  else if (event.data == YT.PlayerState.PLAYING) {
    progressbarplaypause.innerHTML = "||";
  }
  else if (event.data == YT.PlayerState.PAUSED) {
    progressbarplaypause.innerHTML = ">";
  }
}

function selectSong(id) {
  player.loadVideoById(id);  
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
  songadd.innerHTML = "ADD";
  songadd.onclick = function() {addSong(song.id,song.title)};


  var p = document.createElement("p");
  p.innerHTML = song.title;

  playlistsong.appendChild(songadd);
  playlistsong.appendChild(p);
  searchresults.appendChild(playlistsong);
}

function addSong(id, title) {
  $.post("/songs/add", {id: id, title: title})
  $.post("/dj/set/refresh");
  socket.emit('addSong',{id: id, title: title, url: window.location.href});
}

function addSongHTML(id, title) {
  var sidebarplaylistcontainer = document.getElementById("sidebarplaylistcontainer");

  var playlistsong = document.createElement('div');
  playlistsong.id = id;
  playlistsong.className = "playlistsong";

  var votebox = document.createElement('div');
  votebox.className = "votebox";

  var voteboxvoteup = document.createElement("button");
  voteboxvoteup.innerHTML = "+";
  voteboxvoteup.className = "voteboxvote";

  var voteboxvotedown = document.createElement("button");
  voteboxvotedown.innerHTML = "-";
  voteboxvotedown.className = "voteboxvote";

  var voteboxnumber = document.createElement("div");
  voteboxnumber.className = "voteboxnumber";
  voteboxnumber.innerHTML = 69;

  var a = document.createElement("a");
  a.href="#";
  a.onclick = function() {selectSong(id);}
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
  $.post("/dj/set/refresh");
  delSongHTML(id);
}

function delSongHTML(id) {
  var playlistsong = document.getElementById(id)
  playlistsong.parentNode.removeChild(playlistsong)

}