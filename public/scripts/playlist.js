var queue = []
var currentlyPlayingIdx = 0;

document.onclick = function() {
  clearSearch();
}

window.onload = function() {
  loadPlaylist();
}

function loadPlaylist() {

  var playlistGroup = document.getElementById('playlistGroup');
  var playlistUL = document.getElementById('playlists');

  while (playlistGroup.hasChildNodes()) {
    playlistGroup.removeChild(playlistGroup.lastChild);
  }

  while (playlistUL.hasChildNodes()) {
    playlistUL.removeChild(playlistUL.lastChild);
  }

  //Loop over all playlists
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var playlistObj = JSON.parse(xhttp.responseText);
      var playlistAccordion = document.getElementById('playlistAccordion');

      var playlistPanel = document.createElement('div');
      playlistPanel.className = 'panel panel-default';

      var playlistHeading = document.createElement('div');
      playlistHeading.className = 'panel-heading';
      playlistHeading.id = 'heading-'+playlistObj.PlaylistID;
      playlistHeading.setAttribute('role','tab');

      var playlistTitle = document.createElement('h4');
      playlistTitle.className = 'panel-title';

      var playlistA = document.createElement('a');
      playlistA.className = 'collapsed';
      playlistA.role = 'button';
      playlistA.setAttribute('data-toggle','collapse');
      playlistA.setAttribute('data-parent','#playlistAccordion');
      playlistA.href = '#songList';
      playlistA.setAttribute('aria-expanded','true');
      playlistA.setAttribute('aria-controls','songList');
      playlistA.innerHTML = playlistObj.Name;

      var songCollapse = document.createElement('div');
      songCollapse.id = 'songList';
      songCollapse.className = 'panel-collapse collapse in';
      songCollapse.role = 'tabpanel';
      songCollapse.setAttribute('area-labelledby','heading-'+playlistObj.PlaylistID);

      var songContent = document.createElement('div');
      songContent.className = 'panel-body';

      songCollapse.appendChild(songContent);

      playlistTitle.appendChild(playlistA);
      playlistHeading.appendChild(playlistTitle);
      playlistPanel.appendChild(playlistHeading);
      playlistPanel.appendChild(songCollapse);
      playlistAccordion.appendChild(playlistPanel);

      //Loop over songs in each playlist
      var xhttp2 = new XMLHttpRequest();
      xhttp2.onreadystatechange = function() {
        if (xhttp2.readyState == 4 && xhttp2.status == 200) {
          var songObj = JSON.parse(xhttp2.responseText);

          for (song in songObj) {
            (function(index) {

              var songA = document.createElement('a');
              songA.className = 'list-group-item';
              songA.innerHTML = songObj[index].Title;
              songA.style.cursor = 'pointer';
              songA.onclick = function() {songSelect(songObj[index]);};

              var downV = document.createElement('button');
              downV.type='button';
              downV.className='btn btn-default';
              downV.onclick= function() {downVote(songObj[index],index);};
              var downSpan = document.createElement('span');
              downSpan.id='downVoteButt';
              downSpan.className='glyphicon glyphicon-thumbs-down';
              downV.appendChild(downSpan);
              
              var score = document.createElement('span');
              score.innerHTML = songObj[index].Score;
              
              var upV = document.createElement('button');
              upV.type='button';
              upV.className='btn btn-default';
              upV.onclick= function() {upVote(songObj[index])};
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
      };

      var sendData = "id="+playlistObj.PlaylistID;
      xhttp2.open("GET","/songsbyplaylist?"+sendData,true);
      xhttp2.send(sendData);

    }
  };

  xhttp.open("GET", "/playlists", true);
  xhttp.send();
}

function songSelect(song) {
  if (song.id != player.getVideoData().video_id) {
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
  var xhttp = new XMLHttpRequest();
  var sendData = "id="+song.id+"&title="+song.title;
  xhttp.open("POST", "/addsong", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(sendData);

  queue.push(song);
  loadPlaylist();
}

function clearSearch() {
  var resultList = document.getElementById('searchResults')

  while (resultList.hasChildNodes()) {
    resultList.removeChild(resultList.lastChild);
  }
}