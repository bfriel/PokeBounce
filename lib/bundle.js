/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1),
	      GameView = __webpack_require__(2);
	
	document.addEventListener("DOMContentLoaded", function() {
	  const gameCanvas = document.getElementById("game-canvas");
	  gameCanvas.width = Game.DIM_X;
	  gameCanvas.height = Game.DIM_Y;
	
	  const ctx = gameCanvas.getContext("2d");
	  const game = new Game();
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Ball = __webpack_require__(3),
	      Util = __webpack_require__(4);
	
	
	const Game = function () {
	  this.balls = [];
	  this.level = 1;
	
	  this.addBalls();
	};
	
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	
	const LEVELS = Util.LEVELS;
	
	Game.prototype.addBalls = function() {
	  let self = this;
	  LEVELS[this.level].forEach( (ball) => {
	    self.balls.push(new Ball({pos: [ball.startX, 500], vel: [2, 2], size: ball.size}));
	  });
	};
	
	Game.prototype.allObjects = function () {
	  return[].concat(this.balls);
	};
	
	Game.prototype.draw = function (ctx) {
	  ctx.clearRect(0, 0, 1000, 600);
	  this.allObjects().forEach( (object) => {
	    object.draw(ctx);
	  });
	};
	
	Game.prototype.step = function() {
	  this.moveObjects();
	};
	
	Game.prototype.moveObjects = function() {
	  this.allObjects().forEach(function(object) {
	    object.move();
	  });
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1),
	      key = __webpack_require__(5);
	
	
	const GameView = function(game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	};
	
	GameView.prototype.start = function() {
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function () {
	  this.game.step();
	  this.game.draw(this.ctx);
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	
	const Pokeball = new Image();
	
	const Ball = function(options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.size = options.size;
	  this.radius = this.size * 10;
	
	  Pokeball.src = TYPES[this.size];
	};
	
	const TYPES = {
	  1: './assets/Pokeball.png',
	  2: './assets/Greatball.png',
	  3: './assets/Ultraball.png',
	  4: './assets/Masterball.png'
	};
	
	const BOUNCE_FACTORS = {
	  1: -6,
	  2: -8,
	  3: -10,
	  4: -12,
	  5: -14
	};
	
	Ball.prototype.draw = function (ctx) {
	
	  ctx.drawImage(Pokeball, this.pos[0], this.pos[1], this.size * 20, this.size * 20);
	  ctx.beginPath();
	
	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    false
	  );
	
	};
	
	Ball.prototype.move = function() {
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	  this.vel[1] += 0.2;
	
	
	  if (this.pos[1] >= 590) {
	    this.vel[1] = BOUNCE_FACTORS[this.size];
	  }
	
	  if (this.pos[0] >= 1000 - this.radius) {
	    this.vel[0] = -2;
	  } else if (this.pos[0] <= this.radius) {
	    this.vel[0] = 2;
	  }
	
	};
	
	module.exports = Ball;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const Util = {
	
	  inherits(ChildClass, ParentClass) {
	    const Surrogate = function () {};
	    Surrogate.prototype = ParentClass.prototype;
	    ChildClass.prototype = new Surrogate();
	    ChildClass.prototype.constructor = this;
	  },
	
	  distance(pos1, pos2) {
	    let dX = pos1[0] - pos2[0];
	    let dY = pos1[1] - pos2[1];
	    let dist = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
	    return dist;
	  }
	
	};
	
	
	Util.LEVELS = {
	  1: [
	   { startX: 0, size: 1 },
	   { startX: -200, size: 1 },
	 ],
	
	 2: [
	   { startX: 0, size: 2 },
	   { startX: -200, size: 2 }
	 ],
	
	 3: [
	   { startX: 0, size: 3 },
	   { startX: -200, size: 3 }
	 ],
	
	 4: [
	   { startX: 0, size: 4 },
	   { startX: -200, size: 4 }
	 ]
	};
	
	
	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.
	
	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];
	
	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;
	
	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }
	
	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }
	
	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  }
	
	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;
	
	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }
	
	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);
	
	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;
	
	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;
	
	    scope = getScope();
	
	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];
	
	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };
	
	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);
	
	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }
	
	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };
	
	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };
	
	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }
	
	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };
	
	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;
	
	    multipleKeys = getKeys(key);
	
	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');
	
	      if (keys.length > 1) {
	        mods = getMods(keys);
	      }
	
	      key = keys[keys.length - 1];
	      key = code(key);
	
	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };
	
	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }
	
	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }
	
	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }
	
	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;
	
	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };
	
	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;
	
	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };
	
	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }
	
	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }
	
	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };
	
	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);
	
	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);
	
	  // store previously defined key
	  var previousKey = global.key;
	
	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }
	
	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;
	
	  if(true) module.exports = assignKey;
	
	})(this);


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map