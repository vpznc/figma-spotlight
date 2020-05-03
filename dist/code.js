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

var recents = [];
var resultsItemWithFocus = 0;
//array with current search results to quickly go throught them
figma.showUI(__html__, { width: 320, height: 380 });
//find specific page and save results to results array
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
recents.push(pages[0], topFrames[0], topFrames[2]);
recents.forEach(element => {
    figma.ui.postMessage({
        type: 'RECENT',
        name: element.name,
        id: element.id,
        nodeType: element.type
    });
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
if ((topFrames.length + pages.length) > 0) {
    figma.ui.postMessage({ type: 'HILIGHTFIRST' });
}
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
        //results = [];
        for (const element of pages) {
            const seachNodeName = message.searchValue.toLowerCase();
            const nodeName = element.name.toLowerCase();
            if (nodeName.includes(seachNodeName)) {
                figma.ui.postMessage({ type: 'NEWRESULT',
                    name: element.name,
                    id: element.id,
                    nodeType: element.type
                });
            }
        }
        for (const element of topFrames) {
            const seachNodeName = message.searchValue.toLowerCase();
            const nodeName = element.name.toLowerCase();
            if (nodeName.includes(seachNodeName)) {
                figma.ui.postMessage({ type: 'NEWRESULT',
                    name: element.name,
                    id: element.id,
                    nodeType: element.type
                });
            }
        }
        figma.ui.postMessage({ type: 'HILIGHTFIRST' });
    }
    if (message.type === 'UP') {
        if (resultsItemWithFocus != 0)
            resultsItemWithFocus++;
    }
    if (message.type === 'DOWN') {
        if (resultsItemWithFocus != topFrames.length)
            resultsItemWithFocus--;
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
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQSwwQkFBMEIsdUJBQXVCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsOEJBQThCLHVCQUF1QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY29kZS50c1wiKTtcbiIsInZhciByZWNlbnRzID0gW107XG52YXIgcmVzdWx0c0l0ZW1XaXRoRm9jdXMgPSAwO1xuLy9hcnJheSB3aXRoIGN1cnJlbnQgc2VhcmNoIHJlc3VsdHMgdG8gcXVpY2tseSBnbyB0aHJvdWdodCB0aGVtXG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDMyMCwgaGVpZ2h0OiAzODAgfSk7XG4vL2ZpbmQgc3BlY2lmaWMgcGFnZSBhbmQgc2F2ZSByZXN1bHRzIHRvIHJlc3VsdHMgYXJyYXlcbmNvbnN0IHRvcEZyYW1lcyA9IGZpZ21hLnJvb3QuY2hpbGRyZW5cbiAgICAubWFwKHBhZ2UgPT4gLy9UaGUgbWFwKCkgbWV0aG9kIGNyZWF0ZXMgYSBuZXcgYXJyYXkgcG9wdWxhdGVkIHdpdGggdGhlIHJlc3VsdHMgb2YgY2FsbGluZyBhIHByb3ZpZGVkIGZ1bmN0aW9uIG9uIGV2ZXJ5IGVsZW1lbnQgaW4gdGhlIGNhbGxpbmcgYXJyYXlcbiBcbi8vY3JlYXRpbmcgbmV3IGFycmF5IGFuZCBjYWxsaW5nIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBhcnJheVxucGFnZS50eXBlID09PSBcIlBBR0VcIiAvL2NoZWNraW5nIGlmIG5vZGUgdHlwZSBpcyBwYWdlXG4gICAgPyBwYWdlLmNoaWxkcmVuLm1hcChmcmFtZSA9PiAoe1xuICAgICAgICBpZDogZnJhbWUuaWQsXG4gICAgICAgIG5hbWU6IGZyYW1lLm5hbWUsXG4gICAgICAgIHR5cGU6IGZyYW1lLnR5cGUsXG4gICAgICAgIHBhZ2U6IHBhZ2UubmFtZVxuICAgIH0pKVxuICAgIDogbnVsbClcbiAgICAucmVkdWNlKChhY2N1bXVsYXRlZEFycmF5LCBjdXJyZW50QXJyYXkpID0+IHtcbiAgICByZXR1cm4gYWNjdW11bGF0ZWRBcnJheS5jb25jYXQoY3VycmVudEFycmF5KTtcbn0sIFtdKTtcbi8vMS4gZ29pbmcgdGhyb3VnaCBlYWNoIG5vZGUgYXJyYXkgXG4vLzIuIG1lcmdpbmcgaXQgd2l0aCBhbHJlYWR5IG1lcmdlZCBhcnJheXMgdGhhdCBhcmUgc3RvcmVkIGluIFxuLy9UaGUgcmVkdWNlKCkgbWV0aG9kIGV4ZWN1dGVzIGEgcmVkdWNlciAtIGZ1bmN0aW9uIHRoYXQgeW91IHByb3ZpZGUgb24gZWFjaCBlbGVtZW50IG9mIHRoZSBhcnJheSwgcmVzdWx0aW5nIGluIGEgc2luZ2xlIG91dHB1dCB2YWx1ZVxuLy9UaGUgY29uY2F0KCkgbWV0aG9kIGlzIHVzZWQgdG8gbWVyZ2UgdHdvIG9yIG1vcmUgYXJyYXlzXG5jb25zdCBwYWdlcyA9IGZpZ21hLnJvb3QuY2hpbGRyZW4ubWFwKHBhZ2UgPT4gKHtcbiAgICBpZDogcGFnZS5pZCxcbiAgICBuYW1lOiBwYWdlLm5hbWUsXG4gICAgdHlwZTogcGFnZS50eXBlXG59KSk7XG5yZWNlbnRzLnB1c2gocGFnZXNbMF0sIHRvcEZyYW1lc1swXSwgdG9wRnJhbWVzWzJdKTtcbnJlY2VudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdSRUNFTlQnLFxuICAgICAgICBuYW1lOiBlbGVtZW50Lm5hbWUsXG4gICAgICAgIGlkOiBlbGVtZW50LmlkLFxuICAgICAgICBub2RlVHlwZTogZWxlbWVudC50eXBlXG4gICAgfSk7XG59KTtcbnBhZ2VzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnTkVXUkVTVUxUJyxcbiAgICAgICAgbmFtZTogZWxlbWVudC5uYW1lLFxuICAgICAgICBpZDogZWxlbWVudC5pZCxcbiAgICAgICAgbm9kZVR5cGU6IGVsZW1lbnQudHlwZVxuICAgIH0pO1xufSk7XG50b3BGcmFtZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdORVdSRVNVTFQnLFxuICAgICAgICBuYW1lOiBlbGVtZW50Lm5hbWUsXG4gICAgICAgIGlkOiBlbGVtZW50LmlkLFxuICAgICAgICBub2RlVHlwZTogZWxlbWVudC50eXBlXG4gICAgfSk7XG59KTtcbmlmICgodG9wRnJhbWVzLmxlbmd0aCArIHBhZ2VzLmxlbmd0aCkgPiAwKSB7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnSElMSUdIVEZJUlNUJyB9KTtcbn1cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1lc3NhZ2UgPT4ge1xuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdDTE9TRScpIHtcbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ0NMRUFSJykge1xuICAgICAgICAvL2ZpZ21hLnVpLnJlc2l6ZSg0ODAsIDEwMCk7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdSRVNVTFRTJykge1xuICAgICAgICAvL2ZpZ21hLnVpLnJlc2l6ZSg0ODAsIDMwMCk7XG4gICAgICAgIC8vb3V0cHV0UmVzdWx0KCk7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdDSEVDSycpIHtcbiAgICAgICAgLy9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBwYWdlcykge1xuICAgICAgICAgICAgY29uc3Qgc2VhY2hOb2RlTmFtZSA9IG1lc3NhZ2Uuc2VhcmNoVmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVOYW1lID0gZWxlbWVudC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAobm9kZU5hbWUuaW5jbHVkZXMoc2VhY2hOb2RlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdORVdSRVNVTFQnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBlbGVtZW50Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGlkOiBlbGVtZW50LmlkLFxuICAgICAgICAgICAgICAgICAgICBub2RlVHlwZTogZWxlbWVudC50eXBlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHRvcEZyYW1lcykge1xuICAgICAgICAgICAgY29uc3Qgc2VhY2hOb2RlTmFtZSA9IG1lc3NhZ2Uuc2VhcmNoVmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVOYW1lID0gZWxlbWVudC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAobm9kZU5hbWUuaW5jbHVkZXMoc2VhY2hOb2RlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdORVdSRVNVTFQnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBlbGVtZW50Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGlkOiBlbGVtZW50LmlkLFxuICAgICAgICAgICAgICAgICAgICBub2RlVHlwZTogZWxlbWVudC50eXBlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnSElMSUdIVEZJUlNUJyB9KTtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ1VQJykge1xuICAgICAgICBpZiAocmVzdWx0c0l0ZW1XaXRoRm9jdXMgIT0gMClcbiAgICAgICAgICAgIHJlc3VsdHNJdGVtV2l0aEZvY3VzKys7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdET1dOJykge1xuICAgICAgICBpZiAocmVzdWx0c0l0ZW1XaXRoRm9jdXMgIT0gdG9wRnJhbWVzLmxlbmd0aClcbiAgICAgICAgICAgIHJlc3VsdHNJdGVtV2l0aEZvY3VzLS07XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09IFwiSlVNUFwiKSB7XG4gICAgICAgIGNvbnN0IG5vZGVJZCA9IG1lc3NhZ2UuaWQ7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZChub2RlSWQpO1xuICAgICAgICAvLyBDaGFuZ2UgUGFnZVxuICAgICAgICBpZiAobm9kZS5wYXJlbnQudHlwZSA9PT0gXCJQQUdFXCIpIHtcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlID0gbm9kZS5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2VsZWN0IHRoZSBOb2RlXG4gICAgICAgIGlmIChub2RlLnR5cGUgIT09IFwiRE9DVU1FTlRcIiAmJiBub2RlLnR5cGUgIT09IFwiUEFHRVwiKSB7XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbbm9kZV07XG4gICAgICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW25vZGVdKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBQYWdlXG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09IFwiUEFHRVwiKSB7XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZSA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgLy9maWdtYS5jbG9zZVBsdWdpbigpO1xuICAgIH1cbn07XG4iXSwic291cmNlUm9vdCI6IiJ9