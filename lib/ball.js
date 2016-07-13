const Util = require('./util');

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
