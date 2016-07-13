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
	    self.balls.push(new Ball({pos: [ball.startX, 500], vel: [2, 2], size: ball.size, game: self}));
	  });
	};
	
	Game.prototype.allObjects = function () {
	  return[].concat(this.balls);
	};
	
	Game.prototype.draw = function (ctx) {
	  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
	  ctx.fillStyle = "#FFFF00";
	  this.allObjects().forEach( (object) => {
	    object.draw(ctx);
	  });
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	
	const GameView = function(game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	};
	
	GameView.prototype.start = function() {
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function () {
	  this.game.draw(this.ctx);
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	
	const Ball = function(options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.size = options.size;
	  this.radius = this.size * 10;
	  this.color = COLORS[this.size];
	  this.game = options.game;
	};
	
	const COLORS = {
	  1: "#FF0000", //red
	  2: "#00FF00", //green
	  3: "#0000FF", //blue
	  4: "#800080"  //purple
	};
	
	const BOUNCE_FACTORS = {
	  1: -5,
	  2: -8,
	  3: -10,
	  4: -12,
	  5: -14
	};
	
	Ball.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	
	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    false
	  );
	
	  ctx.fill();
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
	};
	
	
	module.exports = Util;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map