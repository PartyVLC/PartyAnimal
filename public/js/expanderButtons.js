function expand(expanded, fadedOut, fadedIn)
{
    var elemExpand = document.getElementById(expanded);
    var elemFadeOut = document.getElementById(fadedOut);
    var elemFadeIn = document.getElementById(fadedIn);
    
    console.log("expand");
    elemExpand.className = "addButtonExp";
    elemFadeOut.className = "fadeOut";
    elemFadeIn.className = "fadeIn";
    elemExpand.onclick = function() {contract(expanded, fadedOut, fadedIn);};
}

function contract(contracted, fadedIn, fadedOut)
{
    var elemContract = document.getElementById(contracted);
    var elemFadeIn = document.getElementById(fadedIn);
    var elemFadeOut = document.getElementById(fadedOut);
    
    console.log("contract");
    elemContract.className = "addButtonCon";
    elemFadeIn.className = "fadeIn";
    elemFadeOut.className = "fadeOut";
    elemContract.onclick = function() {expand(contracted, fadedIn, fadedOut);};
}