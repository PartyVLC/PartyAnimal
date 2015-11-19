function expand(expanded, fadedOut, fadedIn, toWidth, toHeight)
{
    var elemExpand = document.getElementById(expanded);
    var elemFadeOut = document.getElementById(fadedOut);
    var elemFadeIn = document.getElementById(fadedIn);
    
    fromWidth = elemExpand.offsetWidth;
    fromHeight = elemExpand.offsetHeight;
    
    elemExpand.style.width = toWidth + "px";
    elemExpand.style.height = toHeight + "px";
    
    elemExpand.onclick = function() {expand(expanded, fadedIn, fadedOut, fromWidth, fromHeight);};
    
    
    elemFadeIn.style.opacity = 1;
    elemFadeOut.style.opacity = 0;
}