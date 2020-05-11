import './ui.css'
import 'jquery'
import 'jquery-ui-bundle'

const amplitude = require('amplitude-js');

const version = '1.0.1';
const debug = true;

const placeholders = [
  "Good design is honest…", 
  "Good design is aesthetic…",
  "Good design is unobtrusive…",
  "Good design is long-lasting…",
  "Good design is innovative…",
  "Push it further…", 
  "Too much white space…", 
  "Simplify…", 
  "Play with color…", 
  "Not quite there…",
  "Too noisy…", 
  "Just do it…",
  "Make it work…",
  "1px right…",
  "1px left…",
  "Something is off…",
  "Almost there…",
  "What are our metrics?…",
  "What problem you're solving?…",
  "How it will look on mobile?…",
  "Is this an ab test?…",
  "What are users saying?…",
  "Who are we de signing for?…",
  "Jony Ive approves your design…"
];
let selectPointer = 0;

// Processing input to main search filed
var searchField = <HTMLInputElement>document.getElementById('searchField');
searchField.placeholder = placeholders[Math.ceil(Math.random() * (placeholders.length - 1))];
searchField.focus();
searchField.oninput = () => {
  const searchValue = searchField.value;
  
  let recents = document.getElementById("recents");
  let resultsHeader = document.getElementById("resultsHeader");

  selectPointer = 0;
  
  if (searchValue == "") {
    if (document.getElementById('recentsList').children.length != 0) {
      $(recents).show();
    }
    $(resultsHeader).show();
  }
  else {
    $(recents).hide();
    $(resultsHeader).hide();
  }

  document.getElementById("resultsList").innerHTML = "";

  parent.postMessage({ 
    pluginMessage: { 
      type: 'CHECK', 
      searchValue 
    } 
  }, '*');
}

document.addEventListener('keydown', keyboardInput);
function keyboardInput(key: KeyboardEvent) {
  let keycode = key.keyCode;

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
    key.preventDefault();
    if (selectPointer != 0) {
      let resultsList = document.getElementById('resultsList').children;
      let recentsList = document.getElementById('recentsList').children;
      let recentsLength = recentsList.length;

      selectPointer--;

      if (selectPointer < (recentsLength - 1)) {
        // moving through recents 
        recentsList[selectPointer].setAttribute("class", "resultItemHilight");
        recentsList[selectPointer + 1].setAttribute("class", "resultItem");

        if (selectPointer == 0) {
          $("html, body").stop().animate({scrollTop: 0}, 60);
        }
        else if (!isElementInViewport(recentsList[selectPointer])) {
          let scrollPosition = $(recentsList[selectPointer]).offset().top - 32
          $("html, body").stop().animate({scrollTop: scrollPosition}, 20);
        }

      }
      else if (selectPointer == (recentsLength - 1)) {
        // in the middle between recents and all results
        
        if ($(document.getElementById("recents")).is(":visible")) {
          recentsList[recentsList.length - 1].setAttribute("class", "resultItemHilight");
          resultsList[0].setAttribute("class", "resultItem");
  
          if (!isElementInViewport(recentsList[recentsLength - 1])) {
            let scrollPosition = $(recentsList[recentsLength - 1]).offset().top - 32
            $("html, body").stop().animate({scrollTop: scrollPosition}, 20);
          }  
        }
        else {
          selectPointer++;
        }
      } 
      else {
        // moving through results
        resultsList[selectPointer - recentsLength].setAttribute("class", "resultItemHilight");
        resultsList[selectPointer - recentsLength + 1].setAttribute("class", "resultItem");

        if (!isElementInViewport(resultsList[selectPointer - recentsLength])) {
          let scrollPosition = $(resultsList[selectPointer - recentsLength]).offset().top - 32
          $("html, body").stop().animate({scrollTop: scrollPosition}, 20);
        }
      }
      
    }
  }

  //Key down
  if (keycode == 40) {  
    key.preventDefault();

    let resultsList = document.getElementById('resultsList').children;
    let recentsList = document.getElementById('recentsList').children;
    let recentsLength = recentsList.length;
    let resultsLength = resultsList.length;

    if ((resultsLength + recentsLength - 1) != selectPointer) {
      selectPointer++;

      if (selectPointer < recentsLength) {
        // moving through recents 
        recentsList[selectPointer].setAttribute("class", "resultItemHilight");
        recentsList[selectPointer - 1].setAttribute("class", "resultItem");
      }
      else if (selectPointer == recentsLength) {
        // in the middle between recents <> results
        resultsList[selectPointer - recentsLength].setAttribute("class", "resultItemHilight");
        recentsList[recentsLength - 1].setAttribute("class", "resultItem");
      }
      else {
        // moving through results
        resultsList[selectPointer - recentsLength].setAttribute("class", "resultItemHilight");
        resultsList[selectPointer - recentsLength - 1].setAttribute("class", "resultItem");
                
        if (!isElementInViewport(resultsList[selectPointer - recentsLength])) {
          let scrollPosition = 66 + $(resultsList[selectPointer - recentsLength]).offset().top - window.innerHeight  
          $("html, body").stop().animate({scrollTop: scrollPosition}, 20);
        } 
      }

    }
  }

  //Enter 
  if (keycode == 13) {
    // Simulating click eather in recents or results
    // Based on if recents visible 
    let recentsList = (<HTMLDivElement>document.getElementById('recentsList')).children;
    let resultsList = (<HTMLDivElement>document.getElementById('resultsList')).children;  

    // Initial launch state with recents
    if (selectPointer < recentsList.length) {
      (<HTMLDivElement>recentsList[selectPointer]).click();
    }
    else {
      (<HTMLDivElement>resultsList[selectPointer - recentsList.length]).click();
    }
  }
}

