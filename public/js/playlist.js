var lastIdx;
var activePlaylist;

window.onload = function() {
  setLastIdx();
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

function setLastIdx() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      lastIdx = JSON.parse(xhttp.responseText);
    }
  }
  xhttp.open("GET", "/api/getLastIdx?pid="+activePlaylist, true);
  xhttp.send();
}

function upVote(e,SongID,PlaylistID)
{
  window.event.stopPropagation();
  var xhttp = new XMLHttpRequest();
  var sendData = "sid="+SongID+"&pid="+PlaylistID;
  xhttp.open("POST", "/api/upvote", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(sendData);

  // xhttp = new XMLHttpRequest();
  // xhttp.onreadystatechange = function() {
  //   if (xhttp.readyState == 4 && xhttp.status == 200) {
  //     var score = JSON.parse(xhttp.responseText);
  //     e.previousSibling.innerHTML = score[0].Score;
  //   }
  // };
  // xhttp.open("GET","/api/score?"+sendData,true);
  // xhttp.send();

  socket.emit('loadSongs');
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

  // xhttp = new XMLHttpRequest();
  // xhttp.onreadystatechange = function() {
  //   if (xhttp.readyState == 4 && xhttp.status == 200) {
  //     var score = JSON.parse(xhttp.responseText);
  //     e.nextSibling.innerHTML = score[0].Score;
  //   }
  // };
  // xhttp.open("GET","/api/score?"+sendData,true);
  // xhttp.send();

  socket.emit('loadSongs');
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
  lastIdx++;

  var xhttp = new XMLHttpRequest();
  var sendData = "id="+song.id+"&title="+song.title+"&pid="+activePlaylist+"&idx="+lastIdx;
  xhttp.open("POST", "/api/addsong", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(sendData);

  socket.emit('loadSongs')
}