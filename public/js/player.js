// window.onload = function() {
//   initProgressBar();
// }

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    playerVars: {'controls':1, 'disablekb':1, 'modestbranding':1,'rel':0,'showinfo':0},
    videoId: 'dQw4w9WgXcQ',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
    fs:0,
    iv_load_policy:3,
    disablekb:1
  });
}

function onPlayerReady(event) {
  var currentlyPlaying = document.getElementById('currentlyPlaying');
  currentlyPlaying.innerHTML += player.getVideoData().title;

  setInterval(refreshProgress,100);
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  var myPlayPause = document.getElementById("myPlayPause");
  if (event.data == YT.PlayerState.ENDED) {
    var xhttp = new XMLHttpRequest();
    var sendData = "idx="+(idx+1)+"&pid="+activePlaylist;
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        var response = JSON.parse(xhttp.responseText);
        if (response){
          var songid = response.SongID;
          songSelect(songid);
        }
      }
    };
    xhttp.open("GET","/api/song/getNext?"+sendData,true);
    xhttp.send();
    //loadPlaylist();
  }

  else if (event.data == YT.PlayerState.PLAYING) {
    myPlayPause.className = 'glyphicon glyphicon-pause';
  }
  else if (event.data == YT.PlayerState.PAUSED) {
    myPlayPause.className = 'glyphicon glyphicon-play';
  }
}

function refreshProgress() {
  var myTime = document.getElementById('myTime');
  var currTime = player.getCurrentTime();
  var duration = player.getDuration();

  var minCurr = Math.floor(currTime / 60);
  var secCurr = Math.floor(currTime) % 60;

  var minDur = Math.floor(duration / 60);
  var secDur = Math.floor(duration) % 60;

  var width = currTime / player.getDuration() * 100;
  setProgressPercent(width);
  myTime.innerHTML = minCurr.toString() + ':'+ ("0"+secCurr).slice(-2) + " / " + minDur.toString() + ':'+ ("0"+secDur).slice(-2);
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

function showHideToggle() {
  var player = document.getElementById("player");
  var showHideButt = document.getElementById("showHideButt");
  if (player.style.display == "none") {
    player.style.display = "initial";
    showHideButt.className = 'glyphicon glyphicon-eye-open';
  }
  else {
    player.style.display = 'none';
    showHideButt.className = 'glyphicon glyphicon-eye-close';
  }
}

//my progress bar stuff

function initProgressBar()
{
    e = document.getElementById("progressInnerCont");
    wid = e.parentNode.offsetWidth - 192 + "px";
    e.style.width = wid;
}

function setProgressPercent(percent)
{
    e = document.getElementById("progressTimeBar");
    e.style.width = percent + "%";
}