// Functions to update ui from code.ts
window.onmessage = async (event) => {
  if (event.data.pluginMessage.type === 'ANALYTICSID') {
    let documentId = event.data.pluginMessage.documentId;
    if (!debug) {
      amplitude.getInstance().init("0b2d490507691236e7d1cc9734bd1ce4", documentId, {'Version': version});
      amplitude.getInstance().logEvent('launch');
    }
  }

  if (event.data.pluginMessage.type === 'NEWRESULT') {
    //showNewResult(event.data.pluginMessage.node, document.getElementById("resultsList"));
    showNewResult(
      event.data.pluginMessage.node, 
      document.getElementById("resultsList")
    );
  }

  if (event.data.pluginMessage.type === 'NEWMARKEDRESULT') {
    //showNewResult(event.data.pluginMessage.node, document.getElementById("resultsList"));
    showNewMarkedResult(
      event.data.pluginMessage.node, 
      event.data.pluginMessage.part1, 
      event.data.pluginMessage.part2, 
      event.data.pluginMessage.part3, 
      document.getElementById("resultsList")
    );
  }

  if (event.data.pluginMessage.type === 'CLEARRESULTS') {
    document.getElementById("resultsList").innerHTML = "";
  }

  if (event.data.pluginMessage.type === 'NORECENTS') {
    $(document.getElementById("recents")).hide();
  }

  if (event.data.pluginMessage.type === 'RECENT') {
    $(document.getElementById("recents")).show();
    showNewResult(event.data.pluginMessage.node, document.getElementById("recentsList"));
  }

  if (event.data.pluginMessage.type === 'HILIGHTFIRST') {
    let resultsList = document.getElementById('resultsList').children;
    let recentsList = document.getElementById('recentsList').children;

    if ($(document.getElementById("recents")).is(":hidden")) {
      if (resultsList.length != 0) {
        resultsList[0].setAttribute("class", "resultItemHilight");
        selectPointer = recentsList.length;
      }
    }
    else {
      if (recentsList.length != 0) {
        recentsList[0].setAttribute("class", "resultItemHilight");
      }
      else if (resultsList.length != 0) { 
        resultsList[0].setAttribute("class", "resultItemHilight");
      }
    }
  }
} 

