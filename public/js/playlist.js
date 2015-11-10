var activePlaylist = null;

window.onload = function() {
  loadPlaylist();
}

document.onclick = function() {
  clearSearch();
}

function clearSearch() {
  var resultList = document.getElementById('searchResults');

  while (resultList.hasChildNodes()) {
    resultList.removeChild(resultList.lastChild);
  }
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

  xhttp2.open("GET", "/api/emptyPlaylists", true);
  xhttp2.send();

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var playlists = JSON.parse(xhttp.responseText);

      for (i in emptyPlaylists) {
        var ekey = emptyPlaylists[i].PlaylistID;
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
        playlistA.onclick = new Function("","setActivePlaylist('"+id+"')");

        var playlistDel = document.createElement('button');
        playlistDel.className = 'btn btn-default btn-sm';
        playlistDel.onclick = new Function("","deletePlaylist(this,"+id+")");

        var playlistSpan = document.createElement('span');
        playlistSpan.className = 'glyphicon glyphicon-remove';
        playlistSpan.setAttribute('aria-hidden','true');

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

        playlistA.innerHTML += "\t"+playlist.PlaylistName;

        playlistDel.appendChild(playlistSpan);
        playlistTitle.appendChild(playlistDel);

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
            songA.style.cursor = 'pointer';
            songA.onclick = new Function("","songSelect('"+song.SongID+"')");

            var songP = document.createElement('p');
            songP.style.display = 'inline';
            songP.innerHTML = song.Title;

            var songDel = document.createElement('button');
            songDel.className = 'btn btn-default btn-sm';
            songDel.id = 'songDelButt';

            songDel.onclick = new Function("","deleteFromPlaylist(this,'"+song.SongID+"',"+id+")");

            var songSpan = document.createElement('span');
            songSpan.className = 'glyphicon glyphicon-remove';
            songSpan.setAttribute('aria-hidden','true');

            songDel.appendChild(songSpan);
            songA.appendChild(songDel);
            songA.appendChild(songP);

            var downV = document.createElement('button');
            downV.type='button';
            downV.className='btn btn-default';
            downV.onclick = new Function("","downVote(this,'"+song.SongID+"',"+id+")");
            var downSpan = document.createElement('span');
            downSpan.id='downVoteButt';
            downSpan.className='glyphicon glyphicon-thumbs-down';
            downV.appendChild(downSpan);
            
            var score = document.createElement('span');
            score.innerHTML = song.Score;
            
            var upV = document.createElement('button');
            upV.type='button';
            upV.className='btn btn-default';
            upV.onclick = new Function("","upVote(this,'"+song.SongID+"',"+id+")");
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

  xhttp.open("GET", "/api/getPlaylists", true);
  xhttp.send();
}

function deleteFromPlaylist(e,sid,pid) {
  window.event.stopPropagation();
  var xhttp = new XMLHttpRequest();
  var sendData = "sid="+sid+"&pid="+pid;
  xhttp.open("POST", "/api/deletefromplaylist", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(sendData);
  e.parentNode.parentNode.removeChild(e.parentNode);
}

function deletePlaylist(e,pid) {
  window.event.stopPropagation();
  var xhttp = new XMLHttpRequest();
  var sendData = "pid="+pid;
  xhttp.open("POST", "/api/deleteplaylist", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(sendData);
  e.parentNode.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode.parentNode);
}

function songSelect(id) {
  if (id != player.getVideoData().video_id) {
    var xhttp = new XMLHttpRequest();
    $.get('https://www.googleapis.com/youtube/v3/videos',
      {
        part:'snippet',
        key:'AIzaSyBS_lekQxyiMLv9VKc4iqzMxufvPln4y9w',
        id:id
      },
      function(response){
        var currentlyPlaying = document.getElementById('currentlyPlaying');
        currentlyPlaying.innerHTML = "Currently Playing: "+response.items[0].snippet.title;
      }
    );

    player.loadVideoById(id);
  }
}

function upVote(e,SongID,PlaylistID)
{
  window.event.stopPropagation();
  var xhttp = new XMLHttpRequest();
  var sendData = "sid="+SongID+"&pid="+PlaylistID;
  xhttp.open("POST", "/api/upvote", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(sendData);

  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var score = JSON.parse(xhttp.responseText);
      e.previousSibling.innerHTML = score[0].Score;
    }
  };
  xhttp.open("GET","/api/score?"+sendData,true);
  xhttp.send();
}

function downVote(e,SongID,PlaylistID)
{
  window.event.stopPropagation();
  var xhttp = new XMLHttpRequest();
  var sendData = "sid="+SongID+"&pid="+PlaylistID;
  xhttp.open("POST", "/api/downvote", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(sendData);

  // if (song.Score < -4) {
  //   //delete queue[index];
  // }

  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var score = JSON.parse(xhttp.responseText);
      e.nextSibling.innerHTML = score[0].Score;
    }
  };
  xhttp.open("GET","/api/score?"+sendData,true);
  xhttp.send();
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
    xhttp.open("POST", "/api/addsong", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(sendData);
    loadPlaylist();
  }

}

//onclick function
function addPlaylist(e) {
  var name = e.parentNode.previousSibling;
  if (name.value) {
    var xhttp = new XMLHttpRequest();
    var sendData = "name="+name.value;
    xhttp.open("POST", "/api/addplaylist", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(sendData);

    name.value = "";

    loadPlaylist();
  }
}

function addPlaylistKeyPress(e) {
  if (event.keyCode == 13) {
    if (e.value) {
      var xhttp = new XMLHttpRequest();
      var sendData = "name="+e.value;
      xhttp.open("POST", "/api/addplaylist", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(sendData);
      e.value = "";
      loadPlaylist();
    }
  }
}