function showSidebar()
{
  sidebar = document.getElementById("sidebar");
  sidebartoggle = document.getElementById("sidebartoggle");
  sidebartoggleicon = document.getElementById("sidebartoggleicon");
  sidebarshadow = document.getElementById("sidebarshadow");
  sidebar.style.right = 0;
  sidebarshadow.style.right = 0;
  sidebartoggle.style.right = "25%";
  sidebartoggle.onclick = function() { hideSidebar() };
  sidebartoggleicon.style.transform = "rotate(180deg)";
}

function hideSidebar()
{
  shrinkSidebar();
  showMainMenu();
  hidePlaylistMenu();
  hidePlaylistsMenu();
  hideSearchMenu();
  sidebar = document.getElementById("sidebar");
  sidebartoggle = document.getElementById("sidebartoggle");
  sidebartoggleicon = document.getElementById("sidebartoggleicon");
  sidebarshadow = document.getElementById("sidebarshadow");
  sidebar.style.right = "-25%";
  sidebarshadow.style.right = "-25%";
  sidebartoggle.style.right = 0;
  sidebartoggle.onclick = function() { showSidebar() };
  sidebartoggleicon.style.transform = "rotate(0)";
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
  sidebarplaylistsmenu = document.getElementById("sidebarplaylistsmenu");
  sidebarplaylistsmenu.style.left = 0;
}

function hidePlaylistMenu()
{
  sidebarplaylistmenu = document.getElementById("sidebarplaylistmenu");
  sidebarplaylistmenu.style.left = "100%";
}

function hidePlaylistsMenu()
{
  sidebarplaylistsmenu = document.getElementById("sidebarplaylistsmenu");
  sidebarplaylistsmenu.style.left = "100%";
}

function showSearchMenu()
{
  sidebarsearchmenu = document.getElementById("sidebarsearchmenu");
  sidebarsearchmenu.style.left = 0;
  clearSearch();
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