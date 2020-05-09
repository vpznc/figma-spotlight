/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/code.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

let maxRecentsCount = 5;
figma.showUI(__html__, { width: 320, height: 380 });
//find specific page and save results to results array
//topFrames - all layers in file
const topFrames = figma.root.children
    .map(page => //The map() method creates a new array populated with the results of calling a provided function on every element in the calling array
 
//creating new array and calling the following function on each element of the array
page.type === "PAGE" //checking if node type is page
    ? page.children.map(frame => ({
        id: frame.id,
        name: frame.name,
        type: frame.type,
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
    figma.ui.postMessage({ type: 'HILIGHTFIRST' });
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
        figma.ui.postMessage({ type: 'HILIGHTFIRST' });
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
        // If page is in already in recents - moving it up, 
        // If else moving the whole recents array by 1 and appending new node 
        var moveStart = maxRecentsCount;
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
        figma.closePlugin();
    }
};
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
            if (counter == 1)
                figma.ui.postMessage({ type: 'NORECENTS' });
            break;
        }
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0Esd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0EsMEJBQTBCLHVCQUF1QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSw4QkFBOEIsdUJBQXVCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCwwQkFBMEI7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLGNBQWM7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLDRCQUE0QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxvQkFBb0I7QUFDMUQ7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NvZGUudHNcIik7XG4iLCJsZXQgbWF4UmVjZW50c0NvdW50ID0gNTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMzIwLCBoZWlnaHQ6IDM4MCB9KTtcbi8vZmluZCBzcGVjaWZpYyBwYWdlIGFuZCBzYXZlIHJlc3VsdHMgdG8gcmVzdWx0cyBhcnJheVxuLy90b3BGcmFtZXMgLSBhbGwgbGF5ZXJzIGluIGZpbGVcbmNvbnN0IHRvcEZyYW1lcyA9IGZpZ21hLnJvb3QuY2hpbGRyZW5cbiAgICAubWFwKHBhZ2UgPT4gLy9UaGUgbWFwKCkgbWV0aG9kIGNyZWF0ZXMgYSBuZXcgYXJyYXkgcG9wdWxhdGVkIHdpdGggdGhlIHJlc3VsdHMgb2YgY2FsbGluZyBhIHByb3ZpZGVkIGZ1bmN0aW9uIG9uIGV2ZXJ5IGVsZW1lbnQgaW4gdGhlIGNhbGxpbmcgYXJyYXlcbiBcbi8vY3JlYXRpbmcgbmV3IGFycmF5IGFuZCBjYWxsaW5nIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBhcnJheVxucGFnZS50eXBlID09PSBcIlBBR0VcIiAvL2NoZWNraW5nIGlmIG5vZGUgdHlwZSBpcyBwYWdlXG4gICAgPyBwYWdlLmNoaWxkcmVuLm1hcChmcmFtZSA9PiAoe1xuICAgICAgICBpZDogZnJhbWUuaWQsXG4gICAgICAgIG5hbWU6IGZyYW1lLm5hbWUsXG4gICAgICAgIHR5cGU6IGZyYW1lLnR5cGUsXG4gICAgfSkpXG4gICAgOiBudWxsKVxuICAgIC5yZWR1Y2UoKGFjY3VtdWxhdGVkQXJyYXksIGN1cnJlbnRBcnJheSkgPT4ge1xuICAgIHJldHVybiBhY2N1bXVsYXRlZEFycmF5LmNvbmNhdChjdXJyZW50QXJyYXkpO1xufSwgW10pO1xuLy8xLiBnb2luZyB0aHJvdWdoIGVhY2ggbm9kZSBhcnJheSBcbi8vMi4gbWVyZ2luZyBpdCB3aXRoIGFscmVhZHkgbWVyZ2VkIGFycmF5cyB0aGF0IGFyZSBzdG9yZWQgaW4gXG4vL1RoZSByZWR1Y2UoKSBtZXRob2QgZXhlY3V0ZXMgYSByZWR1Y2VyIC0gZnVuY3Rpb24gdGhhdCB5b3UgcHJvdmlkZSBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGFycmF5LCByZXN1bHRpbmcgaW4gYSBzaW5nbGUgb3V0cHV0IHZhbHVlXG4vL1RoZSBjb25jYXQoKSBtZXRob2QgaXMgdXNlZCB0byBtZXJnZSB0d28gb3IgbW9yZSBhcnJheXNcbmNvbnN0IHBhZ2VzID0gZmlnbWEucm9vdC5jaGlsZHJlbi5tYXAocGFnZSA9PiAoe1xuICAgIGlkOiBwYWdlLmlkLFxuICAgIG5hbWU6IHBhZ2UubmFtZSxcbiAgICB0eXBlOiBwYWdlLnR5cGVcbn0pKTtcbnBhZ2VzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnTkVXUkVTVUxUJyxcbiAgICAgICAgbm9kZTogZWxlbWVudFxuICAgIH0pO1xufSk7XG50b3BGcmFtZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdORVdSRVNVTFQnLFxuICAgICAgICBub2RlOiBlbGVtZW50XG4gICAgfSk7XG59KTtcbm91dHB1dFJlY2VudHMoKTtcbmlmICgodG9wRnJhbWVzLmxlbmd0aCArIHBhZ2VzLmxlbmd0aCkgPiAwKSB7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnSElMSUdIVEZJUlNUJyB9KTtcbn1cbi8vIEVuZCBvZiBzZXR0aW5nIGV2ZXJ5dGhpbmcgcGx1Z2luIG5lZWQgdG8gaGF2ZSBvbiBsYXVuY2hcbi8vIFN0YXJ0IG9mIHByb2Nlc3NpbmcgY2FsbGJhY2tzIGZyb20gdGhlIHVpLnRzXG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtZXNzYWdlID0+IHtcbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnQ0xPU0UnKSB7XG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdDSEVDSycpIHtcbiAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHBhZ2VzKSB7XG4gICAgICAgICAgICBjb25zdCBzZWFjaE5vZGVOYW1lID0gbWVzc2FnZS5zZWFyY2hWYWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgY29uc3Qgbm9kZU5hbWUgPSBlbGVtZW50Lm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGlmIChub2RlTmFtZS5pbmNsdWRlcyhzZWFjaE5vZGVOYW1lKSkge1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ05FV1JFU1VMVCcsXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IGVsZW1lbnRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdG9wRnJhbWVzKSB7XG4gICAgICAgICAgICBjb25zdCBzZWFjaE5vZGVOYW1lID0gbWVzc2FnZS5zZWFyY2hWYWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgY29uc3Qgbm9kZU5hbWUgPSBlbGVtZW50Lm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGlmIChub2RlTmFtZS5pbmNsdWRlcyhzZWFjaE5vZGVOYW1lKSkge1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ05FV1JFU1VMVCcsXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IGVsZW1lbnRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdISUxJR0hURklSU1QnIH0pO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSBcIkpVTVBcIikge1xuICAgICAgICBjb25zdCBub2RlSWQgPSBtZXNzYWdlLmlkO1xuICAgICAgICBjb25zdCBub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQobm9kZUlkKTtcbiAgICAgICAgLy8gQ2hhbmdlIFBhZ2VcbiAgICAgICAgaWYgKG5vZGUucGFyZW50LnR5cGUgPT09IFwiUEFHRVwiKSB7XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZSA9IG5vZGUucGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIC8vIFNlbGVjdCB0aGUgTm9kZVxuICAgICAgICBpZiAobm9kZS50eXBlICE9PSBcIkRPQ1VNRU5UXCIgJiYgbm9kZS50eXBlICE9PSBcIlBBR0VcIikge1xuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW25vZGVdO1xuICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtub2RlXSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgUGFnZVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSBcIlBBR0VcIikge1xuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UgPSBub2RlO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlY2VudHMgbWVjaGFuaWMgXG4gICAgICAgIC8vIENoZWNraW5nIGlmIG5vZGUgaXMgYWxyZWFkeSBpbiByZWNlbnRzXG4gICAgICAgIHZhciBub2RlSXNSZWNlbnRzID0gZmFsc2U7XG4gICAgICAgIHZhciBub2RlUmVjZW50c1Bvc2l0aW9uID0gMDtcbiAgICAgICAgZm9yIChub2RlUmVjZW50c1Bvc2l0aW9uID0gbWF4UmVjZW50c0NvdW50OyBub2RlUmVjZW50c1Bvc2l0aW9uID49IDA7IG5vZGVSZWNlbnRzUG9zaXRpb24tLSkge1xuICAgICAgICAgICAgdmFyIHJlY2VudHMgPSBmaWdtYS5yb290LmdldFBsdWdpbkRhdGEoXCJyZWNlbnRzXCIgKyBub2RlUmVjZW50c1Bvc2l0aW9uKTtcbiAgICAgICAgICAgIGlmIChyZWNlbnRzID09IG5vZGVJZCkge1xuICAgICAgICAgICAgICAgIG5vZGVJc1JlY2VudHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIHBhZ2UgaXMgaW4gYWxyZWFkeSBpbiByZWNlbnRzIC0gbW92aW5nIGl0IHVwLCBcbiAgICAgICAgLy8gSWYgZWxzZSBtb3ZpbmcgdGhlIHdob2xlIHJlY2VudHMgYXJyYXkgYnkgMSBhbmQgYXBwZW5kaW5nIG5ldyBub2RlIFxuICAgICAgICB2YXIgbW92ZVN0YXJ0ID0gbWF4UmVjZW50c0NvdW50O1xuICAgICAgICBpZiAobm9kZUlzUmVjZW50cykge1xuICAgICAgICAgICAgbW92ZVN0YXJ0ID0gbm9kZVJlY2VudHNQb3NpdGlvbiAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgY291bnRlciA9IG1vdmVTdGFydDsgY291bnRlciA+PSAwOyBjb3VudGVyLS0pIHtcbiAgICAgICAgICAgIHZhciByZWNlbnRzID0gZmlnbWEucm9vdC5nZXRQbHVnaW5EYXRhKFwicmVjZW50c1wiICsgY291bnRlcik7XG4gICAgICAgICAgICBpZiAocmVjZW50cyAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgZmlnbWEucm9vdC5zZXRQbHVnaW5EYXRhKFwicmVjZW50c1wiICsgKGNvdW50ZXIgKyAxKSwgcmVjZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmlnbWEucm9vdC5zZXRQbHVnaW5EYXRhKFwicmVjZW50czFcIiwgbm9kZUlkKTtcbiAgICAgICAgb3V0cHV0UmVjZW50cygpO1xuICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgIH1cbn07XG5mdW5jdGlvbiBvdXRwdXRSZWNlbnRzKCkge1xuICAgIHZhciBsb2NhbENvdW50ZXIgPSAwO1xuICAgIGZvciAodmFyIGNvdW50ZXIgPSAxOyBjb3VudGVyIDw9IG1heFJlY2VudHNDb3VudDsgY291bnRlcisrKSB7XG4gICAgICAgIHZhciByZWNlbnQgPSBmaWdtYS5yb290LmdldFBsdWdpbkRhdGEoXCJyZWNlbnRzXCIgKyBjb3VudGVyKTtcbiAgICAgICAgaWYgKHJlY2VudCAhPSBcIlwiKSB7XG4gICAgICAgICAgICBsb2NhbENvdW50ZXIrKztcbiAgICAgICAgICAgIHZhciByZWNlbnROb2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQocmVjZW50KTtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUkVDRU5UJyxcbiAgICAgICAgICAgICAgICBub2RlOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiByZWNlbnROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiByZWNlbnROb2RlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHJlY2VudE5vZGUudHlwZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvdW50ZXIgPT0gMSlcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdOT1JFQ0VOVFMnIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9