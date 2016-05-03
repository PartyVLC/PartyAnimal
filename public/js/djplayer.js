function showSidebar()
{
  sidebar = document.getElementById("sidebar");
  sidebartoggle = document.getElementById("sidebartoggle");
  sidebartoggleicon = document.getElementById("sidebartoggleicon");
  sidebarshadow = document.getElementById("sidebarshadow");
  sidebar.style.right = 0;
  sidebarshadow.style.right = 0;
  sidebartoggle.style.right = "50%";
  sidebartoggle.onclick = function() { hideSidebar() };
  sidebartoggleicon.style.transform = "rotate(180deg)";
}

function hideSidebar()
{
  shrinkSidebar();
  showMainMenu();
  hidePlaylistMenu();
  hideSearchMenu();
  hidePlaylistManager();
  hideLogin();
  var sidebar = document.getElementById("sidebar");
  var sidebartoggle = document.getElementById("sidebartoggle");
  var sidebartoggleicon = document.getElementById("sidebartoggleicon");
  var sidebarshadow = document.getElementById("sidebarshadow");
  sidebar.style.right = "-50%";
  sidebarshadow.style.right = "-50%";
  sidebartoggle.style.right = 0;
  sidebartoggle.onclick = function() { showSidebar() };
  sidebartoggleicon.style.transform = "rotate(0)";
}

function expandSidebar()
{
  var sidebar = document.getElementById("sidebar");
  var sidebartoggle = document.getElementById("sidebartoggle");
  var sidebarshadow = document.getElementById("sidebarshadow");
  sidebar.style.width = "75%";
  sidebarshadow.style.width = "75%";
  sidebartoggle.style.right = "75%";
}

function shrinkSidebar()
{
  var sidebar = document.getElementById("sidebar");
  var sidebartoggle = document.getElementById("sidebartoggle");
  var sidebarshadow = document.getElementById("sidebarshadow");
  sidebar.style.width = "50%";
  sidebarshadow.style.width = "50%";
  sidebartoggle.style.right = "50%";
}

function showMainMenu()
{
  sidebarmainmenu = document.getElementById("sidebarmainmenu");
  if(sidebarmainmenu != null)
  {
    sidebarmainmenu.style.left = 0;
  }
}

function hideMainMenu()
{
  sidebarmainmenu = document.getElementById("sidebarmainmenu");
  if(sidebarmainmenu != null)
  {
    sidebarmainmenu.style.left = "-100%";
  }
}

function showPlaylistMenu()
{
  sidebarplaylistmenu = document.getElementById("sidebarcurrentplaylist");
  if(sidebarplaylistmenu != null)
  {
    sidebarplaylistmenu.style.left = 0;
  }
}
function hidePlaylistMenu()
{
  sidebarplaylistmenu = document.getElementById("sidebarcurrentplaylist");
  if(sidebarplaylistmenu != null)
  {
    sidebarplaylistmenu.style.left = "100%";
  }
}
function showSearchMenu()
{
  sidebarsearchmenu = document.getElementById("sidebarsearchmenu");
  if(sidebarsearchmenu != null)
  {
    sidebarsearchmenu.style.left = 0;
  }
}
function hideSearchMenu()
{
  sidebarsearchmenu = document.getElementById("sidebarsearchmenu");
  if(sidebarsearchmenu != null)
  {
    sidebarsearchmenu.style.left = "100%";
  }
}
function showPlaylistManager()
{
  sidebarplaylistmanager = document.getElementById("sidebarplaylistmanager");
  if(sidebarplaylistmanager != null)
  {
    sidebarplaylistmanager.style.left = 0;
  }
}
function hidePlaylistManager()
{
  sidebarplaylsitmanager = document.getElementById("sidebarplaylistmanager");
  if(sidebarplaylistmanager != null)
  {
    sidebarplaylistmanager.style.left = "100%";
  }
}
function showLogin()
{
  sidebarlogin = document.getElementById("sidebarlogin");
  if(sidebarlogin != null)
  {
    sidebarlogin.style.left = 0;
  }
}
function hideLogin()
{
  sidebarlogin = document.getElementById("sidebarlogin");
  if(sidebarlogin != null)
  {
    sidebarlogin.style.left = "100%";
  }
}
function clickPlaylist()
{
  expandSidebar();
  hideMainMenu();
  showPlaylistMenu();
}
function clickSearch()
{
  expandSidebar();
  hideMainMenu();
  showSearchMenu();
}
function clickPlaylistManager()
{
  expandSidebar();
  hideMainMenu();
  showPlaylistManager();
}
function clickLogin()
{
  expandSidebar();
  hideMainMenu();
  showLogin();
}
function clickBack()
{
  shrinkSidebar();
  showMainMenu();
  hidePlaylistMenu();
  hideSearchMenu();
  hidePlaylistManager();
  hideLogin();
}