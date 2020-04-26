var allData = [];
var results = [];

var recents = [];
var resultsItemWithFocus = 0;
//array with current search results to quickly go throught them

figma.showUI(__html__, { width: 300, height: 400});

loadAllPages();

figma.ui.onmessage = message => {
  if (message.type === 'CLOSE') {
    figma.closePlugin();
  }

  if (message.type === 'CLEAR') {
    //figma.ui.resize(480, 100);
  }

  if (message.type === 'RESULTS') {
    //figma.ui.resize(480, 300);
    //outputResult();
  }

  if (message.type === 'CHECK') {
    //loadAllPages();
    //loadFilePages(message.searchValue.toLowerCase())
  }

  if (message.type === 'UP') {
    if (resultsItemWithFocus != 0) resultsItemWithFocus++;
  }

  if (message.type === 'DOWN') {
    if (resultsItemWithFocus != results.length) resultsItemWithFocus--;
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

    //figma.closePlugin();
  }
}

//find specific page and save results to results array
function loadAllPages() {

  const topFrames = figma.root.children 
  .map(page => //The map() method creates a new array populated with the results of calling a provided function on every element in the calling array
    //creating new array and calling the following function on each element of the array
    page.type === "PAGE" //checking if node type is page
      ? page.children.map(frame => ({ // if so, mapping it's children, adding id, name, type, page of each element to the array
          id: frame.id,
          name: frame.name,
          type: frame.type,
          page: page.name
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

  recents.push(pages[0], topFrames[188], topFrames[399]);
  
  recents.forEach(element => {
    figma.ui.postMessage({ 
      type: 'RECENT', 
      name: element.name, 
      id: element.id, 
      nodeType: element.type});
  });

  pages.forEach(element => {
    figma.ui.postMessage({ 
      type: 'NEWRESULT', 
      name: element.name, 
      id: element.id, 
      nodeType: element.type
    });
  });

  topFrames.forEach(element => {
    figma.ui.postMessage({ type: 'NEWRESULT', 
      name: element.name, 
      id: element.id, 
      nodeType: element.type
    });
  });
}

function find(searchValue: string) {
  results = []
  for (const child of allData) {
    const nodeName = child.name.toLowerCase();
    
    if (nodeName.includes(searchValue)) {
      results.push(child);
    }    
  }
}

function outputResult() {
  if (Array.isArray(results) && results.length) {
    for (let entry of results) {
      figma.ui.postMessage( { type: 'NEWRESULT', value: entry.name} );
    }
  }

}