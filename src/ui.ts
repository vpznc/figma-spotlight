import './ui.css'
import 'jquery'

var selectPointer = 0;

document.addEventListener('keydown', keyboardInput);
function keyboardInput(key: KeyboardEvent) {
  var keycode = key.keyCode;

  //Key tab
  if (keycode == 16) {
      key.preventDefault();
  }

  //Key escape
  if (keycode == 27) {
      parent.postMessage({ pluginMessage: { 
        type: 'CLOSE' 
      } 
    }, '*')
  }

  //Key up
  if (keycode == 38) {
    if (selectPointer != 0) {
      selectPointer--;

      var results = document.getElementById('resultsList').children;
      var recents = document.getElementById('recentsList').children;

      if (selectPointer < (recents.length - 1)) {
        // moving through recents 
        recents[selectPointer].setAttribute("class", "resultItemHilight");
        recents[selectPointer + 1].setAttribute("class", "resultItem");

        if (!isElementInViewport(recents[selectPointer])) {
          let scrollPosition = $(recents[selectPointer]).offset().top - 32
          $("html, body").stop().animate({scrollTop: scrollPosition}, 20);
        }

        if (selectPointer == 0) {
          $("html, body").stop().animate({scrollTop: 0}, 20);
        }

      }
      else if (selectPointer == (recents.length - 1)) {
        // in the middle between recents and all results
        
        if ($(document.getElementById("recents")).is(":visible")) {
          recents[recents.length - 1].setAttribute("class", "resultItemHilight");
          results[0].setAttribute("class", "resultItem");
  
          if (!isElementInViewport(recents[recents.length - 1])) {
            let scrollPosition = $(recents[recents.length - 1]).offset().top - 32
            $("html, body").stop().animate({scrollTop: scrollPosition}, 20);
          }  
        }
        else {
          selectPointer++;
        }
      } 
      else {
        // moving through results
        results[selectPointer - recents.length].setAttribute("class", "resultItemHilight");
        results[selectPointer - recents.length + 1].setAttribute("class", "resultItem");

        if (!isElementInViewport(results[selectPointer - recents.length])) {
          let scrollPosition = $(results[selectPointer - recents.length]).offset().top - 32
          $("html, body").stop().animate({scrollTop: scrollPosition}, 20);
        }

      }
    }
  }

  //Key down
  if (keycode == 40) {  
    var results = document.getElementById('resultsList').children;
    var recents = document.getElementById('recentsList').children;

    if ((results.length + recents.length - 1) != selectPointer) {
      selectPointer++;

      if (selectPointer < recents.length) {
        // moving through recents 
        recents[selectPointer].setAttribute("class", "resultItemHilight");
        recents[selectPointer - 1].setAttribute("class", "resultItem");
      }
      else if (selectPointer == recents.length) {
        // in the middle between recents <> results
        results[selectPointer - recents.length].setAttribute("class", "resultItemHilight");
        recents[recents.length - 1].setAttribute("class", "resultItem");
      }
      else {
        // moving through results
        results[selectPointer - recents.length].setAttribute("class", "resultItemHilight");
        results[selectPointer - recents.length - 1].setAttribute("class", "resultItem");
                
        if (!isElementInViewport(results[selectPointer - recents.length])) {
          let scrollPosition = 66 + $(results[selectPointer - recents.length]).offset().top - window.innerHeight  
          $("html, body").stop().animate({scrollTop: scrollPosition}, 20);
        } 
      }

    }
  }

  //Enter 
  if (keycode == 13) {
    var recents = document.getElementById('recentsList').children;  

    // Based if recents visible simulating click eather in recents or results
    if ($(document.getElementById("recents")).is(":hidden")) { 
      // Search results
      var jumpListItemNumber = selectPointer - recents.length;
      (<HTMLInputElement>document.getElementById('resultsList').children[jumpListItemNumber]).click();
    }
    else {
      //Default launch state
      if (selectPointer < recents.length) {
        (<HTMLInputElement>document.getElementById('recentsList').children[selectPointer]).click();
      }
      else {
        (<HTMLInputElement>document.getElementById('resultsList').children[selectPointer - recents.length]).click();
      }
    }
  }
}

