figma.showUI(__html__, { width: 480, height: 100 });
class result {
    constructor(type, name, nodeid, focused) {
        this.type = type;
        this.name = name;
        this.nodeid = nodeid;
        this.focused = focused;
    }
}
var results;
figma.ui.onmessage = msg => {
    if (msg.type === 'closePlugin') {
        figma.closePlugin();
    }
    if (msg.type === 'clear') {
        figma.ui.resize(480, 100);
    }
    if (msg.type === 'showResults') {
        figma.ui.resize(480, 300);
        outputResult();
    }
    if (msg.type === 'checkResults') {
        findPage(msg.searchValue.toLowerCase());
    }
};
function findPage(searchValue) {
    const allPages = figma.root.findAll(n => n.type === 'PAGE');
    results = [];
    for (const child of allPages) {
        const nodeName = child.name.toLowerCase();
        if (nodeName.includes(searchValue)) {
            const searchResult = new result('PAGE', child.name, child.id, false);
            results.push(searchResult);
        }
    }
}
function outputResult() {
    for (let entry of results) {
        figma.ui.postMessage(entry.name);
    }
}
