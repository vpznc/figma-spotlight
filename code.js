var allData = [];
var results = [];
var recents = [];
var resultsItemWithFocus = 0;
//array with current search results to quickly go throught them
figma.showUI(__html__, { width: 480, height: 500 });
loadAllPages();
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
        if (resultsItemWithFocus != 0)
            resultsItemWithFocus++;
    }
    if (message.type === 'moveFocusDown') {
        if (resultsItemWithFocus != results.length)
            resultsItemWithFocus--;
    }
    if (message.type === 'jumpToFrame') {
        const nodeId = message.id;
        const node = figma.getNodeById(nodeId);
    }
};
//find specific page and save results to results array
function loadAllPages() {
    const topFrames = figma.root.children
        .map(page => //The map() method creates a new array populated with the results of calling a provided function on every element in the calling array
     
    //creating new array and calling the following function on each element of the array
    page.type === "PAGE" //checking if node type is page
        ? page.children.map(frame => ({
            id: frame.id,
            name: frame.name,
            type: frame.type,
            page: page.name
        }))
        : null)
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
    for (const child of topFrames) {
        if (child.type === "COMPONENT") {
            console.log(child);
        }
    }
    recents.push(pages[0], pages[1], pages[3]);
    recents.forEach(recentElement => {
        figma.ui.postMessage({ type: 'showNewResultElement', value: recentElement.name });
    });
}
function find(searchValue) {
    results = [];
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
            figma.ui.postMessage({ type: 'showNewResultElement', value: entry.name });
        }
    }
}
