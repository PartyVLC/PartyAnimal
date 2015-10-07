window.onload = function() {

	var queue = ["HMUDVMiITOU","86khmc6y1yE","dQw4w9WgXcQ","kbxtYqA6ypM","mVHJ6OwTYWc"];

	var playlistGroup = document.getElementById('playlistGroup');
	for (song in queue) {
		var item = document.createElement('a');
		item.className = 'list-group-item';
		item.innerHTML = queue[song];
		item.id = queue[song];
		item.onclick = function() {songSelect(this)};
		item.href="#";
		playlistGroup.appendChild(item);
	}

	function songSelect(e) {
		player.loadVideoById(e.id);
	}

}

