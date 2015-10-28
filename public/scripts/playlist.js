var queue = []
var currentlyPlayingIdx = 0;
var activePlaylist = null;

document.onclick = function() {
  clearSearch();
}

window.onload = function() {
  loadPlaylist();
}

function setActivePlaylist(id) {
  activePlaylist = id;
}

function loadPlaylist() {

  var playlistAccordion = document.getElementById('playlistAccordion');

  while (playlistAccordion.hasChildNodes()) {
    playlistAccordion.removeChild(playlistAccordion.lastChild);
  }

  var emptyPlaylists = []
  var xhttp2 = new XMLHttpRequest();
  xhttp2.onreadystatechange = function() {
    if (xhttp2.readyState == 4 && xhttp2.status == 200) {
      emptyPlaylists = JSON.parse(xhttp2.responseText); 
    }
  };

  xhttp2.open("GET", "/api/emptyplaylists", true);
  xhttp2.send();

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var playlists = JSON.parse(xhttp.responseText);

      for (i in emptyPlaylists) {
        var ekey = emptyPlaylists[i].PlaylistID;
        console.log(ekey);
        playlists[ekey] = {'PlaylistName':emptyPlaylists[i].Name,"Songs":[]};
      }

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
        playlistA.setAttribute('role','button');
        playlistA.setAttribute('data-toggle','collapse');
        playlistA.setAttribute('data-parent','#playlistAccordion');
        playlistA.href = '#songList-'+id;
        playlistA.setAttribute('aria-expanded','true');
        playlistA.setAttribute('aria-controls','#songList-'+id);
        playlistA.onclick = new Function("","setActivePlaylist('"+id+"'); console.log(activePlaylist);");
        playlistA.innerHTML = playlist.PlaylistName;

        var songCollapse = document.createElement('div');
        songCollapse.id = 'songList-'+id;
        if (activePlaylist == id) {
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

        for (idx in playlist.Songs) {
          var song = playlist.Songs[idx];

            var songA = document.createElement('a');
            songA.className = 'list-group-item';
            songA.innerHTML = song.Title;
            songA.style.cursor = 'pointer';
            songA.onclick = new Function("","songSelect('"+song.SongID+"')");

            var downV = document.createElement('button');
            downV.type='button';
            downV.className='btn btn-default';
            downV.onclick = new Function("","downVote('"+song.SongID+"',"+id+")");
            var downSpan = document.createElement('span');
            downSpan.id='downVoteButt';
            downSpan.className='glyphicon glyphicon-thumbs-down';
            downV.appendChild(downSpan);
            
            var score = document.createElement('span');
            score.innerHTML = song.Score;
            
            var upV = document.createElement('button');
            upV.type='button';
            upV.className='btn btn-default';
            upV.onclick = new Function("","upVote('"+song.SongID+"',"+id+")");
            var upSpan = document.createElement('span');
            upSpan.id='upVoteButt';
            upSpan.className='glyphicon glyphicon-thumbs-up';
            upV.appendChild(upSpan);
            
            songA.appendChild(downV);
            songA.appendChild(score);
            songA.appendChild(upV);

            songContent.appendChild(songA);
        }
      }
    }
  };

  xhttp.open("GET", "/api/playlists", true);
  xhttp.send();
}


function songSelect(id) {
  if (id != player.getVideoData().video_id) {
    var currentlyPlaying = document.getElementById('currentlyPlaying');
    player.loadVideoById(id);
  }
}

function upVote(SongID,PlaylistID)
{
  event.cancelBubble = true;
  var xhttp = new XMLHttpRequest();
  var sendData = "sid="+SongID+"&pid="+PlaylistID;
  xhttp.open("POST", "/upvote", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(sendData);
  loadPlaylist();
}

function downVote(SongID,PlaylistID)
{
  event.cancelBubble = true;

  var xhttp = new XMLHttpRequest();
  var sendData = "sid="+SongID+"&pid="+PlaylistID;
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
  if (activePlaylist) {
    var xhttp = new XMLHttpRequest();
    var sendData = "id="+song.id+"&title="+song.title+"&pid="+activePlaylist;
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