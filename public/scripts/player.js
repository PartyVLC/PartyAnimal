var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    playerVars: {'controls':0, 'disablekb':1, 'modestbranding':1,'rel':0,'showinfo':0},
    videoId: 'dQw4w9WgXcQ',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  var currentlyPlaying = document.getElementById('currentlyPlaying');
  currentlyPlaying.innerHTML += player.getVideoData().title;

  var progressbar = document.createElement('div');
  progressbar.id = 'progressbar'
  progressbar.className = 'progress-bar progress-bar-striped active';
  progressbar.role = 'progressbar';
  progressbar.setAttribute('aria-valuenow','0');
  progressbar.setAttribute('aria-valuemin','0');
  progressbar.setAttribute('aria-valuemax',player.getDuration());
  progressbar.style.width = '100%';

  var progress = document.getElementById('progress');
  progress.appendChild(progressbar);
  progress.style.width = '100%'

  setInterval(refreshProgress,100);

  var time = document.createElement('p');
  time.id = 'time';
  time.innerHTML = "0:00";

  document.getElementById('control').appendChild(time);


  event.target.playVideo();
}

function onPlayerStateChange(event) {
  var playPauseButt = document.getElementById("playPauseButt");
  if (event.data == YT.PlayerState.ENDED) {
    var progressbar = document.getElementById('progressbar');
    progressbar.className = 'progress-bar progress-bar-striped';
  }
  else if (event.data == YT.PlayerState.PLAYING) {
    playPauseButt.className = 'glyphicon glyphicon-pause';
  }
  else if (event.data == YT.PlayerState.PAUSED) {
    playPauseButt.className = 'glyphicon glyphicon-play';
  }
}

function refreshProgress() {
  var progressbar = document.getElementById('progressbar');
  var time = document.getElementById('time');
  var currTime = player.getCurrentTime();

  var min = Math.floor(currTime / 60);
  var sec = Math.floor(currTime) % 60;

  var width = currTime / player.getDuration() * 100;
  progressbar.setAttribute('aria-valuenow',currTime.toString());
  progressbar.style.width = width.toString()+'%';
  time.innerHTML = min.toString() + ':'+ ("0"+sec).slice(-2);
}

function playPause() {
  var state = player.getPlayerState();
  var playPauseButt = document.getElementById('playPauseButt');
  var progressbar = document.getElementById('progressbar');

  if (state == 1) {
    player.pauseVideo();
    playPauseButt.className = 'glyphicon glyphicon-play';
    progressbar.className = 'progress-bar progress-bar-striped';

  }
  else if (state == 2) {
    player.playVideo();
    playPauseButt.className = 'glyphicon glyphicon-pause';
    progressbar.className = 'progress-bar progress-bar-striped active';
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