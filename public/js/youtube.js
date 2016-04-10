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
    disablekb:1,
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
  }

  else if (event.data == YT.PlayerState.PLAYING) {

  }
  else if (event.data == YT.PlayerState.PAUSED) {

  }
}

function selectSong() {
  
}