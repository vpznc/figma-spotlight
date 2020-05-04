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
        // Appending page to recents
        for (var counter = maxRecentsCount; counter >= 0; counter--) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0Esd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0EsMEJBQTBCLHVCQUF1QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSw4QkFBOEIsdUJBQXVCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxjQUFjO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qiw0QkFBNEI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0Msb0JBQW9CO0FBQzFEO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jb2RlLnRzXCIpO1xuIiwibGV0IG1heFJlY2VudHNDb3VudCA9IDU7XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDMyMCwgaGVpZ2h0OiAzODAgfSk7XG4vL2ZpbmQgc3BlY2lmaWMgcGFnZSBhbmQgc2F2ZSByZXN1bHRzIHRvIHJlc3VsdHMgYXJyYXlcbi8vdG9wRnJhbWVzIC0gYWxsIGxheWVycyBpbiBmaWxlXG5jb25zdCB0b3BGcmFtZXMgPSBmaWdtYS5yb290LmNoaWxkcmVuXG4gICAgLm1hcChwYWdlID0+IC8vVGhlIG1hcCgpIG1ldGhvZCBjcmVhdGVzIGEgbmV3IGFycmF5IHBvcHVsYXRlZCB3aXRoIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBvbiBldmVyeSBlbGVtZW50IGluIHRoZSBjYWxsaW5nIGFycmF5XG4gXG4vL2NyZWF0aW5nIG5ldyBhcnJheSBhbmQgY2FsbGluZyB0aGUgZm9sbG93aW5nIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgYXJyYXlcbnBhZ2UudHlwZSA9PT0gXCJQQUdFXCIgLy9jaGVja2luZyBpZiBub2RlIHR5cGUgaXMgcGFnZVxuICAgID8gcGFnZS5jaGlsZHJlbi5tYXAoZnJhbWUgPT4gKHtcbiAgICAgICAgaWQ6IGZyYW1lLmlkLFxuICAgICAgICBuYW1lOiBmcmFtZS5uYW1lLFxuICAgICAgICB0eXBlOiBmcmFtZS50eXBlLFxuICAgIH0pKVxuICAgIDogbnVsbClcbiAgICAucmVkdWNlKChhY2N1bXVsYXRlZEFycmF5LCBjdXJyZW50QXJyYXkpID0+IHtcbiAgICByZXR1cm4gYWNjdW11bGF0ZWRBcnJheS5jb25jYXQoY3VycmVudEFycmF5KTtcbn0sIFtdKTtcbi8vMS4gZ29pbmcgdGhyb3VnaCBlYWNoIG5vZGUgYXJyYXkgXG4vLzIuIG1lcmdpbmcgaXQgd2l0aCBhbHJlYWR5IG1lcmdlZCBhcnJheXMgdGhhdCBhcmUgc3RvcmVkIGluIFxuLy9UaGUgcmVkdWNlKCkgbWV0aG9kIGV4ZWN1dGVzIGEgcmVkdWNlciAtIGZ1bmN0aW9uIHRoYXQgeW91IHByb3ZpZGUgb24gZWFjaCBlbGVtZW50IG9mIHRoZSBhcnJheSwgcmVzdWx0aW5nIGluIGEgc2luZ2xlIG91dHB1dCB2YWx1ZVxuLy9UaGUgY29uY2F0KCkgbWV0aG9kIGlzIHVzZWQgdG8gbWVyZ2UgdHdvIG9yIG1vcmUgYXJyYXlzXG5jb25zdCBwYWdlcyA9IGZpZ21hLnJvb3QuY2hpbGRyZW4ubWFwKHBhZ2UgPT4gKHtcbiAgICBpZDogcGFnZS5pZCxcbiAgICBuYW1lOiBwYWdlLm5hbWUsXG4gICAgdHlwZTogcGFnZS50eXBlXG59KSk7XG5wYWdlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ05FV1JFU1VMVCcsXG4gICAgICAgIG5vZGU6IGVsZW1lbnRcbiAgICB9KTtcbn0pO1xudG9wRnJhbWVzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnTkVXUkVTVUxUJyxcbiAgICAgICAgbm9kZTogZWxlbWVudFxuICAgIH0pO1xufSk7XG5vdXRwdXRSZWNlbnRzKCk7XG5pZiAoKHRvcEZyYW1lcy5sZW5ndGggKyBwYWdlcy5sZW5ndGgpID4gMCkge1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ0hJTElHSFRGSVJTVCcgfSk7XG59XG4vLyBFbmQgb2Ygc2V0dGluZyBldmVyeXRoaW5nIHBsdWdpbiBuZWVkIHRvIGhhdmUgb24gbGF1bmNoXG4vLyBTdGFydCBvZiBwcm9jZXNzaW5nIGNhbGxiYWNrcyBmcm9tIHRoZSB1aS50c1xuZmlnbWEudWkub25tZXNzYWdlID0gbWVzc2FnZSA9PiB7XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ0NMT1NFJykge1xuICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnQ0hFQ0snKSB7XG4gICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBwYWdlcykge1xuICAgICAgICAgICAgY29uc3Qgc2VhY2hOb2RlTmFtZSA9IG1lc3NhZ2Uuc2VhcmNoVmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVOYW1lID0gZWxlbWVudC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAobm9kZU5hbWUuaW5jbHVkZXMoc2VhY2hOb2RlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdORVdSRVNVTFQnLFxuICAgICAgICAgICAgICAgICAgICBub2RlOiBlbGVtZW50XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHRvcEZyYW1lcykge1xuICAgICAgICAgICAgY29uc3Qgc2VhY2hOb2RlTmFtZSA9IG1lc3NhZ2Uuc2VhcmNoVmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVOYW1lID0gZWxlbWVudC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAobm9kZU5hbWUuaW5jbHVkZXMoc2VhY2hOb2RlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdORVdSRVNVTFQnLFxuICAgICAgICAgICAgICAgICAgICBub2RlOiBlbGVtZW50XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnSElMSUdIVEZJUlNUJyB9KTtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gXCJKVU1QXCIpIHtcbiAgICAgICAgY29uc3Qgbm9kZUlkID0gbWVzc2FnZS5pZDtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGZpZ21hLmdldE5vZGVCeUlkKG5vZGVJZCk7XG4gICAgICAgIC8vIENoYW5nZSBQYWdlXG4gICAgICAgIGlmIChub2RlLnBhcmVudC50eXBlID09PSBcIlBBR0VcIikge1xuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UgPSBub2RlLnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICAvLyBTZWxlY3QgdGhlIE5vZGVcbiAgICAgICAgaWYgKG5vZGUudHlwZSAhPT0gXCJET0NVTUVOVFwiICYmIG5vZGUudHlwZSAhPT0gXCJQQUdFXCIpIHtcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IFtub2RlXTtcbiAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbbm9kZV0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIFBhZ2VcbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJQQUdFXCIpIHtcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlID0gbm9kZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBcHBlbmRpbmcgcGFnZSB0byByZWNlbnRzXG4gICAgICAgIGZvciAodmFyIGNvdW50ZXIgPSBtYXhSZWNlbnRzQ291bnQ7IGNvdW50ZXIgPj0gMDsgY291bnRlci0tKSB7XG4gICAgICAgICAgICB2YXIgcmVjZW50cyA9IGZpZ21hLnJvb3QuZ2V0UGx1Z2luRGF0YShcInJlY2VudHNcIiArIGNvdW50ZXIpO1xuICAgICAgICAgICAgaWYgKHJlY2VudHMgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGZpZ21hLnJvb3Quc2V0UGx1Z2luRGF0YShcInJlY2VudHNcIiArIChjb3VudGVyICsgMSksIHJlY2VudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZpZ21hLnJvb3Quc2V0UGx1Z2luRGF0YShcInJlY2VudHMxXCIsIG5vZGVJZCk7XG4gICAgICAgIG91dHB1dFJlY2VudHMoKTtcbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICB9XG59O1xuZnVuY3Rpb24gb3V0cHV0UmVjZW50cygpIHtcbiAgICB2YXIgbG9jYWxDb3VudGVyID0gMDtcbiAgICBmb3IgKHZhciBjb3VudGVyID0gMTsgY291bnRlciA8PSBtYXhSZWNlbnRzQ291bnQ7IGNvdW50ZXIrKykge1xuICAgICAgICB2YXIgcmVjZW50ID0gZmlnbWEucm9vdC5nZXRQbHVnaW5EYXRhKFwicmVjZW50c1wiICsgY291bnRlcik7XG4gICAgICAgIGlmIChyZWNlbnQgIT0gXCJcIikge1xuICAgICAgICAgICAgbG9jYWxDb3VudGVyKys7XG4gICAgICAgICAgICB2YXIgcmVjZW50Tm9kZSA9IGZpZ21hLmdldE5vZGVCeUlkKHJlY2VudCk7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1JFQ0VOVCcsXG4gICAgICAgICAgICAgICAgbm9kZToge1xuICAgICAgICAgICAgICAgICAgICBpZDogcmVjZW50Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogcmVjZW50Tm9kZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiByZWNlbnROb2RlLnR5cGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjb3VudGVyID09IDEpXG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnTk9SRUNFTlRTJyB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==