// Append new list item to Resuts or Recents divs
function showNewResult(node: { name: string; type: any; id: any; }, list: HTMLElement) {
  let newListItem = document.createElement("div");
  let image = document.createElement("div");
  let text = document.createElement("div");
  
  let title = document.createTextNode(node.name);

  newListItem.setAttribute("class", "resultItem");
  text.setAttribute("class", "resultItemText");
  text.appendChild(title);

  switch (node.type) {
    case "PAGE": image.setAttribute("class", "resultItemImagePage"); break;
    case "TEXT": image.setAttribute("class", "resultItemImageText"); break;
    case "FRAME": image.setAttribute("class", "resultItemImageFrame"); break;
    case "INSTANCE": image.setAttribute("class", "resultItemImageInstance"); break;
    case "COMPONENT": image.setAttribute("class", "resultItemImageComponent"); break;
    case "VECTOR": case "STAR": case "LINE": case "ELLIPSE": case "POLYGON": 
    case "RECTANGLE": image.setAttribute("class", "resultItemImageVector"); break;
    default: image.setAttribute("class", "resultItemImageLayer");
  }
  
  newListItem.appendChild(image);
  newListItem.appendChild(text);

  newListItem.addEventListener("click", function( event ) {   
    console.log(list.id);
    if (!debug) amplitude.getInstance().logEvent('jump', {'source' : list.id});
    parent.postMessage({ 
      pluginMessage: { 
        type: 'JUMP', 
        id: node.id} 
      }, 
      '*');
  }, false);

  list.appendChild(newListItem);
}

// Append new list item to Resuts or Recents divs
function showNewMarkedResult(node: { name: string; type: any; id: any; }, part1: string, part2: string, part3: string, list: HTMLElement) {
  let newListItem = document.createElement("div");
  let image = document.createElement("div");
  let text = document.createElement("div");

  let textPart1 = document.createElement("span");
  let textMarked = document.createElement("span");
  let textPart2 = document.createElement("span");

  textMarked.setAttribute("class", "resultItemTextMark");
  
  let titlePart1 = document.createTextNode(part1);
  let titleMarked = document.createTextNode(part2);
  let titlePart2 = document.createTextNode(part3);
  
  textPart1.appendChild(titlePart1);
  textMarked.appendChild(titleMarked);
  textPart2.appendChild(titlePart2);

  newListItem.setAttribute("class", "resultItem");
  text.setAttribute("class", "resultItemText");
  text.appendChild(textPart1);
  text.appendChild(textMarked);
  text.appendChild(textPart2);

  switch (node.type) {
    case "PAGE": image.setAttribute("class", "resultItemImagePage"); break;
    case "TEXT": image.setAttribute("class", "resultItemImageText"); break;
    case "FRAME": image.setAttribute("class", "resultItemImageFrame"); break;
    case "INSTANCE": image.setAttribute("class", "resultItemImageInstance"); break;
    case "COMPONENT": image.setAttribute("class", "resultItemImageComponent"); break;
    case "VECTOR": case "STAR": case "LINE": case "ELLIPSE": case "POLYGON": 
    case "RECTANGLE": image.setAttribute("class", "resultItemImageVector"); break;
    default: image.setAttribute("class", "resultItemImageLayer");
  }
  
  newListItem.appendChild(image);
  newListItem.appendChild(text);

  newListItem.addEventListener("click", function( event ) {   
    console.log(list.id);
    if (!debug) amplitude.getInstance().logEvent('jump', {'source' : list.id});
    parent.postMessage({ 
      pluginMessage: { 
        type: 'JUMP', 
        id: node.id} 
      }, 
      '*');
  }, false);

  list.appendChild(newListItem);
}


function isElementInViewport(element: Element) {
  let rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document. documentElement.clientWidth)
  );
}

//

let recentsClear = <HTMLDivElement>document.getElementById('recentsClear');
recentsClear.addEventListener("click", function () {
  parent.postMessage({ 
    pluginMessage: { 
      type: 'CLEARRECENTS', 
      } 
    }, 
    '*');
});

// FAB UI

let helpFab = document.getElementById("helpFab");
let help = document.getElementById("help");

const fabHeight = 182;
const fabWidth = 175;

$(help).animate({
  width: (fabWidth - 15),
  height: (fabHeight - 15),
  opacity: 0,
}, 0);

$(help).hide();

helpFab.addEventListener("click", function(event) {   
  $(help).show();
  $(help).animate({
    width: fabWidth,
    height: fabHeight,
    opacity: 1,
    bottom: 15,
  }, 200, 'easeOutBack');
}, false);

help.addEventListener("mouseleave", function(event) { 
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