function showSidebar()
{
  var sidebar = document.getElementById("sidebar");
  var sidebartoggle = document.getElementById("sidebartoggle");
  var sidebartoggleicon = document.getElementById("sidebartoggleicon");
  var sidebarshadow = document.getElementById("sidebarshadow");
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
  hideFind();
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
  clearSearch();
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
  var sidebarmainmenu = document.getElementById("sidebarmainmenu");
  if(sidebarmainmenu != null)
  {
    sidebarmainmenu.style.left = 0;
  }
}

function hideMainMenu()
{
  var sidebarmainmenu = document.getElementById("sidebarmainmenu");
  if(sidebarmainmenu != null)
  {
    sidebarmainmenu.style.left = "-100%";
  }
}

function showPlaylistMenu()
{
  var sidebarplaylistmenu = document.getElementById("sidebarcurrentplaylist");
  if(sidebarplaylistmenu != null)
  {
    sidebarplaylistmenu.style.left = 0;
  }
}
function hidePlaylistMenu()
{
  var sidebarplaylistmenu = document.getElementById("sidebarcurrentplaylist");
  if(sidebarplaylistmenu != null)
  {
    sidebarplaylistmenu.style.left = "100%";
  }
}
function showSearchMenu()
{
  var sidebarsearchmenu = document.getElementById("sidebarsearchmenu");
  if(sidebarsearchmenu != null)
  {
    sidebarsearchmenu.style.left = 0;
  }
}
function hideSearchMenu()
{
  var sidebarsearchmenu = document.getElementById("sidebarsearchmenu");
  if(sidebarsearchmenu != null)
  {
    sidebarsearchmenu.style.left = "100%";
  }
}
function showPlaylistManager()
{
  var sidebarplaylistmanager = document.getElementById("sidebarplaylistmanager");
  if(sidebarplaylistmanager != null)
  {
    sidebarplaylistmanager.style.left = 0;
  }
}
function hidePlaylistManager()
{
  var sidebarplaylsitmanager = document.getElementById("sidebarplaylistmanager");
  if(sidebarplaylsitmanager !== null)
  {
    sidebarplaylistmanager.style.left = "100%";
  }
}
function showLogin()
{
  var sidebarlogin = document.getElementById("sidebarlogin");
  if(sidebarlogin != null)
  {
    sidebarlogin.style.left = 0;
  }
}
function hideLogin()
{
  var sidebarlogin = document.getElementById("sidebarlogin");
  if(sidebarlogin != null)
  {
    sidebarlogin.style.left = "100%";
  }
}
function showFind()
{
  sidebarfindparty = document.getElementById("sidebarfindparty");
  if(sidebarfindparty != null)
  {
    sidebarfindparty.style.left = 0;
  }
  form = document.getElementById("form");
  if(form != null)
  {
    form.style.left = "100%";
  }
}
function hideFind()
{
  sidebarfindparty = document.getElementById("sidebarfindparty");
  if(sidebarfindparty != null)
  {
    sidebarfindparty.style.left = "100%";
  }
  form = document.getElementById("form");
  if(form != null)
  {
    form.style.display = 'none';
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
function clickFind()
{
  hideMainMenu();
  showFind();
}
function clickBack()
{
  shrinkSidebar();
  showMainMenu();
  hidePlaylistMenu();
  hideSearchMenu();
  hidePlaylistManager();
  hideFind();
  hideLogin();
  clearSearch();
}