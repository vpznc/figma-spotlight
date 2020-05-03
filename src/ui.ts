import './ui.css'
import 'jquery'

//document.onkeyup = PresTab;
var selectPointer = 0; 

document.addEventListener('keydown', keyboardInput);

function keyboardInput(key: KeyboardEvent) {
    var keycode = key.keyCode;
    if (keycode == 16) {
        key.preventDefault();
    }
    if (keycode == 27) {
        parent.postMessage({ pluginMessage: { 
          type: 'CLOSE' 
        } 
      }, '*')
    }

    if (keycode == 38) {
      parent.postMessage({ 
        pluginMessage: { 
          type: 'UP' 
        } 
      }, '*')

      
      if (selectPointer != 0) {
        var r = document.getElementById('resultsList').children;
        
        r[selectPointer].setAttribute("class", "resultItem");
        r[selectPointer-1].setAttribute("class", "resultItemHilight");

        selectPointer--;

        if (!isElementInViewport(r[selectPointer])) {
          let scrollPosition = $(r[selectPointer]).offset().top - 12
          $("html, body").stop().animate({scrollTop: scrollPosition}, 20);
        }
      }
    }

    if (keycode == 40) {
      parent.postMessage({ 
        pluginMessage: { 
          type: 'DOWN' 
        } 
      }, '*')
    
      var r = document.getElementById('resultsList').children;

      if ((r.length - 1) != selectPointer) {
      
        r[selectPointer].setAttribute("class", "resultItem");
        r[selectPointer+1].setAttribute("class", "resultItemHilight");
        
        selectPointer++;
        
        if (!isElementInViewport(r[selectPointer])) {
          let scrollPosition = 48 + $(r[selectPointer]).offset().top - window.innerHeight  
          $("html, body").stop().animate({scrollTop: scrollPosition}, 20);
        }
      }
    }

    if (keycode == 13) {
      (<HTMLInputElement>document.getElementById('resultsList').children[selectPointer]).click();
    }
}

var recents = document.getElementById("recents");
var resultsHeader = document.getElementById("resultsHeader");

document.getElementById('searchField').focus();
document.getElementById('searchField').oninput = () => {
  //console.log("aa");
  selectPointer = 0;
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

    clearResultsUI();
    
    parent.postMessage({ 
      pluginMessage: { 
        type: 'CHECK', 
        searchValue 
      } 
    }, '*');

  }
}

// functions to update ui from code.ts
window.onmessage = async (event) => {
  if (event.data.pluginMessage.type === 'NEWRESULT') {
    let name = event.data.pluginMessage.name;
    let id = event.data.pluginMessage.id;
    let nodeType = event.data.pluginMessage.nodeType;
    showNewResultUI(name, id, nodeType, true);
  }

  if (event.data.pluginMessage.type === 'RECENT') {
    let name = event.data.pluginMessage.name;
    let id =  event.data.pluginMessage.id;
    let nodeType = event.data.pluginMessage.nodeType;
    showNewResultUI(name, id, nodeType, false);
  }

  if (event.data.pluginMessage.type === 'HILIGHTFIRST') {
    var r = document.getElementById('resultsList').children;
    if (r.length != 0) r[0].setAttribute("class", "resultItemHilight");
  }
} 

// show new result list item
function showNewResultUI(name, id, nodeType, newResult) {
  var newListItem = document.createElement("div");
  var image = document.createElement("div");
  var text = document.createElement("div");
  var title = document.createTextNode(name);

  newListItem.setAttribute("class", "resultItem");
  text.appendChild(title);

  image.setAttribute("class", "resultItemImageLayer");
  if (nodeType === "PAGE") image.setAttribute("class", "resultItemImagePage");
  if (nodeType === "FRAME") image.setAttribute("class", "resultItemImageFrame");
  if (nodeType === "COMPONENT") image.setAttribute("class", "resultItemImageComponent");
  
  newListItem.appendChild(image);
  newListItem.appendChild(text);
  
  newListItem.addEventListener("click", function( event ) {   
    document.getElementById('searchField').focus();
    parent.postMessage({ 
      pluginMessage: { 
        type: 'JUMP', 
        id } 
      }, 
      '*');
  }, false);

  if (newResult) {
    document.getElementById("resultsList").appendChild(newListItem);
  }
  else {
    document.getElementById("recentsList").appendChild(newListItem);
  }
}

// clear results by removing all child from this div
function clearResultsUI() {
  const list = document.getElementById("resultsList");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
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

$(help).animate({
  width: (175 - 15),
  height: (229 - 15),
  opacity: 0,
}, 0);

$(help).hide();

helpFab.addEventListener("click", function( event ) {   
  $(help).show();
  $(help).animate({
    width: 175,
    height: 229,
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
    width: (175 - 5),
    height: (229 - 5),
    opacity: 0,
    bottom: 10,
  }, 
  30, 
  function() {
    $(help).hide();
    $(help).animate({
      width: (175 - 15),
      height: (229 - 15),
      opacity: 0,
      bottom: 10,
    }, 
    30);
  });

}, false);