const Ball = require('./ball'),
      Pikachu = require('./pikachu'),
      Lightning = require('./lightning'),
      Util = require('./util');


const Game = function() {
  this.balls = [];
  this.level = 1;
  this.pikachu = new Pikachu([500, 510], this);
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

Game.prototype.allObjects = function() {
  return [].concat(this.pikachu, this.balls);
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, 1000, 600);
  this.allObjects().forEach( (object) => {
    object.draw(ctx);
  });
};

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisions();
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

Game.prototype.bindKeys = function() {
  document.addEventListener("keydown", keyDownHandler.bind(this), false);
  document.addEventListener("keyup", keyUpHandler.bind(this), false);
};

Game.prototype.pikaHit = function() {
  return;
};

Game.prototype.destroyBall = function(ball) {
  this.balls.splice(this.balls.indexOf(ball), 1);
};

Game.prototype.splitBall = function(ball) {

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
