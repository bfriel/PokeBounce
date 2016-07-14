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
	      GameView = __webpack_require__(6);
	
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

	const Ball = __webpack_require__(2),
	      Pikachu = __webpack_require__(4),
	      Lightning = __webpack_require__(5),
	      Util = __webpack_require__(3);
	
	const PikaLives = new Image();
	PikaLives.src = "./assets/PikaFace.png";
	
	const Game = function() {
	  this.balls = [];
	  this.level = 1;
	  this.pikachu = new Pikachu([450, 510], this);
	  this.populateBalls();
	  this.gameOver = false;
	};
	
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	
	const LEVELS = Util.LEVELS;
	
	Game.prototype.populateBalls = function() {
	  let self = this;
	  LEVELS[this.level].forEach( (ball) => {
	    self.balls.push(new Ball({pos: [ball.startX, 500], vel: [2, 2], size: ball.size, game: this}));
	  });
	};
	
	Game.prototype.allObjects = function() {
	  return [].concat(this.pikachu, this.balls);
	};
	
	Game.prototype.draw = function(ctx) {
	  ctx.clearRect(0, 0, 1000, 600);
	  this.allObjects().forEach( (object) => {
	    object.draw(ctx);
	  });
	  for (var i = 0; i < this.pikachu.lives; i++) {
	    ctx.drawImage(PikaLives, i * (50) , 10, 50, 50);
	  }
	  ctx.fillText("Level:" + this.level, 930, 30);
	};
	
	Game.prototype.step = function() {
	  this.moveObjects();
	  this.checkCollisions();
	  this.checkWin();
	};
	
	Game.prototype.moveObjects = function() {
	  this.allObjects().forEach( (object) => {
	    object.move();
	  });
	};
	
	Game.prototype.checkCollisions = function() {
	  for (var pika = 0; pika < 1; pika++) {
	    for (var ball = pika + 1; ball < this.allObjects().length; ball++) {
	      this.allObjects()[pika].checkCollisions(this.allObjects()[ball]);
	    }
	  }
	};
	
	Game.prototype.pikaHit = function() {
	  this.pikachu.lives -= 1;
	  window.paused = true;
	  this.balls = [];
	  if (this.pikachu.lives === 0) {
	    console.log("GAME OVER");
	    this.gameOver = true;
	  } else {
	    this.pikachu.shooting = false;
	    this.pikachu.pos = [450, 510];
	    this.populateBalls();
	  }
	  window.paused = false;
	};
	
	Game.prototype.destroyBall = function(ball) {
	  this.balls.splice(this.balls.indexOf(ball), 1);
	};
	
	Game.prototype.splitBall = function(ball) {
	  this.destroyBall(ball);
	
	  this.addBall({ posX: ball.pos[0], posY: ball.pos[1], vel: [2, -6.25], size: (ball.size - 1)});
	  this.addBall({ posX: ball.pos[0], posY: ball.pos[1], vel: [-2, -6.25], size: (ball.size - 1)});
	};
	
	Game.prototype.checkWin = function () {
	  if (this.balls.length === 0 && this.pikachu.lives > 0) {
	    if (this.level < 5) {
	      this.level += 1;
	      this.balls = [];
	      this.populateBalls();
	    } else {
	      this.gameWon = true;
	    }
	  }
	};
	
	Game.prototype.addBall = function (ball) {
	  this.balls.push(new Ball({ pos: [ball.posX, ball.posY], vel: ball.vel, size: ball.size, game: this}));
	};
	
	Game.prototype.bindKeys = function() {
	  document.addEventListener("keydown", keyDownHandler.bind(this), false);
	  document.addEventListener("keyup", keyUpHandler.bind(this), false);
	};
	
	
	function keyDownHandler(e) {
	  if (e.keyCode === 37) {
	    this.pikachu.direction = "left";
	  } else if (e.keyCode === 39) {
	    this.pikachu.direction = "right";
	  } else if (e.keyCode === 32) {
	    this.pikachu.shoot(this.ctx);
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

	const Util = __webpack_require__(3);
	
	const Ball = function(options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.size = options.size;
	  this.radius = this.size * 10;
	  this.game = options.game;
	  this.ballType = new Image();
	  this.ballType.src = TYPES[this.size];
	};
	
	const TYPES = {
	  1: './assets/Pokeball.png',
	  2: './assets/Pokeball.png',
	  3: './assets/Greatball.png',
	  4: './assets/Ultraball.png',
	  5: './assets/Masterball.png'
	};
	
	const BOUNCE = {
	  1: -7.25,
	  2: -8,
	  3: -10,
	  4: -12,
	  5: -14,
	  6: -16
	};
	
	Ball.prototype.draw = function(ctx) {
	  ctx.drawImage(this.ballType, this.pos[0], this.pos[1], this.size * 20, this.size * 20);
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
	
	  if (this.pos[1] >= 590 - this.radius) {
	    this.vel[1] = BOUNCE[this.size];
	  }
	
	  if (this.pos[0] >= 1000 - (1.8 * this.radius)) {
	    this.vel[0] = -2;
	  } else if (this.pos[0] <= (0.2 * this.radius)) {
	    this.vel[0] = 2;
	  }
	  this.checkCeiling();
	};
	
	Ball.prototype.checkCeiling = function () {
	  if (this.pos[1] <= 0) {
	    this.game.destroyBall(this);
	  }
	};
	
	module.exports = Ball;


/***/ },
/* 3 */
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
	 ],
	
	 5: [
	   { startX: 0, size: 5 },
	   { startX: -200, size: 5 }
	 ]
	};
	
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3),
	      Ball = __webpack_require__(2),
	      Lightning = __webpack_require__(5),
	      spriteStanding = new Image(),
	      spriteLeft = new Image(),
	      spriteRight = new Image();
	
	spriteStanding.src = './assets/StandingPika.png';
	spriteLeft.src = './assets/SpriteLeft.gif';
	spriteRight.src = './assets/SpriteRight.gif';
	
	
	const Pikachu = function(pos, game) {
	  this.pos = pos;
	  this.game = game;
	  this.vel = [0, 0];
	  this.radius = 20;
	  this.direction = "stay";
	  this.shooting = false;
	  this.lives = 3;
	};
	
	Pikachu.prototype.draw = function(ctx) {
	  if (this.shooting) {
	    this.bolt.step();
	    ctx.drawImage(spriteStanding, this.pos[0], this.pos[1], 90, 90);
	  } else {
	    if (this.direction === "left"){
	      ctx.drawImage(spriteLeft, this.pos[0], this.pos[1], 90, 90);
	    } else if (this.direction === "right") {
	      ctx.drawImage(spriteRight, this.pos[0], this.pos[1], 90, 90);
	    } else {
	      ctx.drawImage(spriteStanding, this.pos[0], this.pos[1], 90, 90);
	    }
	  }
	};
	
	Pikachu.prototype.move = function() {
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
	
	Pikachu.prototype.checkCollisions = function(otherObject) {
	  if (Util.distance(
	    this.pos, otherObject.pos) < this.radius + otherObject.radius
	  ) {
	    this.collideWith(otherObject);
	  } else {
	    return;
	  }
	};
	
	Pikachu.prototype.collideWith = function(otherObject) {
	  if (otherObject.__proto__ === Ball.prototype) {
	    this.game.pikaHit();
	  }
	};
	
	Pikachu.prototype.shoot = function() {
	  if (this.shooting === false) {
	    this.shooting = true;
	    this.bolt = new Lightning(this.pos.slice(), this);
	  }
	};
	
	module.exports = Pikachu;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	
	const bolt = new Image();
	bolt.src = './assets/Lightning.png';
	
	const Lightning = function(startPos, pikachu) {
	  this.startPos = startPos;
	  this.endPos = startPos;
	  this.pikachu = pikachu;
	  this.vel = [0, 10];
	};
	
	Lightning.prototype.draw = function(ctx) {
	  if (this.pikachu.shooting) {
	    window.ctx.drawImage(bolt, this.startPos[0], this.endPos[1], 40, 600 - this.endPos[1]);
	  }
	};
	
	Lightning.prototype.move = function() {
	  this.endPos[1] -= this.vel[1];
	};
	
	Lightning.prototype.step = function() {
	  this.move();
	  this.checkBall();
	  this.checkCeiling();
	  this.draw();
	};
	
	Lightning.prototype.checkCeiling = function() {
	  if (this.endPos[1] <= 0) {
	    this.pikachu.shooting = false;
	  }
	};
	
	Lightning.prototype.checkBall = function () {
	  let self = this;
	  this.pikachu.game.balls.forEach( (ball) => {
	    if (
	      (ball.pos[0] - ball.radius <= self.startPos[0]) &&
	      (ball.pos[0] + ball.radius >= self.startPos[0]) &&
	      (ball.pos[1] + ball.radius >= self.startPos[1])
	    )
	      {
	        if (ball.size > 1) {
	          self.pikachu.game.splitBall(ball);
	        } else {
	          self.pikachu.game.destroyBall(ball);
	        }
	        self.pikachu.shooting = false;
	      }
	  });
	};
	
	module.exports = Lightning;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	
	const GameView = function(game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	};
	
	GameView.prototype.start = function() {
	  requestAnimationFrame(this.animate.bind(this));
	  this.game.bindKeys();
	  window.ctx = this.ctx;
	  window.paused = false;
	};
	
	GameView.prototype.animate = function () {
	    this.game.step();
	    this.game.draw(this.ctx);
	    requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map