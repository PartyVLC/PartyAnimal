window.addEventListener('load', function() {
  socket.on('getActivePlaylist',function(pid) {
    activePlaylist = pid;
  });
  loadPlaylistDropDown();
});

socket.on('setActivePlaylist',function(pid) {
  activePlaylist = pid;
  loadPlaylistDropDown();
  setLastIdx();
});

function loadPlaylistDropDown() {

  var pSelect = document.getElementById('playlistSelect');

  while (pSelect.hasChildNodes()) {
    pSelect.removeChild(pSelect.lastChild);
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var playlists = JSON.parse(xhttp.responseText);
      for (i in playlists) {
        var id = playlists[i].PlaylistID;
        var name = playlists[i].Name;

        var pOption = document.createElement('option');
        pOption.innerHTML = name;
        pOption.value = id;

        pSelect.appendChild(pOption);
      }

      if (activePlaylist === undefined) {
        activePlaylist = playlists[0].PlaylistID;
        socket.emit('setActivePlaylist',activePlaylist);
      }
      else {
        pSelect.value = activePlaylist;
      }

      loadSongs();
    }
  };

  xhttp.open("GET", "/api/getPlaylists2", true);
  xhttp.send();
}

function loadSongs() {
  var pList = document.getElementById('pll');
  while (pList.hasChildNodes()) {
    pList.removeChild(pList.lastChild);
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var songs = JSON.parse(xhttp.responseText);
      for (i in songs) {
        var song = songs[i];
        var sli = document.createElement('li');
        sli.className = 'playlistSong';

        sli.style.cursor = 'pointer';
        sli.onclick = new Function("","songSelect('"+song.SongID+"','"+activePlaylist+"')");

        var songP = document.createElement('p');
        songP.style.display = 'inline';
        songP.innerHTML = song.Title;

        var songDel = document.createElement('button');
        songDel.className = 'btn btn-default btn-sm';
        songDel.id = 'songDelButt';

        songDel.onclick = new Function("","deleteFromPlaylist(this,'"+song.SongID+"',"+activePlaylist+")");

        var songSpan = document.createElement('span');
        songSpan.className = 'glyphicon glyphicon-remove';
        songSpan.setAttribute('aria-hidden','true');

        songDel.appendChild(songSpan);

        var downV = document.createElement('button');
        downV.type='button';
        downV.className='btn btn-default';
        downV.onclick = new Function("","downVote(this,'"+song.SongID+"',"+activePlaylist+")");
        var downSpan = document.createElement('span');
        downSpan.id='downVoteButt';
        downSpan.className='glyphicon glyphicon-thumbs-down';
        downV.appendChild(downSpan);

        var score = document.createElement('span');
        score.innerHTML = song.Score;

        var upV = document.createElement('button');
        upV.type='button';
        upV.className='btn btn-default';
        upV.onclick = new Function("","upVote(this,'"+song.SongID+"',"+activePlaylist+")");
        var upSpan = document.createElement('span');
        upSpan.id='upVoteButt';
        upSpan.className='glyphicon glyphicon-thumbs-up';
        upV.appendChild(upSpan);

        sli.appendChild(songDel);
        sli.appendChild(songP);
        sli.appendChild(downV);
        sli.appendChild(score);
        sli.appendChild(upV);
        pList.appendChild(sli);
      }
    }
  };

  xhttp.open("GET", "/api/getSongsByPlaylist?pid="+activePlaylist, true);
  //xhttp.open("GET", "/songs/"+activePlaylist, true);
  xhttp.send();
}

function playlistSelect() {
  var pSelect = document.getElementById('playlistSelect');
  //socket.emit('setActivePlaylist',pSelect.value);
  activePlaylist = pSelect.value;
  loadPlaylistDropDown();
  setLastIdx();
}

function deleteFromPlaylist(e,sid,pid) {
  window.event.stopPropagation();
  var xhttp = new XMLHttpRequest();
  var sendData = "sid="+sid+"&pid="+pid;
  xhttp.open("POST", "/api/deletefromplaylist", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(sendData);

  socket.emit('loadSongs');
}

function deletePlaylist() {
  window.event.stopPropagation();

  var pid = document.getElementById('playlistSelect').value;

  console.log(pid);

  var xhttp = new XMLHttpRequest();
  var sendData = "pid="+pid;
  xhttp.open("POST", "/api/deleteplaylist", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(sendData);
  activePlaylist = undefined;
  
  loadPlaylistDropDown();
}

function songSelect(sid,pid) {
  socket.emit('setActivePlaylist',pid);
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
    loadPlaylistDropDown();
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
      loadPlaylistDropDown();
    }
  }
}