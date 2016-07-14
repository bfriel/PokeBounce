const Ball = require('./ball'),
      Pikachu = require('./pikachu'),
      Lightning = require('./lightning'),
      Util = require('./util');

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
