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
  $.get("/dj/user_data", function(user) {
    setInterval(refreshProgress,100);
    var songs = user.currentPlaylist.songs;
    if (songs[0]) {
      // selectSongSocket(songs[0].id);
      // $.post('/songs/remove',{id: songs[0].id});
      socket.emit('selectSong',{id : songs[0].id, title: songs[0].title, dj : dj});
    }
    else {
      console.log("No queued song to play");
      socket.emit('nosong', { dj : dj});
    }
  });
  
  $('.progressbarinnercontainer').bind('click', function (ev) {
    var $div = $(ev.target);
    var $display = $div.find('.progressbardisplay');

    var offset = $div.offset();
    var x = ev.clientX - offset.left;

    $('.progressbar').width(x);
    player.seekTo($('.progressbar').width() / $('.progressbarinnercontainer').width() * player.getDuration());
  });
}

function onPlayerStateChange(event) {
  var progressbarplaypause = document.getElementById("progressbarplaypause");
  if (event.data == YT.PlayerState.ENDED) {
    $.get("/dj/user_data", function(user) {
      var songs = user.currentPlaylist.songs;
      console.log(songs.length);
      if (songs.length > 0) {
        var nextSong = songs[0].id;

        if (nextSong) {
          // selectSongSocket(nextSong, songs[0].title);
          // $.post('/songs/remove',{id: nextSong});
          socket.emit('selectSong',{id : nextSong, title: songs[0].title, dj : dj});
        }
      }
      else {
        socket.emit('nosong', {dj : dj});
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
