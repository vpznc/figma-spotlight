figma.showUI(__html__, { width: 480, height: 100});

class result {
  type: string;
  name: string;
  nodeid: string;

  constructor(type, name, nodeid) {
    this.type = type;
    this.name = name;
    this.nodeid = nodeid;
  }
}

figma.ui.onmessage = msg => {
  if (msg.type === 'closePlugin') {
    figma.closePlugin();
  }

  if (msg.type === 'showResults') {
    figma.ui.resize(480, 300);
    //findPage(msg.searchValue.toLowerCase())
  }

  if (msg.type === 'checkResults') {
    findPage(msg.searchValue.toLowerCase())
  }

  if (msg.type === 'clear') {
    figma.ui.resize(480, 100);
  }

}

function findPage(searchValue: string) {
  const allPages = figma.root.findAll(n => n.type === 'PAGE')
  var collectedNodes = [];

  for (const child of allPages) {
    const nodeName = child.name.toLowerCase();
    
    if (nodeName.includes(searchValue)) {
      collectedNodes.push(child);
      figma.ui.postMessage(nodeName);
    }
    
  }

}