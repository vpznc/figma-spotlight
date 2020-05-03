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
if ((topFrames.length + pages.length) > 0) {
    figma.ui.postMessage({ type: 'HILIGHTFIRST' });
}
//recents.push(pages[0], topFrames[0], topFrames[2]);
//console.log(recents);
var recents1 = figma.root.getPluginData("recents1");
var recents2 = figma.root.getPluginData("recents2");
var recents3 = figma.root.getPluginData("recents3");
if (recents1 != "") {
    var recentNode = figma.getNodeById(recents1);
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
    figma.ui.postMessage({ type: 'NORECENTS' });
}
if (recents2 != "") {
    var recentNode = figma.getNodeById(recents2);
    figma.ui.postMessage({
        type: 'RECENT',
        node: {
            id: recentNode.id,
            name: recentNode.name,
            type: recentNode.type
        }
    });
}
if (recents3 != "") {
    var recentNode = figma.getNodeById(recents3);
    figma.ui.postMessage({
        type: 'RECENT',
        node: {
            id: recentNode.id,
            name: recentNode.name,
            type: recentNode.type
        }
    });
}
/*var recentsArray = figma.clientStorage.getAsync('recents');

recentsArray.then(function(asyncRecents) {
  if (asyncRecents.length != 0) {
    asyncRecents.forEach(element => {
      figma.ui.postMessage({
        type: 'RECENT',
        node: element
      });
    })
  }
  else {
    figma.ui.postMessage({
      type: 'NORECENTS'
    });
  }
});*/
/*recents.forEach(element => {
  figma.ui.postMessage({
    type: 'RECENT',
    node: element
  });
});*/
//figma.clientStorage.setAsync('recents', recents);
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
        //Recents magic ------- ----- ------ ------
        var recents1 = figma.root.getPluginData("recents1");
        var recents2 = figma.root.getPluginData("recents2");
        if (recents1 != "") {
            figma.root.setPluginData("recents2", recents1);
        }
        if (recents2 != "") {
            figma.root.setPluginData("recents3", recents2);
        }
        figma.root.setPluginData("recents1", nodeId);
        //console.log(figma.root.getPluginData("recents1"));
        /*
        var storage = figma.clientStorage.getAsync('recents');
        
        storage.then(function(asyncRecents) {
          var newRecents = [];
    
          newRecents.push({
            id: node.id,
            name: node.name,
            type: node.type
          });
    
          newRecents.push(asyncRecents[0]);
          newRecents.push(asyncRecents[1]);
          
          figma.clientStorage.setAsync('recents', newRecents);
        });*/
        //figma.closePlugin();
    }
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQSx3QkFBd0IsMEJBQTBCO0FBQ2xEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBLDBCQUEwQix1QkFBdUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSwwQkFBMEIsb0JBQW9CO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLENBQUMsRUFBRTtBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMsRUFBRTtBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsOEJBQThCLHVCQUF1QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7O0FBRVg7QUFDQTs7QUFFQTtBQUNBLFNBQVMsRUFBRTtBQUNYO0FBQ0E7QUFDQSIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY29kZS50c1wiKTtcbiIsInZhciByZWNlbnRzID0gW107XG4vL2FycmF5IHdpdGggY3VycmVudCBzZWFyY2ggcmVzdWx0cyB0byBxdWlja2x5IGdvIHRocm91Z2h0IHRoZW1cbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMzIwLCBoZWlnaHQ6IDM4MCB9KTtcbi8vZmluZCBzcGVjaWZpYyBwYWdlIGFuZCBzYXZlIHJlc3VsdHMgdG8gcmVzdWx0cyBhcnJheVxuY29uc3QgdG9wRnJhbWVzID0gZmlnbWEucm9vdC5jaGlsZHJlblxuICAgIC5tYXAocGFnZSA9PiAvL1RoZSBtYXAoKSBtZXRob2QgY3JlYXRlcyBhIG5ldyBhcnJheSBwb3B1bGF0ZWQgd2l0aCB0aGUgcmVzdWx0cyBvZiBjYWxsaW5nIGEgcHJvdmlkZWQgZnVuY3Rpb24gb24gZXZlcnkgZWxlbWVudCBpbiB0aGUgY2FsbGluZyBhcnJheVxuIFxuLy9jcmVhdGluZyBuZXcgYXJyYXkgYW5kIGNhbGxpbmcgdGhlIGZvbGxvd2luZyBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGFycmF5XG5wYWdlLnR5cGUgPT09IFwiUEFHRVwiIC8vY2hlY2tpbmcgaWYgbm9kZSB0eXBlIGlzIHBhZ2VcbiAgICA/IHBhZ2UuY2hpbGRyZW4ubWFwKGZyYW1lID0+ICh7XG4gICAgICAgIGlkOiBmcmFtZS5pZCxcbiAgICAgICAgbmFtZTogZnJhbWUubmFtZSxcbiAgICAgICAgdHlwZTogZnJhbWUudHlwZSxcbiAgICB9KSlcbiAgICA6IG51bGwpXG4gICAgLnJlZHVjZSgoYWNjdW11bGF0ZWRBcnJheSwgY3VycmVudEFycmF5KSA9PiB7XG4gICAgcmV0dXJuIGFjY3VtdWxhdGVkQXJyYXkuY29uY2F0KGN1cnJlbnRBcnJheSk7XG59LCBbXSk7XG4vLzEuIGdvaW5nIHRocm91Z2ggZWFjaCBub2RlIGFycmF5IFxuLy8yLiBtZXJnaW5nIGl0IHdpdGggYWxyZWFkeSBtZXJnZWQgYXJyYXlzIHRoYXQgYXJlIHN0b3JlZCBpbiBcbi8vVGhlIHJlZHVjZSgpIG1ldGhvZCBleGVjdXRlcyBhIHJlZHVjZXIgLSBmdW5jdGlvbiB0aGF0IHlvdSBwcm92aWRlIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgYXJyYXksIHJlc3VsdGluZyBpbiBhIHNpbmdsZSBvdXRwdXQgdmFsdWVcbi8vVGhlIGNvbmNhdCgpIG1ldGhvZCBpcyB1c2VkIHRvIG1lcmdlIHR3byBvciBtb3JlIGFycmF5c1xuY29uc3QgcGFnZXMgPSBmaWdtYS5yb290LmNoaWxkcmVuLm1hcChwYWdlID0+ICh7XG4gICAgaWQ6IHBhZ2UuaWQsXG4gICAgbmFtZTogcGFnZS5uYW1lLFxuICAgIHR5cGU6IHBhZ2UudHlwZVxufSkpO1xucGFnZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdORVdSRVNVTFQnLFxuICAgICAgICBub2RlOiBlbGVtZW50XG4gICAgfSk7XG59KTtcbnRvcEZyYW1lcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ05FV1JFU1VMVCcsXG4gICAgICAgIG5vZGU6IGVsZW1lbnRcbiAgICB9KTtcbn0pO1xuaWYgKCh0b3BGcmFtZXMubGVuZ3RoICsgcGFnZXMubGVuZ3RoKSA+IDApIHtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdISUxJR0hURklSU1QnIH0pO1xufVxuLy9yZWNlbnRzLnB1c2gocGFnZXNbMF0sIHRvcEZyYW1lc1swXSwgdG9wRnJhbWVzWzJdKTtcbi8vY29uc29sZS5sb2cocmVjZW50cyk7XG52YXIgcmVjZW50czEgPSBmaWdtYS5yb290LmdldFBsdWdpbkRhdGEoXCJyZWNlbnRzMVwiKTtcbnZhciByZWNlbnRzMiA9IGZpZ21hLnJvb3QuZ2V0UGx1Z2luRGF0YShcInJlY2VudHMyXCIpO1xudmFyIHJlY2VudHMzID0gZmlnbWEucm9vdC5nZXRQbHVnaW5EYXRhKFwicmVjZW50czNcIik7XG5pZiAocmVjZW50czEgIT0gXCJcIikge1xuICAgIHZhciByZWNlbnROb2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQocmVjZW50czEpO1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ1JFQ0VOVCcsXG4gICAgICAgIG5vZGU6IHtcbiAgICAgICAgICAgIGlkOiByZWNlbnROb2RlLmlkLFxuICAgICAgICAgICAgbmFtZTogcmVjZW50Tm9kZS5uYW1lLFxuICAgICAgICAgICAgdHlwZTogcmVjZW50Tm9kZS50eXBlXG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmVsc2Uge1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ05PUkVDRU5UUycgfSk7XG59XG5pZiAocmVjZW50czIgIT0gXCJcIikge1xuICAgIHZhciByZWNlbnROb2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQocmVjZW50czIpO1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ1JFQ0VOVCcsXG4gICAgICAgIG5vZGU6IHtcbiAgICAgICAgICAgIGlkOiByZWNlbnROb2RlLmlkLFxuICAgICAgICAgICAgbmFtZTogcmVjZW50Tm9kZS5uYW1lLFxuICAgICAgICAgICAgdHlwZTogcmVjZW50Tm9kZS50eXBlXG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmlmIChyZWNlbnRzMyAhPSBcIlwiKSB7XG4gICAgdmFyIHJlY2VudE5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZChyZWNlbnRzMyk7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnUkVDRU5UJyxcbiAgICAgICAgbm9kZToge1xuICAgICAgICAgICAgaWQ6IHJlY2VudE5vZGUuaWQsXG4gICAgICAgICAgICBuYW1lOiByZWNlbnROb2RlLm5hbWUsXG4gICAgICAgICAgICB0eXBlOiByZWNlbnROb2RlLnR5cGVcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLyp2YXIgcmVjZW50c0FycmF5ID0gZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYygncmVjZW50cycpO1xuXG5yZWNlbnRzQXJyYXkudGhlbihmdW5jdGlvbihhc3luY1JlY2VudHMpIHtcbiAgaWYgKGFzeW5jUmVjZW50cy5sZW5ndGggIT0gMCkge1xuICAgIGFzeW5jUmVjZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnUkVDRU5UJyxcbiAgICAgICAgbm9kZTogZWxlbWVudFxuICAgICAgfSk7XG4gICAgfSlcbiAgfVxuICBlbHNlIHtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICB0eXBlOiAnTk9SRUNFTlRTJ1xuICAgIH0pO1xuICB9XG59KTsqL1xuLypyZWNlbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICB0eXBlOiAnUkVDRU5UJyxcbiAgICBub2RlOiBlbGVtZW50XG4gIH0pO1xufSk7Ki9cbi8vZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYygncmVjZW50cycsIHJlY2VudHMpO1xuZmlnbWEudWkub25tZXNzYWdlID0gbWVzc2FnZSA9PiB7XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ0NMT1NFJykge1xuICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnQ0hFQ0snKSB7XG4gICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBwYWdlcykge1xuICAgICAgICAgICAgY29uc3Qgc2VhY2hOb2RlTmFtZSA9IG1lc3NhZ2Uuc2VhcmNoVmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVOYW1lID0gZWxlbWVudC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAobm9kZU5hbWUuaW5jbHVkZXMoc2VhY2hOb2RlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdORVdSRVNVTFQnLFxuICAgICAgICAgICAgICAgICAgICBub2RlOiBlbGVtZW50XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHRvcEZyYW1lcykge1xuICAgICAgICAgICAgY29uc3Qgc2VhY2hOb2RlTmFtZSA9IG1lc3NhZ2Uuc2VhcmNoVmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVOYW1lID0gZWxlbWVudC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAobm9kZU5hbWUuaW5jbHVkZXMoc2VhY2hOb2RlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdORVdSRVNVTFQnLFxuICAgICAgICAgICAgICAgICAgICBub2RlOiBlbGVtZW50XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnSElMSUdIVEZJUlNUJyB9KTtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gXCJKVU1QXCIpIHtcbiAgICAgICAgY29uc3Qgbm9kZUlkID0gbWVzc2FnZS5pZDtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGZpZ21hLmdldE5vZGVCeUlkKG5vZGVJZCk7XG4gICAgICAgIC8vIENoYW5nZSBQYWdlXG4gICAgICAgIGlmIChub2RlLnBhcmVudC50eXBlID09PSBcIlBBR0VcIikge1xuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UgPSBub2RlLnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICAvLyBTZWxlY3QgdGhlIE5vZGVcbiAgICAgICAgaWYgKG5vZGUudHlwZSAhPT0gXCJET0NVTUVOVFwiICYmIG5vZGUudHlwZSAhPT0gXCJQQUdFXCIpIHtcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IFtub2RlXTtcbiAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbbm9kZV0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIFBhZ2VcbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJQQUdFXCIpIHtcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlID0gbm9kZTtcbiAgICAgICAgfVxuICAgICAgICAvL1JlY2VudHMgbWFnaWMgLS0tLS0tLSAtLS0tLSAtLS0tLS0gLS0tLS0tXG4gICAgICAgIHZhciByZWNlbnRzMSA9IGZpZ21hLnJvb3QuZ2V0UGx1Z2luRGF0YShcInJlY2VudHMxXCIpO1xuICAgICAgICB2YXIgcmVjZW50czIgPSBmaWdtYS5yb290LmdldFBsdWdpbkRhdGEoXCJyZWNlbnRzMlwiKTtcbiAgICAgICAgaWYgKHJlY2VudHMxICE9IFwiXCIpIHtcbiAgICAgICAgICAgIGZpZ21hLnJvb3Quc2V0UGx1Z2luRGF0YShcInJlY2VudHMyXCIsIHJlY2VudHMxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVjZW50czIgIT0gXCJcIikge1xuICAgICAgICAgICAgZmlnbWEucm9vdC5zZXRQbHVnaW5EYXRhKFwicmVjZW50czNcIiwgcmVjZW50czIpO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLnJvb3Quc2V0UGx1Z2luRGF0YShcInJlY2VudHMxXCIsIG5vZGVJZCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coZmlnbWEucm9vdC5nZXRQbHVnaW5EYXRhKFwicmVjZW50czFcIikpO1xuICAgICAgICAvKlxuICAgICAgICB2YXIgc3RvcmFnZSA9IGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoJ3JlY2VudHMnKTtcbiAgICAgICAgXG4gICAgICAgIHN0b3JhZ2UudGhlbihmdW5jdGlvbihhc3luY1JlY2VudHMpIHtcbiAgICAgICAgICB2YXIgbmV3UmVjZW50cyA9IFtdO1xuICAgIFxuICAgICAgICAgIG5ld1JlY2VudHMucHVzaCh7XG4gICAgICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgICAgIG5hbWU6IG5vZGUubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IG5vZGUudHlwZVxuICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgIG5ld1JlY2VudHMucHVzaChhc3luY1JlY2VudHNbMF0pO1xuICAgICAgICAgIG5ld1JlY2VudHMucHVzaChhc3luY1JlY2VudHNbMV0pO1xuICAgICAgICAgIFxuICAgICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoJ3JlY2VudHMnLCBuZXdSZWNlbnRzKTtcbiAgICAgICAgfSk7Ki9cbiAgICAgICAgLy9maWdtYS5jbG9zZVBsdWdpbigpO1xuICAgIH1cbn07XG4iXSwic291cmNlUm9vdCI6IiJ9