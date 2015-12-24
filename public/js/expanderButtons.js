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

function betterExpand(expanded, fadedOut, fadedIn, fromWidth, fromHeight, toWidth, toHeight){
    var elemExpand = document.getElementById(expanded);
    var elemFadeOut = document.getElementById(fadedOut);
    var elemFadeIn = document.getElementById(fadedIn);
    
    elemWidth = elemExpand.offsetWidth;
    elemHeight = elemExpand.offsetHeight;
    
    if(elemWidth == fromWidth && elemHeight == fromHeight)
    {
        elemExpand.style.width = toWidth + "px";
        elemExpand.style.height = toHeight + "px";
        elemFadeIn.style.opacity = 1;
        elemFadeOut.style.opacity = 0;
    }
    else
    {
        elemExpand.style.width = fromWidth + "px";
        elemExpand.style.height = fromHeight + "px";
        elemFadeIn.style.opacity = 0;
        elemFadeOut.style.opacity = 1;
    }
}