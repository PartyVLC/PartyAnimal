function togglePlaylists()
{
    var playlistContainer = document.getElementById("listContainer");
    var icon = document.getElementById("plshIcon");
    if(playlistContainer.offsetHeight > 0)
    {
        playlistContainer.style.height = 0;
        icon.className = 'glyphicon glyphicon-eye-close';
    }
    else
    {
        playlistContainer.style.height = "256px";
        icon.className = 'glyphicon glyphicon-eye-open';
    }
}