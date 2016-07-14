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
	      Pikachu = __webpack_require__(6),
	      Util = __webpack_require__(4);
	
	
	const Game = function () {
	  this.balls = [];
	  this.level = 1;
	  this.pikachu = new Pikachu([500, 580], this);
	
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
	  return[].concat(this.balls, this.pikachu);
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
	
	Game.prototype.bindKeys = function () {
	  document.addEventListener("keydown", keyDownHandler.bind(this), false);
	  document.addEventListener("keyup", keyUpHandler.bind(this), false);
	};
	
	function keyDownHandler(e) {
	  if (e.keyCode === 37) {
	    this.pikachu.direction = "left";
	  } else if (e.keyCode === 39) {
	    this.pikachu.direction = "right";
	  }
	}
	
	function keyUpHandler(e) {
	  if (e.keyCode === 37) {
	    if (this.pikachu.direction !== "right") {
	      this.pikachu.direction = "stay";
	    }
	  }
	  else if (e.keyCode === 39) {
	    if (this.pikachu.direction !== "left") {
	      this.pikachu.direction = "stay";
	    }
	  }
	}
	
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
	  this.game.bindKeys();
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
	
	const ballType = new Image();
	
	const Ball = function(options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.size = options.size;
	  this.radius = this.size * 10;
	
	  ballType.src = TYPES[this.size];
	};
	
	const TYPES = {
	  1: './assets/Pokeball.png',
	  2: './assets/Greatball.png',
	  3: './assets/Ultraball.png',
	  4: './assets/Masterball.png'
	};
	
	const BOUNCE_FACTORS = {
	  1: -7.25,
	  2: -8,
	  3: -10,
	  4: -12,
	  5: -14
	};
	
	Ball.prototype.draw = function (ctx) {
	
	  ctx.drawImage(ballType, this.pos[0], this.pos[1], this.size * 20, this.size * 20);
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
/* 5 */,
/* 6 */
/***/ function(module, exports) {

	const spriteStanding = new Image(),
	      spriteLeft = new Image(),
	      spriteRight = new Image();
	
	spriteStanding.src = './assets/StandingPika.png';
	spriteLeft.src = './assets/SpriteLeft.gif';
	spriteRight.src = './assets/SpriteRight.gif';
	
	
	const Pikachu = function(pos, game) {
	  this.pos = pos;
	  this.vel = [0, 0];
	  this.radius = 20;
	  this.game = game;
	  this.direction = "stay";
	};
	
	Pikachu.prototype.draw = function (ctx) {
	  if (this.direction === "left"){
	    ctx.drawImage(spriteLeft, this.pos[0], this.pos[1] - 70, 90, 90);
	  } else if (this.direction === "right") {
	    ctx.drawImage(spriteRight, this.pos[0], this.pos[1] - 70, 90, 90);
	  } else {
	    ctx.drawImage(spriteStanding, this.pos[0], this.pos[1] - 70, 90, 90);
	  }
	};
	
	Pikachu.prototype.move = function () {
	  if (this.direction === "right") {
	     if (this.pos[0] < 920) {
	       this.pos[0] += 4;
	     }
	   } else if (this.direction === "left") {
	     if (this.pos[0] > 0) {
	       this.pos[0] += -4;
	     }
	   }
	};
	
	module.exports = Pikachu;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map