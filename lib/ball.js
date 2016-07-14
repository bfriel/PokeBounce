const Util = require('./util');

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

const BOUNCE = {
  1: -7.25,
  2: -8,
  3: -10,
  4: -12,
  5: -14
};

Ball.prototype.draw = function(ctx) {
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

  if (this.pos[1] >= 590 - this.radius) {
    this.vel[1] = BOUNCE[this.size];
  }

  if (this.pos[0] >= 1000 - (1.8 * this.radius)) {
    this.vel[0] = -2;
  } else if (this.pos[0] <= (0.2 * this.radius)) {
    this.vel[0] = 2;
  }
};

module.exports = Ball;
