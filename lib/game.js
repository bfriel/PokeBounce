const Ball = require('./ball'),
      Util = require('./util');


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
  this.allObjects().forEach( (object) => {
    object.draw(ctx);
  });
};

module.exports = Game;
