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
	      Util = __webpack_require__(3),
	      pikaLives = new Image(),
	      pikaStart = new Audio('https://s3-us-west-2.amazonaws.com/pokebounce/Pikachu.mp3'),
	      pikaOuch = new Audio('https://s3-us-west-2.amazonaws.com/pokebounce/Pikaaaa.mp3'),
	      pikaLost = new Audio('https://s3-us-west-2.amazonaws.com/pokebounce/PikaSad.mp3'),
	      pikaWon = new Audio('https://s3-us-west-2.amazonaws.com/pokebounce/Pika+Pika+Happy.mp3'),
	      victorySong = new Audio('https://s3-us-west-2.amazonaws.com/pokebounce/victorysong.mp3'),
	      spaceBar = new Image(),
	      arrowKeys = new Image();
	
	pikaLives.src = './assets/PikaFace.png';
	spaceBar.src = './assets/SpaceBar.png';
	arrowKeys.src = './assets/ArrowKeys.png';
	
	const Game = function() {
	  this.balls = [];
	  this.level = 1;
	  this.pikachu = new Pikachu([450, 510], this);
	  this.score = 0;
	  this.populateBalls();
	  this.gameLost = false;
	  this.gameWon = false;
	  this.signalNewGame = false;
	  this.initialized = false;
	};
	
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	
	const LEVELS = Util.LEVELS;
	
	Game.prototype.populateBalls = function() {
	  let self = this;
	  LEVELS[this.level].forEach( (ball) => {
	    self.balls.push(new Ball({pos: [ball.startX, 500], vel: ball.vel, size: ball.size, game: this}));
	  });
	};
	
	Game.prototype.allObjects = function() {
	  return [].concat(this.pikachu, this.balls);
	};
	
	Game.prototype.draw = function(ctx) {
	  ctx.clearRect(0, 0, 1000, 600);
	  if (this.initialized) {
	    this.allObjects().forEach( (object) => {
	      object.draw(ctx);
	    });
	    for (var i = 0; i < this.pikachu.lives; i++) {
	      ctx.drawImage(pikaLives, i * (50) , 10, 50, 50);
	    }
	    ctx.font = "32px Roboto";
	    ctx.fillStyle = "#F6D800";
	    ctx.fillText(this.score, 900, 50);
	  } else {
	    this.pikachu.draw(ctx);
	    ctx.font = "64px Roboto";
	    ctx.fillStyle = "#F6D800";
	      if (this.gameWon) {
	        ctx.fillText("YOU WIN!!", 335, 270);
	        ctx.font = "24px Roboto";
	        ctx.fillText("Press SPACE to play again", 345, 400);
	      } else if (this.gameLost) {
	        ctx.fillText("YOU LOSE", 335, 270);
	        ctx.font = "24px Roboto";
	        ctx.fillText("Press SPACE to play again", 345, 400);
	        ctx.font = "32px Roboto";
	        ctx.fillStyle = "#F6D800";
	        ctx.fillText(this.score, 900, 50);
	      } else {
	        if (this.level === 1 && this.pikachu.lives === 5) {
	          ctx.fillText("Move", 225, 100);
	          ctx.drawImage(arrowKeys, 500, 20, 140, 100);
	          ctx.fillText("Shoot", 225, 250);
	          ctx.drawImage(spaceBar, 500, 190, 400, 75);
	          ctx.font = "16px Roboto";
	          ctx.fillText("Shoot and Avoid Pokeballs to Stay Alive", 350, 360);
	          ctx.fillText("Clear 5 Levels of Pokeballs to Win", 375, 400);
	          ctx.fillText("Press SPACE to Begin!", 410, 440);
	        } else {
	          for (var j = 0; j < this.pikachu.lives; j++) {
	            ctx.drawImage(pikaLives, j * (50) , 10, 50, 50);
	          }
	          ctx.fillText("Level " + this.level, 400, 270);
	          ctx.font = "32px Roboto";
	          ctx.fillStyle = "#F6D800";
	          ctx.fillText(this.score, 900, 50);
	        }
	      }
	  }
	};
	
	Game.prototype.step = function() {
	  if (this.initialized) {
	    this.pikachu.count += 1;
	    this.moveObjects();
	    this.checkCollisions();
	    this.checkWin();
	  } else {
	    this.checkRestart();
	  }
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
	  pikaOuch.play();
	  window.paused = true;
	  this.balls = [];
	  this.initialized = false;
	  if (this.pikachu.lives === 0) {
	    this.gameLost = true;
	    pikaLost.play();
	  } else {
	    this.pikachu.shooting = false;
	    this.pikachu.pos = [450, 510];
	    this.populateBalls();
	  }
	  window.paused = false;
	};
	
	Game.prototype.destroyBall = function(ball) {
	  this.balls.splice(this.balls.indexOf(ball), 1);
	  this.score += 10;
	};
	
	Game.prototype.splitBall = function(ball) {
	  this.destroyBall(ball);
	
	  this.addBall({ posX: ball.pos[0], posY: ball.pos[1], vel: [2, -6.25], size: (ball.size - 1)});
	  this.addBall({ posX: ball.pos[0], posY: ball.pos[1], vel: [-2, -6.25], size: (ball.size - 1)});
	  this.score += 5;
	};
	
	Game.prototype.checkWin = function () {
	  if (this.balls.length === 0 && this.pikachu.lives > 0) {
	    if (this.level < 5) {
	      pikaStart.play();
	      this.level += 1;
	      this.balls = [];
	      this.initialized = false;
	      this.pikachu.pos = [450, 510];
	      this.populateBalls();
	    } else {
	      if (this.gameWon === true) {
	        return;
	      }
	      this.gameWon = true;
	      pikaWon.play();
	      victorySong.play();
	    }
	  }
	};
	
	Game.prototype.checkRestart = function () {
	  if (this.signalNewGame) {
	    this.level = 1;
	    this.score = 0;
	    this.pikachu.lives = 5;
	    this.pikachu.pos = [450, 510];
	    this.gameLost = false;
	    this.gameWon = false;
	    this.signalNewGame = false;
	    this.balls = [];
	    this.populateBalls();
	    this.initialized = true;
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
	    if (!this.initialized) {
	      if (this.gameLost || this.gameWon) {
	        this.signalNewGame = true;
	      } else if (this.level === 1){
	        this.initialized = true;
	        pikaStart.play();
	      } else {
	        this.initialized = true;
	      }
	    } else {
	      this.pikachu.shoot(this.ctx);
	    }
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
	  5: './assets/Masterball.png',
	};
	
	const BOUNCE = {
	  1: -7.25,
	  2: -8,
	  3: -10,
	  4: -12,
	  5: -14,
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
	    this.game.score += 50;
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
	    { startX: 0, size: 2, vel: [2, 2] },
	    { startX: -100, size: 1, vel: [2, 2] },
	    { startX: -200, size: 2, vel: [2, 2] },
	    { startX: -300, size: 1, vel: [2, 2] }
	 ],
	
	 2: [
	   { startX: -100, size: 3, vel: [2, 2] },
	   { startX: 1100, size: 3, vel: [-2, 2] }
	 ],
	
	 3: [
	   { startX: 0, size: 4, vel: [2, 2] },
	   { startX: 1000, size: 3, vel: [-2, 2] },
	   { startX: 800, size: 2, vel: [-2, 2] },
	   { startX: 200, size: 1, vel: [2, 2] },
	 ],
	
	 4: [
	   { startX: 0, size: 4, vel: [2, 2] },
	   { startX: -200, size: 4, vel: [2, 2] },
	   { startX: 800, size: 4, vel: [-2, 2] },
	   { startX: 1000, size: 4, vel: [-2, 2] },
	 ],
	
	 5: [
	   { startX: -400, size: 1, vel: [2, 2] },
	   { startX: -500, size: 1, vel: [2, 2] },
	   { startX: -600, size: 1, vel: [2, 2] },
	   { startX: -700, size: 1, vel: [2, 2] },
	   { startX: 1400, size: 1, vel: [-2, 2] },
	   { startX: 1500, size: 1, vel: [-2, 2] },
	   { startX: 1600, size: 1, vel: [-2, 2] },
	   { startX: 1700, size: 1, vel: [-2, 2] },
	   { startX: 200, size: 5, vel: [0, 2] },
	   { startX: 700, size: 5, vel: [0, 2] },
	 ]
	};
	
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3),
	      Ball = __webpack_require__(2),
	      Lightning = __webpack_require__(5),
	      standing = new Image(),
	      left1 = new Image(),
	      left2 = new Image(),
	      left3 = new Image(),
	      left4 = new Image(),
	      right1 = new Image(),
	      right2 = new Image(),
	      right3 = new Image(),
	      right4 = new Image(),
	      lBolt = new Audio('https://s3-us-west-2.amazonaws.com/pokebounce/Blast.mp3');
	
	standing.src = './assets/StandingPika.png';
	left1.src = './assets/left1.png';
	left2.src = './assets/left2.png';
	left3.src = './assets/left3.png';
	left4.src = './assets/left4.png';
	right1.src = './assets/right1.png';
	right2.src = './assets/right2.png';
	right3.src = './assets/right3.png';
	right4.src = './assets/right4.png';
	
	
	const Pikachu = function(pos, game) {
	  this.pos = pos;
	  this.game = game;
	  this.vel = [0, 0];
	  this.radius = 20;
	  this.direction = "stay";
	  this.shooting = false;
	  this.lives = 5;
	  this.count = 0;
	};
	
	Pikachu.prototype.draw = function(ctx) {
	  if (this.shooting) {
	    this.bolt.step();
	    ctx.drawImage(standing, this.pos[0], this.pos[1], 90, 90);
	  } else {
	    if (this.direction === "left"){
	      if (this.count % 16 <= 4 ){
	        ctx.drawImage(left1, this.pos[0], this.pos[1], 90, 90);
	      } else if (this.count % 16 > 4 && this.count % 16 <= 8) {
	        ctx.drawImage(left2, this.pos[0], this.pos[1], 90, 90);
	      } else if (this.count % 16 > 8 && this.count % 16 <= 12) {
	        ctx.drawImage(left3, this.pos[0], this.pos[1], 90, 90);
	      } else if (this.count % 16 > 12 && this.count % 16 <= 16) {
	        ctx.drawImage(left4, this.pos[0], this.pos[1], 90, 90);
	      }
	    } else if (this.direction === "right") {
	      if (this.count % 16 <= 4 ){
	        ctx.drawImage(right1, this.pos[0], this.pos[1], 90, 90);
	      } else if (this.count % 16 > 4 && this.count % 16 <= 8) {
	        ctx.drawImage(right2, this.pos[0], this.pos[1], 90, 90);
	      } else if (this.count % 16 > 8 && this.count % 16 <= 12) {
	        ctx.drawImage(right3, this.pos[0], this.pos[1], 90, 90);
	      } else if (this.count % 16 > 12 && this.count % 16 <= 16) {
	        ctx.drawImage(right4, this.pos[0], this.pos[1], 90, 90);
	      }
	    } else {
	      ctx.drawImage(standing, this.pos[0], this.pos[1], 90, 90);
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
	    lBolt.play();
	    this.shooting = true;
	    this.bolt = new Lightning(this.pos.slice(), this);
	  }
	};
	
	module.exports = Pikachu;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3),
	      bolt = new Image();
	
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