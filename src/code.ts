let maxRecentsCount = 5;

figma.showUI(__html__, { width: 320, height: 380});

//find specific page and save results to results array
//topFrames - all layers in file
const topFrames = figma.root.children 
.map(page => //The map() method creates a new array populated with the results of calling a provided function on every element in the calling array
  //creating new array and calling the following function on each element of the array
  page.type === "PAGE" //checking if node type is page
    ? page.children.map(frame => ({ // if so, mapping it's children, adding id, name, type, page of each element to the array
        id: frame.id,
        name: frame.name,
        type: frame.type,
        //page: page.name
      }))
    : null
)
.reduce((accumulatedArray, currentArray) => { 
    return accumulatedArray.concat(currentArray);
  }, []); 
//1. going through each node array 
//2. merging it with already merged arrays that are stored in 

//The reduce() method executes a reducer - function that you provide on each element of the array, resulting in a single output value
//The concat() method is used to merge two or more arrays

const pages = figma.root.children.map(page => ({
  id: page.id,
  name: page.name,
  type: page.type
}));

pages.forEach(element => {
  figma.ui.postMessage({ 
    type: 'NEWRESULT', 
    node: element
  });
});

topFrames.forEach(element => {
  figma.ui.postMessage({ 
    type: 'NEWRESULT', 
    node: element
  });
});

outputRecents();

if ((topFrames.length + pages.length) > 0) {
  figma.ui.postMessage({type: 'HILIGHTFIRST'});
}

// End of setting everything plugin need to have on launch
// Start of processing callbacks from the ui.ts

figma.ui.onmessage = message => {
  if (message.type === 'CLOSE') {
    figma.closePlugin();
  }

  if (message.type === 'CHECK') {

    for (const element of pages) {
      const seachNodeName = message.searchValue.toLowerCase();
      const nodeName = element.name.toLowerCase();

      if (nodeName.includes(seachNodeName)) {
        figma.ui.postMessage({ type: 'NEWRESULT', 
          node: element
        });
        
      }    
    }

    for (const element of topFrames) {
      const seachNodeName = message.searchValue.toLowerCase();
      const nodeName = element.name.toLowerCase();

      if (nodeName.includes(seachNodeName)) {
        figma.ui.postMessage({ type: 'NEWRESULT', 
          node: element
        });
        
      }    
    }

    figma.ui.postMessage({type: 'HILIGHTFIRST'});
  }

  if (message.type === "JUMP") {
    const nodeId = message.id;
    const node = figma.getNodeById(nodeId);

    // Change Page
    if (node.parent.type === "PAGE") {
      figma.currentPage = node.parent;
    }

    // Select the Node
    if (node.type !== "DOCUMENT" && node.type !== "PAGE") {
      figma.currentPage.selection = [node];
      figma.viewport.scrollAndZoomIntoView([node]);
    }

    // If Page
    if (node.type === "PAGE") {
      figma.currentPage = node;
    }

    // Recents mechanic 
    // Checking if node is already in recents

    var nodeIsRecents = false;
    var nodeRecentsPosition = 0;

    for (nodeRecentsPosition = maxRecentsCount; nodeRecentsPosition >= 0; nodeRecentsPosition--) {
      var recents = figma.root.getPluginData("recents" + nodeRecentsPosition);
      if (recents == nodeId) {
        nodeIsRecents = true;
        break;
      }
    }

    var moveStart = maxRecentsCount;
    
    // If page is in alreadt in recents - moving it up
    if (nodeIsRecents) {
      moveStart = nodeRecentsPosition - 1;
    }

    for (var counter = moveStart; counter >= 0; counter--) {
      var recents = figma.root.getPluginData("recents" + counter);
      
      if (recents != "") {
        figma.root.setPluginData("recents" + (counter + 1), recents);
      }
    }
    figma.root.setPluginData("recents1", nodeId);
    
    outputRecents();

    //figma.closePlugin();
  }
}

function outputRecents() {
  var localCounter = 0;

  for (var counter = 1; counter <= maxRecentsCount; counter++) {
    var recent = figma.root.getPluginData("recents" + counter);

    if (recent != "") {
      localCounter++;
      var recentNode = figma.getNodeById(recent);  
      figma.ui.postMessage({ 
        type: 'RECENT', 
        node: {
          id: recentNode.id,
          name: recentNode.name,
          type: recentNode.type
        }
      });
    }
    else {
      if (counter == 1) figma.ui.postMessage({type: 'NORECENTS'});
      break;
    }
  }
}