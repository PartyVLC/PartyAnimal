var activePlaylist;
var idx;
var lastIdx;

window.onload = function() {
  activePlaylist = null;
  idx = 1;
  lastIdx = 1;

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

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      lastIdx = JSON.parse(xhttp.responseText);
    }
  }
  xhttp.open("GET", "/api/getLastIdx?pid="+activePlaylist, true);
  xhttp.send();
}

function loadPlaylist() {

  var playlistAccordion = document.getElementById('playlistAccordion');

  while (playlistAccordion.hasChildNodes()) {
    playlistAccordion.removeChild(playlistAccordion.lastChild);
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var songs = JSON.parse(xhttp.responseText);
      var name = songs[0].Name;

      var playlistAccordion = document.getElementById('playlistAccordion');

      var playlistPanel = document.createElement('div');
      playlistPanel.className = 'panel panel-default';

      var playlistHeading = document.createElement('div');
      playlistHeading.className = 'panel-heading';

      //playlistHeading.id = id;
      playlistHeading.id = 5;
      playlistHeading.setAttribute('role','tab');

      var playlistTitle = document.createElement('h4');
      playlistTitle.className = 'panel-title';

      var playlistA = document.createElement('a');
      playlistA.className = 'collapsed';
      playlistA.setAttribute('role','button');
      playlistA.setAttribute('data-toggle','collapse');
      playlistA.setAttribute('data-parent','#playlistAccordion');
      //playlistA.href = '#songList-'+id;
      playlistA.href = '#songList-5';
      playlistA.setAttribute('aria-expanded','true');
      //playlistA.setAttribute('aria-controls','#songList-'+id);
      playlistA.setAttribute('aria-controls','#songList-5');

      var songCollapse = document.createElement('div');
      //songCollapse.id = 'songList-'+id;
      songCollapse.id = 'songList-5';
      songCollapse.className = 'panel-collapse collapse in';
      songCollapse.role = 'tabpanel';
      //songCollapse.setAttribute('area-labelledby','heading-'+id);
      songCollapse.setAttribute('area-labelledby','heading-5');

      var songContent = document.createElement('div');
      songContent.className = 'panel-fbody';

      playlistA.innerHTML += "\t"+name;

      songCollapse.appendChild(songContent);

      playlistTitle.appendChild(playlistA);
      playlistHeading.appendChild(playlistTitle);
      playlistPanel.appendChild(playlistHeading);
      playlistPanel.appendChild(songCollapse);
      playlistAccordion.appendChild(playlistPanel);

      for (i in songs) {

        var song = songs[i];

        var songA = document.createElement('a');
        songA.className = 'list-group-item';
        
        var songP = document.createElement('p');
        songP.style.display = 'inline';
        songP.innerHTML = song.Title;

        songA.appendChild(songP);

        var downV = document.createElement('button');
        downV.type='button';
        downV.className='btn btn-default';
        // downV.onclick = new Function("","downVote(this,'"+song.SongID+"',"+id+")");
        downV.onclick = new Function("","downVote(this,'"+song.SongID+"',5)");
        var downSpan = document.createElement('span');
        downSpan.id='downVoteButt';
        downSpan.className='glyphicon glyphicon-thumbs-down';
        downV.appendChild(downSpan);
        
        var score = document.createElement('span');
        score.innerHTML = song.Score;
        
        var upV = document.createElement('button');
        upV.type='button';
        upV.className='btn btn-default';
        // upV.onclick = new Function("","upVote(this,'"+song.SongID+"',"+id+")");
        upV.onclick = new Function("","upVote(this,'"+song.SongID+"',5)");
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
  };

  xhttp.open("GET", "/api/getSongsByPlaylist?pid=5", true);
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
  var xhttp = new XMLHttpRequest();
  var sendData = "pid="+activePlaylist+"&sid="+id;
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      idx = JSON.parse(xhttp.responseText);
    }
  };
  xhttp.open("GET", "/api/song/getIdx?"+sendData, true);
  xhttp.send();

  playVideo(id);
}

function playVideo(id) {
  if (id != player.getVideoData().video_id) {
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
  // if (activePlaylist) {
  //   lastIdx++;
  //   var xhttp = new XMLHttpRequest();
  //   var sendData = "id="+song.id+"&title="+song.title+"&pid="+activePlaylist+"&idx="+lastIdx;
  //   xhttp.open("POST", "/api/addsong", true);
  //   xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //   xhttp.send(sendData);
  //   loadPlaylist();
  // }
  
}