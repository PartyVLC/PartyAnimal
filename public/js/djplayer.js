function showSidebar()
{
  sidebar = document.getElementById("sidebar");
  sidebartoggle = document.getElementById("sidebartoggle");
  sidebarshadow = document.getElementById("sidebarshadow");
  sidebar.style.right = 0;
  sidebarshadow.style.right = 0;
  sidebartoggle.style.right = "25%";
  sidebartoggle.onclick = function() { hideSidebar() };
}

function hideSidebar()
{
  shrinkSidebar();
  showMainMenu();
  hidePlaylistMenu();
  hideSearchMenu();
  sidebar = document.getElementById("sidebar");
  sidebartoggle = document.getElementById("sidebartoggle");
  sidebarshadow = document.getElementById("sidebarshadow");
  sidebar.style.right = "-25%";
  sidebarshadow.style.right = "-25%";
  sidebartoggle.style.right = 0;
  sidebartoggle.onclick = function() { showSidebar() };
}

function expandSidebar()
{
  sidebar = document.getElementById("sidebar");
  sidebartoggle = document.getElementById("sidebartoggle");
  sidebarshadow = document.getElementById("sidebarshadow");
  sidebar.style.width = "50%";
  sidebarshadow.style.width = "50%";
  sidebartoggle.style.right = "50%";
}

function shrinkSidebar()
{
  sidebar = document.getElementById("sidebar");
  sidebartoggle = document.getElementById("sidebartoggle");
  sidebarshadow = document.getElementById("sidebarshadow");
  sidebar.style.width = "25%";
  sidebarshadow.style.width = "25%";
  sidebartoggle.style.right = "25%";
}

function showMainMenu()
{
  sidebarmainmenu = document.getElementById("sidebarmainmenu");
  sidebarmainmenu.style.left = 0;
}

function hideMainMenu()
{
  sidebarmainmenu = document.getElementById("sidebarmainmenu");
  sidebarmainmenu.style.left = "-100%";
}

function showPlaylistMenu()
{
  sidebarplaylistmenu = document.getElementById("sidebarplaylistmenu");
  sidebarplaylistmenu.style.left = 0;
}

function showPlaylistsMenu()
{
  sidebarplaylistmenu = document.getElementById("sidebarplaylistsmenu");
  sidebarplaylistmenu.style.left = 0;
}

function hidePlaylistMenu()
{
  sidebarplaylistmenu = document.getElementById("sidebarplaylistmenu");
  sidebarplaylistmenu.style.left = "100%";
}

function hidePlaylistsMenu()
{
  sidebarplaylistmenu = document.getElementById("sidebarplaylistsmenu");
  sidebarplaylistmenu.style.left = "100%";
}

function showSearchMenu()
{
  sidebarsearchmenu = document.getElementById("sidebarsearchmenu");
  sidebarsearchmenu.style.left = 0;
}

function hideSearchMenu()
{
  sidebarsearchmenu = document.getElementById("sidebarsearchmenu");
  sidebarsearchmenu.style.left = "100%";
}

function clickPlaylist()
{
  expandSidebar();
  hideMainMenu();
  showPlaylistMenu();
}

function clickPlaylists()
{
  expandSidebar();
  hideMainMenu();
  showPlaylistsMenu();
}

function clickSearch()
{
  expandSidebar();
  hideMainMenu();
  showSearchMenu();
}

function clickBack()
{
  shrinkSidebar();
  showMainMenu();
  hidePlaylistMenu();
  hidePlaylistsMenu();
  hideSearchMenu();
}