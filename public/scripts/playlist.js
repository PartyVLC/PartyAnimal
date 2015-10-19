//var queue = [{id:"HMUDVMiITOU",score:0},{id:"86khmc6y1yE",score:0},{id:"dQw4w9WgXcQ",score:0},{id:"kbxtYqA6ypM",score:0},{id:"mVHJ6OwTYWc",score:577}];
var queue = []
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

			item.onclick = function() {songSelect(queue[index])};
			item.href="#";
			item.innerHTML = queue[index].title;
			item.id = queue[index].id;
			
			var downV = document.createElement('button');
			downV.type='button';
			downV.className='btn btn-default';
			downV.onclick= function() {downVote(queue[index])};
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
	}
}

function songSelect(song) {
	var currentlyPlaying = document.getElementById('currentlyPlaying');
	player.loadVideoById(song.id);
}

function upVote(song)
{
	song.score++;
	loadPlaylist();
}

function downVote(song)
{
	song.score--;
	loadPlaylist();
}

function addSongById(id) {
	queue.push(id);
	loadPlaylist();
}

function search() {
	var keyword = document.getElementById('searchBar').value;
	$.get('https://www.googleapis.com/youtube/v3/search',{
		q:keyword,
		part:'snippet',
		key:'AIzaSyBS_lekQxyiMLv9VKc4iqzMxufvPln4y9w',
		maxResults:20,
		type:'video'
		},

		function(response){
			var resultList = document.getElementById('searchResults');

			while (resultList.hasChildNodes()) {
				resultList.removeChild(resultList.lastChild);
			}

			console.log(response);
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

window.onload = function() {
	loadPlaylist();
}
//button(type='button',class='btn btn-default',onclick='playPause()')
//      span(id='playPauseButt',class='glyphicon glyphicon-pause', aria-hidden='true')

