var queue = []
var currentlyPlayingIdx = 0;
var currentPlaylist = null;

document.onclick = function() {
  clearSearch();
}

window.onload = function() {
  var activePlaylist = document.getElementsByClassName('panel-collapse collapse in');
  var allPlaylists = document.getElementsByClassName('panel-collapse collapse');
  if (activePlaylist.length > 0) {
    currentPlaylist = activePlaylist[0].previousSibling.id;
  }
  else if (allPlaylists.length == 1) {
    currentPlaylist = allPlaylists[0].previousSibling.id;
  }

  loadPlaylist();
}

function loadPlaylist() {

  var playlistAccordion = document.getElementById('playlistAccordion');

  while (playlistAccordion.hasChildNodes()) {
    playlistAccordion.removeChild(playlistAccordion.lastChild);
  }

  //Loop over all playlists
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var playlists = JSON.parse(xhttp.responseText);
      console.log(playlists);

      var pIDs = Object.keys(playlists);

      for (i in pIDs) {
        var id = pIDs[i];
        var playlist = playlists[id];

        var playlistAccordion = document.getElementById('playlistAccordion');

        var playlistPanel = document.createElement('div');
        playlistPanel.className = 'panel panel-default';

        var playlistHeading = document.createElement('div');
        playlistHeading.className = 'panel-heading';

        playlistHeading.id = id;
        playlistHeading.setAttribute('role','tab');

        var playlistTitle = document.createElement('h4');
        playlistTitle.className = 'panel-title';

        var playlistA = document.createElement('a');
        playlistA.className = 'collapsed';
        playlistA.role = 'button';
        playlistA.setAttribute('data-toggle','collapse');
        playlistA.setAttribute('data-parent','#playlistAccordion');
        playlistA.href = '#songList-'+id;
        playlistA.setAttribute('aria-expanded','true');
        playlistA.setAttribute('aria-controls','#songList-'+id);
        playlistA.innerHTML = playlist[0].PlaylistName;

        var songCollapse = document.createElement('div');
        songCollapse.id = '#songList-'+id;
        if (currentPlaylist == id) {
          songCollapse.className = 'panel-collapse collapse in';
        }
        else {
          songCollapse.className = 'panel-collapse collapse';
        }
        songCollapse.role = 'tabpanel';
        songCollapse.setAttribute('area-labelledby','heading-'+id);

        var songContent = document.createElement('div');
        songContent.className = 'panel-fbody';

        songCollapse.appendChild(songContent);

        playlistTitle.appendChild(playlistA);
        playlistHeading.appendChild(playlistTitle);
        playlistPanel.appendChild(playlistHeading);
        playlistPanel.appendChild(songCollapse);
        playlistAccordion.appendChild(playlistPanel);



        for (song in playlist) {
          (function(index) {

            var songA = document.createElement('a');
            songA.className = 'list-group-item';
            songA.innerHTML = playlist[index].Title;
            songA.style.cursor = 'pointer';
            songA.onclick = function() {songSelect(playlist[index]);};

            var downV = document.createElement('button');
            downV.type='button';
            downV.className='btn btn-default';
            downV.onclick= function() {downVote(playlist[index],index);};
            var downSpan = document.createElement('span');
            downSpan.id='downVoteButt';
            downSpan.className='glyphicon glyphicon-thumbs-down';
            downV.appendChild(downSpan);
            
            var score = document.createElement('span');
            score.innerHTML = playlist[index].Score;
            
            var upV = document.createElement('button');
            upV.type='button';
            upV.className='btn btn-default';
            upV.onclick= function() {upVote(playlist[index])};
            var upSpan = document.createElement('span');
            upSpan.id='upVoteButt';
            upSpan.className='glyphicon glyphicon-thumbs-up';
            upV.appendChild(upSpan);
            
            songA.appendChild(downV);
            songA.appendChild(score);
            songA.appendChild(upV);

            songContent.appendChild(songA);
          })(song)
        }
      }
    }
  };

  xhttp.open("GET", "/api/playlists", true);
  xhttp.send();
}


function songSelect(song) {
  if (song.SongID != player.getVideoData().video_id) {
    var currentlyPlaying = document.getElementById('currentlyPlaying');
    player.loadVideoById(song.SongID);
  }
}

function upVote(song)
{
  event.cancelBubble = true;

  var xhttp = new XMLHttpRequest();
  var sendData = "id="+song.SongID;
  xhttp.open("POST", "/upvote", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(sendData);

  loadPlaylist();
}

function downVote(song,index)
{
  event.cancelBubble = true;

  var xhttp = new XMLHttpRequest();
  var sendData = "id="+song.SongID;
  xhttp.open("POST", "/downvote", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(sendData);

  // if (song.Score < -4) {
  //   //delete queue[index];
  // }
  loadPlaylist();
}

function addSongById(id) {
  queue.push(id);
  loadPlaylist();
}

function searchKeyPress() {
  if (event.keyCode == 13) {
    search();
  }
}

function search() {
  var keyword = document.getElementById('searchBar').value;
  $.get('https://www.googleapis.com/youtube/v3/search',{
    q:keyword,
    part:'snippet',
    key:'AIzaSyBS_lekQxyiMLv9VKc4iqzMxufvPln4y9w',
    maxResults:5,
    type:'video'
    },

    function(response){
      var resultList = document.getElementById('searchResults');

      clearSearch();

      for (res in response.items) {
        (function(index) {
          var song = {
            id:response.items[index].id.videoId,
            title:response.items[index].snippet.title,
            score:0
          }

          var item = document.createElement('button');

          item.innerHTML = song.title;
          item.id = song.id;

          item.type = 'button';
          item.className = 'btn btn-default';

          item.onclick = function() {addFromSearch(song)};

          resultList.appendChild(item);

        })(res);
      }
    });
}

function addFromSearch(song) {
  if (currentPlaylist) {
    var xhttp = new XMLHttpRequest();
    var sendData = "id="+song.id+"&title="+song.title+"&pid="+playlistid;
    xhttp.open("POST", "/addsong", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(sendData);

    loadPlaylist();
  }

}

function clearSearch() {
  var resultList = document.getElementById('searchResults');

  while (resultList.hasChildNodes()) {
    resultList.removeChild(resultList.lastChild);
  }
}

function addPlaylist(e) {
  var name = e.parentNode.previousSibling.value;
  if (name) {
    var xhttp = new XMLHttpRequest();
    var sendData = "name="+name;
    xhttp.open("POST", "/addplaylist", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(sendData);
    loadPlaylist();
  }
}