//var queue = ["HMUDVMiITOU","86khmc6y1yE","dQw4w9WgXcQ","kbxtYqA6ypM","mVHJ6OwTYWc"];
var queue = [];



function loadPlaylist() {
	var playlistGroup = document.getElementById('playlistGroup');

	while (playlistGroup.hasChildNodes()) {
		playlistGroup.removeChild(playlistGroup.lastChild);
	}
	for (song in queue) {
		var item = document.createElement('a');
		item.className = 'list-group-item';
		item.innerHTML = queue[song].title;
		item.id = queue[song].id;
		item.onclick = function() {songSelect(this)};
		item.href="#";
		playlistGroup.appendChild(item);
	}
}

function songSelect(e) {
	var currentlyPlaying = document.getElementById('currentlyPlaying');
	player.loadVideoById(e.id);
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
		key:'AIzaSyBS_lekQxyiMLv9VKc4iqzMxufvPln4y9w'
		},
		function(response){
			var resultList = document.getElementById('searchResults');

			while (resultList.hasChildNodes()) {
				resultList.removeChild(resultList.lastChild);
			}

			console.log(response);
			for (res in response.items) {
				var song = {
					id:response.items[res].id.videoId,
					title:response.items[res].snippet.title,
				}

				var item = document.createElement('button');

				item.innerHTML = song.title;
				item.id = song.id;

				item.type = 'button';
				item.className = 'btn btn-default';

				item.onclick = function() {addFromSearch(this)};

				resultList.appendChild(item);
			}
		});
}

function addFromSearch(e) {
	queue.push({id:e.id,title:e.innerHTML});
	loadPlaylist();
}

window.onload = function() {
	loadPlaylist();
}