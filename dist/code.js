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
        figma.closePlugin();
    }
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQSwwQkFBMEIsdUJBQXVCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NvZGUudHNcIik7XG4iLCJ2YXIgcmVjZW50cyA9IFtdO1xudmFyIHJlc3VsdHNJdGVtV2l0aEZvY3VzID0gMDtcbi8vYXJyYXkgd2l0aCBjdXJyZW50IHNlYXJjaCByZXN1bHRzIHRvIHF1aWNrbHkgZ28gdGhyb3VnaHQgdGhlbVxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAzMjAsIGhlaWdodDogMzgwIH0pO1xuLy9maW5kIHNwZWNpZmljIHBhZ2UgYW5kIHNhdmUgcmVzdWx0cyB0byByZXN1bHRzIGFycmF5XG5jb25zdCB0b3BGcmFtZXMgPSBmaWdtYS5yb290LmNoaWxkcmVuXG4gICAgLm1hcChwYWdlID0+IC8vVGhlIG1hcCgpIG1ldGhvZCBjcmVhdGVzIGEgbmV3IGFycmF5IHBvcHVsYXRlZCB3aXRoIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBvbiBldmVyeSBlbGVtZW50IGluIHRoZSBjYWxsaW5nIGFycmF5XG4gXG4vL2NyZWF0aW5nIG5ldyBhcnJheSBhbmQgY2FsbGluZyB0aGUgZm9sbG93aW5nIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgYXJyYXlcbnBhZ2UudHlwZSA9PT0gXCJQQUdFXCIgLy9jaGVja2luZyBpZiBub2RlIHR5cGUgaXMgcGFnZVxuICAgID8gcGFnZS5jaGlsZHJlbi5tYXAoZnJhbWUgPT4gKHtcbiAgICAgICAgaWQ6IGZyYW1lLmlkLFxuICAgICAgICBuYW1lOiBmcmFtZS5uYW1lLFxuICAgICAgICB0eXBlOiBmcmFtZS50eXBlLFxuICAgICAgICBwYWdlOiBwYWdlLm5hbWVcbiAgICB9KSlcbiAgICA6IG51bGwpXG4gICAgLnJlZHVjZSgoYWNjdW11bGF0ZWRBcnJheSwgY3VycmVudEFycmF5KSA9PiB7XG4gICAgcmV0dXJuIGFjY3VtdWxhdGVkQXJyYXkuY29uY2F0KGN1cnJlbnRBcnJheSk7XG59LCBbXSk7XG4vLzEuIGdvaW5nIHRocm91Z2ggZWFjaCBub2RlIGFycmF5IFxuLy8yLiBtZXJnaW5nIGl0IHdpdGggYWxyZWFkeSBtZXJnZWQgYXJyYXlzIHRoYXQgYXJlIHN0b3JlZCBpbiBcbi8vVGhlIHJlZHVjZSgpIG1ldGhvZCBleGVjdXRlcyBhIHJlZHVjZXIgLSBmdW5jdGlvbiB0aGF0IHlvdSBwcm92aWRlIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgYXJyYXksIHJlc3VsdGluZyBpbiBhIHNpbmdsZSBvdXRwdXQgdmFsdWVcbi8vVGhlIGNvbmNhdCgpIG1ldGhvZCBpcyB1c2VkIHRvIG1lcmdlIHR3byBvciBtb3JlIGFycmF5c1xuY29uc3QgcGFnZXMgPSBmaWdtYS5yb290LmNoaWxkcmVuLm1hcChwYWdlID0+ICh7XG4gICAgaWQ6IHBhZ2UuaWQsXG4gICAgbmFtZTogcGFnZS5uYW1lLFxuICAgIHR5cGU6IHBhZ2UudHlwZVxufSkpO1xucmVjZW50cy5wdXNoKHBhZ2VzWzBdLCB0b3BGcmFtZXNbMF0sIHRvcEZyYW1lc1syXSk7XG5yZWNlbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnUkVDRU5UJyxcbiAgICAgICAgbmFtZTogZWxlbWVudC5uYW1lLFxuICAgICAgICBpZDogZWxlbWVudC5pZCxcbiAgICAgICAgbm9kZVR5cGU6IGVsZW1lbnQudHlwZVxuICAgIH0pO1xufSk7XG5wYWdlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ05FV1JFU1VMVCcsXG4gICAgICAgIG5hbWU6IGVsZW1lbnQubmFtZSxcbiAgICAgICAgaWQ6IGVsZW1lbnQuaWQsXG4gICAgICAgIG5vZGVUeXBlOiBlbGVtZW50LnR5cGVcbiAgICB9KTtcbn0pO1xudG9wRnJhbWVzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnTkVXUkVTVUxUJyxcbiAgICAgICAgbmFtZTogZWxlbWVudC5uYW1lLFxuICAgICAgICBpZDogZWxlbWVudC5pZCxcbiAgICAgICAgbm9kZVR5cGU6IGVsZW1lbnQudHlwZVxuICAgIH0pO1xufSk7XG5pZiAoKHRvcEZyYW1lcy5sZW5ndGggKyBwYWdlcy5sZW5ndGgpID4gMCkge1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ0hJTElHSFRGSVJTVCcgfSk7XG59XG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtZXNzYWdlID0+IHtcbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnQ0xPU0UnKSB7XG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdDTEVBUicpIHtcbiAgICAgICAgLy9maWdtYS51aS5yZXNpemUoNDgwLCAxMDApO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnUkVTVUxUUycpIHtcbiAgICAgICAgLy9maWdtYS51aS5yZXNpemUoNDgwLCAzMDApO1xuICAgICAgICAvL291dHB1dFJlc3VsdCgpO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnQ0hFQ0snKSB7XG4gICAgICAgIC8vcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgcGFnZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlYWNoTm9kZU5hbWUgPSBtZXNzYWdlLnNlYXJjaFZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBjb25zdCBub2RlTmFtZSA9IGVsZW1lbnQubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKG5vZGVOYW1lLmluY2x1ZGVzKHNlYWNoTm9kZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnTkVXUkVTVUxUJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogZWxlbWVudC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBpZDogZWxlbWVudC5pZCxcbiAgICAgICAgICAgICAgICAgICAgbm9kZVR5cGU6IGVsZW1lbnQudHlwZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiB0b3BGcmFtZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlYWNoTm9kZU5hbWUgPSBtZXNzYWdlLnNlYXJjaFZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBjb25zdCBub2RlTmFtZSA9IGVsZW1lbnQubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKG5vZGVOYW1lLmluY2x1ZGVzKHNlYWNoTm9kZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnTkVXUkVTVUxUJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogZWxlbWVudC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBpZDogZWxlbWVudC5pZCxcbiAgICAgICAgICAgICAgICAgICAgbm9kZVR5cGU6IGVsZW1lbnQudHlwZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdVUCcpIHtcbiAgICAgICAgaWYgKHJlc3VsdHNJdGVtV2l0aEZvY3VzICE9IDApXG4gICAgICAgICAgICByZXN1bHRzSXRlbVdpdGhGb2N1cysrO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnRE9XTicpIHtcbiAgICAgICAgaWYgKHJlc3VsdHNJdGVtV2l0aEZvY3VzICE9IHRvcEZyYW1lcy5sZW5ndGgpXG4gICAgICAgICAgICByZXN1bHRzSXRlbVdpdGhGb2N1cy0tO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSBcIkpVTVBcIikge1xuICAgICAgICBjb25zdCBub2RlSWQgPSBtZXNzYWdlLmlkO1xuICAgICAgICBjb25zdCBub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQobm9kZUlkKTtcbiAgICAgICAgLy8gQ2hhbmdlIFBhZ2VcbiAgICAgICAgaWYgKG5vZGUucGFyZW50LnR5cGUgPT09IFwiUEFHRVwiKSB7XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZSA9IG5vZGUucGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIC8vIFNlbGVjdCB0aGUgTm9kZVxuICAgICAgICBpZiAobm9kZS50eXBlICE9PSBcIkRPQ1VNRU5UXCIgJiYgbm9kZS50eXBlICE9PSBcIlBBR0VcIikge1xuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW25vZGVdO1xuICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtub2RlXSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgUGFnZVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSBcIlBBR0VcIikge1xuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UgPSBub2RlO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgfVxufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=