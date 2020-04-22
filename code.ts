class result {
  type: string;
  name: string;
  nodeid: string;
  focused: boolean;

  constructor(type, name, nodeid, focused) {
    this.type = type;
    this.name = name;
    this.nodeid = nodeid;
    this.focused = focused;
  }
}

var allData: result[];
var results: result[];
var recents: result[];
var resultsItemWithFocus = 0;
//array with current search results to quickly go throught them

figma.showUI(__html__, { width: 480, height: 100});

loadAllPages();
//find("i");
//outputResult();

figma.ui.onmessage = message => {
  if (message.type === 'closePlugin') {
    figma.closePlugin();
  }

  if (message.type === 'clear') {
    figma.ui.resize(480, 100);
  }

  if (message.type === 'showResults') {
    figma.ui.resize(480, 300);
    outputResult();
  }

  if (message.type === 'checkResults') {
    loadAllPages();
    //loadFilePages(message.searchValue.toLowerCase())
  }

  if (message.type === 'moveFocusUp') {
    if (resultsItemWithFocus != 0) resultsItemWithFocus++
  }

  if (message.type === 'moveFocusDown') {
    if (resultsItemWithFocus != results.length) resultsItemWithFocus--
  }
}

//find specific page and save results to results array
function loadAllPages() {

  const topFrames = figma.root.children 
  .map(p => //The map() method creates a new array populated with the results of calling a provided function on every element in the calling array
    //creating new array and calling the following function on each element of the array
    p.type === "PAGE" //checking if node type is page
      ? p.children.map(f => ({ // if so, mapping it's children, adding id, name, type, page of each element to the array
          id: f.id,
          name: f.name,
          type: f.type,
          page: p.name
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

  for (const child of topFrames) {
    if (child.type === "COMPONENT") {
      console.log(child);
    }    
  } 

  //console.log(pages);
  //console.log(components);
  /*const allPages = figma.root.findAll(n => n.type === 'PAGE');
  for (const child of allPages) {
      //allData.push(new result('PAGE', child.name, child.id, false))
  }*/
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
      figma.ui.postMessage( { type: 'showNewResultElement', value: entry.name} );
    }
  }
}