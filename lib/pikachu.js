const Util = require('./util'),
      Ball = require('./ball'),
      spriteStanding = new Image(),
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

Pikachu.prototype.checkCollisions = function (otherObject) {
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

module.exports = Pikachu;
