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
      socket.emit('removeSong',{id : playedSong, dj : dj});

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

function playPause() {
  var state = player.getPlayerState();
  if (state == 1) {
    player.pauseVideo();

  }
  else if (state == 2) {
    player.playVideo();
  }
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

function clickTime(e) {
  console.log(e);
}