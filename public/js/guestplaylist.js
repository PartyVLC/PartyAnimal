function loadPlaylist() {
  var playlistAccordion = document.getElementById('playlistAccordion');

  while (playlistAccordion.hasChildNodes()) {
    playlistAccordion.removeChild(playlistAccordion.lastChild);
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var songs = JSON.parse(xhttp.responseText);
      if (songs.length !== 0) {
        var name = songs[0].Name;

        var playlistAccordion = document.getElementById('playlistAccordion');

        var playlistPanel = document.createElement('div');
        playlistPanel.className = 'panel panel-default';

        var playlistHeading = document.createElement('div');
        playlistHeading.className = 'panel-heading';

        playlistHeading.id = activePlaylist;
        playlistHeading.setAttribute('role','tab');

        var playlistTitle = document.createElement('h4');
        playlistTitle.className = 'panel-title';

        var playlistA = document.createElement('a');
        playlistA.className = 'collapsed';
        playlistA.setAttribute('role','button');
        playlistA.setAttribute('data-toggle','collapse');
        playlistA.setAttribute('data-parent','#playlistAccordion');
        playlistA.href = '#songList-'+activePlaylist;

        playlistA.setAttribute('aria-expanded','true');
        playlistA.setAttribute('aria-controls','#songList-'+activePlaylist);

        var songCollapse = document.createElement('div');
        songCollapse.id = 'songList-'+activePlaylist;
        songCollapse.className = 'panel-collapse collapse in';
        songCollapse.role = 'tabpanel';
        songCollapse.setAttribute('area-labelledby','heading-'+activePlaylist);
        
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
          
          songA.appendChild(downV);
          songA.appendChild(score);
          songA.appendChild(upV);

          songContent.appendChild(songA);
        }
      }
    }
  };

  xhttp.open("GET", "/api/getSongsByPlaylist?pid="+activePlaylist, true);
  xhttp.send();
}