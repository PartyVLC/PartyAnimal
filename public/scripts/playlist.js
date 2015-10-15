var queue = ["HMUDVMiITOU","86khmc6y1yE","dQw4w9WgXcQ","kbxtYqA6ypM","mVHJ6OwTYWc"];

function loadPlaylist() {
	var playlistGroup = document.getElementById('playlistGroup');

	while (playlistGroup.hasChildNodes()) {
		playlistGroup.removeChild(playlistGroup.lastChild);
	}
	for (song in queue) {
		var item = document.createElement('a');
		item.className = 'list-group-item';
		item.innerHTML = queue[song];
		item.id = queue[song];
		item.onclick = function() {songSelect(this)};
		item.href="#";
		playlistGroup.appendChild(item);
	}
}

function songSelect(e) {
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
			for (res in response.items) {
				var item = document.createElement('li');
				item.innerHTML = response.items[res].id.videoId;
				resultList.appendChild(item);
			}
		});
}

window.onload = function() {
	loadPlaylist();
}