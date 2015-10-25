window.onload = function() {

	var queue = [{id:"HMUDVMiITOU",score:0},{id:"86khmc6y1yE",score:0},{id:"dQw4w9WgXcQ",score:0},{id:"kbxtYqA6ypM",score:0},{id:"mVHJ6OwTYWc",score:0}];
	console.log(queue);
	var playlistGroup = document.getElementById('playlistGroup');
	for (song in queue) {
		var item = document.createElement('a');
		item.className = 'list-group-item';
		item.innerHTML = queue[song].id;
		item.id = queue[song].id;
		console.log(queue[song].id);
		//item.onclick = function() {songSelect(this)};
		//item.href="#";

		var downV = document.createElement('button');
		downV.type='button';
		downV.className='btn btn-default';
		downV.onclick= function() {downVote(this.parentNode)};
		var downSpan = document.createElement('span');
		downSpan.id='downVoteButt';
		downSpan.className='glyphicon glyphicon-thumbs-down';
		downV.appendChild(downSpan);
	
		var score = document.createElement('span');
		score.innerHTML = queue[song].score;

		var upV = document.createElement('button');
		upV.type='button';
		upV.className='btn btn-default';
		upV.onclick= function() {upVote(this.parentNode)};
		var upSpan = document.createElement('span');
		upSpan.id='upVoteButt';
		upSpan.className='glyphicon glyphicon-thumbs-up';
		upV.appendChild(upSpan);

		item.appendChild(downV);
		item.appendChild(score);
		item.appendChild(upV);
		playlistGroup.appendChild(item);
	}

	function songSelect(e) {
		player.loadVideoById(e.id);
	}
	
	function upVote(e)
	{
		var theScore = parseInt(e.childNodes[2].innerHTML)
		theScore++;
		e.childNodes[2].innerHTML = theScore;
		if(theScore >= 5)
		{
			var temp = e;
			var list = e.parentNode;
			list.removeChild(e);
			list.insertBefore(temp,list.childNodes[0]);
			player.loadVideoById(e.id);
		}
	}
	
	function downVote(e)
	{
		var theScore = parseInt(e.childNodes[2].innerHTML)
		theScore--;
		e.childNodes[2].innerHTML = theScore;
		if(theScore <= -5)
		{
			e.parentNode.removeChild(e);
		}
	}

}

//button(type='button',class='btn btn-default',onclick='playPause()')
//      span(id='playPauseButt',class='glyphicon glyphicon-pause', aria-hidden='true')