// Processing input to main search filed
document.getElementById('searchField').focus();
document.getElementById('searchField').oninput = () => {
  selectPointer = 0;
  var recents = document.getElementById("recents");
  var resultsHeader = document.getElementById("resultsHeader");

  const searchValue = (<HTMLInputElement>document.getElementById('searchField')).value;
  if (searchValue == "") {
    $(recents).show();
    $(resultsHeader).show();

    parent.postMessage({ 
      pluginMessage: { 
        type: 'CLEAR' 
      } 
    }, '*');
  }
  else {
    $(recents).hide();
    $(resultsHeader).hide();
    resultsHeader.innerHTML = "Last search";

    document.getElementById("resultsList").innerHTML = "";
    
    parent.postMessage({ 
      pluginMessage: { 
        type: 'CHECK', 
        searchValue 
      } 
    }, '*');
  }
}

// Functions to update ui from code.ts
window.onmessage = async (event) => {
  if (event.data.pluginMessage.type === 'NEWRESULT') {
    showNewResultUI(event.data.pluginMessage.node, true);
  }

  if (event.data.pluginMessage.type === 'NORECENTS') {
    $(document.getElementById("recents")).hide();
  }

  if (event.data.pluginMessage.type === 'RECENT') {
    $(document.getElementById("recents")).show();
    showNewResultUI(event.data.pluginMessage.node, false);
  }

  if (event.data.pluginMessage.type === 'HILIGHTFIRST') {
    var results = document.getElementById('resultsList').children;
    var recents = document.getElementById('recentsList').children;

    if ($(document.getElementById("recents")).is(":hidden")) {
      if (results.length != 0) {
        results[0].setAttribute("class", "resultItemHilight");
        selectPointer = recents.length;
      }
    }
    else {
      if (recents.length != 0) {
        recents[0].setAttribute("class", "resultItemHilight");
      }
      else if (results.length != 0) { 
        results[0].setAttribute("class", "resultItemHilight");
      }
    }
  }
} 

// Append new list item to Resuts or Recents divs
function showNewResultUI(node, newResult) {
  var newListItem = document.createElement("div");
  var image = document.createElement("div");
  var text = document.createElement("div");
  var title = document.createTextNode(node.name);

  newListItem.setAttribute("class", "resultItem");
  text.setAttribute("class", "resultItemText");
  text.appendChild(title);

  image.setAttribute("class", "resultItemImageLayer");
  if (node.type === "PAGE") image.setAttribute("class", "resultItemImagePage");
  else if (node.type === "FRAME") image.setAttribute("class", "resultItemImageFrame");
  else if (node.type === "COMPONENT") image.setAttribute("class", "resultItemImageComponent");
  else if (node.type === "TEXT") image.setAttribute("class", "resultItemImageText");
  else if (node.type === "INSTANCE") image.setAttribute("class", "resultItemImageInstance"); 
  else if (node.type === "VECTOR" || node.type === "STAR" || node.type === "LINE" || node.type === "ELLIPSE" || node.type === "POLYGON"|| node.type === "RECTANGLE") image.setAttribute("class", "resultItemImageVector"); 
  
  newListItem.appendChild(image);
  newListItem.appendChild(text);

  newListItem.addEventListener("click", function( event ) {   
    document.getElementById("recentsList").innerHTML = "";
    document.getElementById('searchField').focus();
    
    parent.postMessage({ 
      pluginMessage: { 
        type: 'JUMP', 
        id: node.id} 
      }, 
      '*');
  }, false);

  if (newResult) document.getElementById("resultsList").appendChild(newListItem);
  else document.getElementById("recentsList").appendChild(newListItem);
}

function isElementInViewport(element) {
  var rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document. documentElement.clientWidth)
  );
}

//FAB UI

let helpFab = document.getElementById("helpFab");
let help = document.getElementById("help");

let fabHeight = 182;
let fabWidth = 175;

$(help).animate({
  width: (fabWidth - 15),
  height: (fabHeight - 15),
  opacity: 0,
}, 0);

$(help).hide();

helpFab.addEventListener("click", function( event ) {   
  $(help).show();
  $(help).animate({
    width: fabWidth,
    height: fabHeight,
    opacity: 1,
    bottom: 15,
  }, 120);
    //}, 200, 'easeOutBack');

}, false);

help.addEventListener("mouseleave", function( event ) { 
  var fieled = document.getElementById('searchBox');
  
  if (isElementInViewport(fieled)) { 
    document.getElementById('searchField').focus(); 
  }
  $(help).animate({
    width: (fabWidth - 5),
    height: (fabHeight - 5),
    opacity: 0,
    bottom: 10,
  }, 
  30, 
  function() {
    $(help).hide();
    $(help).animate({
      width: (fabWidth - 15),
      height: (fabHeight - 15),
      opacity: 0,
      bottom: 10,
    }, 
    30);
  });

}, false);