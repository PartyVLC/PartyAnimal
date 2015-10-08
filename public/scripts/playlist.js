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

function addSongById() {
	var id = document.getElementById('searchBar').value;
	queue.push(id);
	loadPlaylist();
}

window.onload = function() {
	loadPlaylist();
}