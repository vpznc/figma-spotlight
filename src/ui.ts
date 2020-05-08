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
          let scrollPosition = $(recents[selectPointer]).offset().top - 12
          $("html, body").stop().animate({scrollTop: scrollPosition}, 20);
        }

      }
      else if (selectPointer == (recents.length - 1)) {
        // in the middle 
        
        if ($(document.getElementById("recents")).is(":visible")) {
          console.log("Imhere");
          
          recents[recents.length - 1].setAttribute("class", "resultItemHilight");
          results[0].setAttribute("class", "resultItem");
  
          if (!isElementInViewport(recents[recents.length - 1])) {
            let scrollPosition = $(recents[recents.length - 1]).offset().top - 12
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
          let scrollPosition = $(results[selectPointer - recents.length]).offset().top - 12
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
          let scrollPosition = 48 + $(results[selectPointer - recents.length]).offset().top - window.innerHeight  
          $("html, body").stop().animate({scrollTop: scrollPosition}, 20);
        } 
      }

    }
  }

  if (keycode == 13) {
    var recents = document.getElementById('recentsList').children;  

    if ($(document.getElementById("recents")).is(":hidden")) { 
      var jumpListItemNumber = selectPointer - recents.length;
      (<HTMLInputElement>document.getElementById('resultsList').children[jumpListItemNumber]).click();
    }
    else {
      if (selectPointer < recents.length) {
        (<HTMLInputElement>document.getElementById('recentsList').children[selectPointer]).click();
      }
      else {
        (<HTMLInputElement>document.getElementById('resultsList').children[selectPointer - recents.length]).click();
      }
    }
  }
}

// processing input to main search filed
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

// functions to update ui from code.ts
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

    /*
    var recentsList = document.getElementById('recentsList').children;
    var resultsList = document.getElementById('resultsList').children;

    resultsList[0].setAttribute("class", "resultItemHilight");
    selectPointer = recentsList.length - 1;
    */
  }
} 

// show new result list item
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
  if (node.type === "FRAME") image.setAttribute("class", "resultItemImageFrame");
  if (node.type === "COMPONENT") image.setAttribute("class", "resultItemImageComponent");
  if (node.type === "TEXT") image.setAttribute("class", "resultItemImageText");
  if (node.type === "INSTANCE") image.setAttribute("class", "resultItemImageInstance"); 
  if (node.type === "VECTOR" || node.type === "STAR" || node.type === "LINE" || node.type === "ELLIPSE" || node.type === "POLYGON"|| node.type === "RECTANGLE") image.setAttribute("class", "resultItemImageVector"); 
  
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