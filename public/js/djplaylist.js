function setActivePlaylist(id) {
  activePlaylist = id;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      lastIdx = JSON.parse(xhttp.responseText);
    }
  }
  xhttp.open("GET", "/api/getLastIdx?pid="+activePlaylist, true);
  xhttp.send();

  var socket = io();
  socket.emit('activeplaylist',id);
}

function loadPlaylist() {

  var playlistAccordion = document.getElementById('playlistAccordion');

  while (playlistAccordion.hasChildNodes()) {
    playlistAccordion.removeChild(playlistAccordion.lastChild);
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var playlists = JSON.parse(xhttp.responseText);

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

        for (j in playlist.Songs) {
          var song = playlist.Songs[j];

          var songA = document.createElement('a');
          songA.className = 'list-group-item';
          songA.style.cursor = 'pointer';
          songA.onclick = new Function("","songSelect('"+song.SongID+"','"+id+"')");

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
  // e.parentNode.parentNode.removeChild(e.parentNode);
  var socket = io();
  socket.emit('loadplaylist');
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

function songSelect(sid,pid) {
  var xhttp = new XMLHttpRequest();
  var sendData = "pid="+activePlaylist+"&sid="+sid;
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      idx = JSON.parse(xhttp.responseText);
    }
  };
  xhttp.open("GET", "/api/song/getIdx?"+sendData, true);
  xhttp.send();

  var socket = io();
  socket.emit('playsong', sid, pid);
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