var queue = []
var currentlyPlayingIdx = 0;

db.run();

document.onclick = function() {
	clearSearch();
}

window.onload = function() {
	loadPlaylist();
}

function loadPlaylist() {

	var playlistGroup = document.getElementById('playlistGroup');

	while (playlistGroup.hasChildNodes()) {
		playlistGroup.removeChild(playlistGroup.lastChild);
	}

	for (song in queue) {
		(function(index) {
			var item = document.createElement('a');
			item.className = 'list-group-item';
			item.innerHTML = queue[index].title;
			item.id = queue[index].id;

			item.onclick = function() {songSelect(queue[index]);};
			item.style.cursor = 'pointer';
			item.innerHTML = queue[index].title;
			item.id = queue[index].id;
			
			var downV = document.createElement('button');
			downV.type='button';
			downV.className='btn btn-default';
			downV.onclick= function() {downVote(queue[index],index);};
			var downSpan = document.createElement('span');
			downSpan.id='downVoteButt';
			downSpan.className='glyphicon glyphicon-thumbs-down';
			downV.appendChild(downSpan);
			
			var score = document.createElement('span');
			score.innerHTML = queue[song].score;
			
			var upV = document.createElement('button');
			upV.type='button';
			upV.className='btn btn-default';
			upV.onclick= function() {upVote(queue[index])};
			var upSpan = document.createElement('span');
			upSpan.id='upVoteButt';
			upSpan.className='glyphicon glyphicon-thumbs-up';
			upV.appendChild(upSpan);
			
			item.appendChild(downV);
			item.appendChild(score);
			item.appendChild(upV);

			playlistGroup.appendChild(item);
		})(song);

		if (queue[0]) {
			songSelect(queue[0]);
		}
	}
}

function songSelect(song) {
	console.log(song);
	if (song.id != player.getVideoData().video_id) {
		var currentlyPlaying = document.getElementById('currentlyPlaying');
		player.loadVideoById(song.id);
	}
}

function upVote(song)
{
	event.cancelBubble = true;
	song.score++;
	loadPlaylist();
}

function downVote(song,index)
{
	event.cancelBubble = true;
	song.score--;
	if (song.score < -4) {
		delete queue[index];
	}
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
	queue.push(song);
	loadPlaylist();
}

function clearSearch() {
	var resultList = document.getElementById('searchResults')

	while (resultList.hasChildNodes()) {
		resultList.removeChild(resultList.lastChild);
	}
}

window.onload = function() {
	loadPlaylist();
}