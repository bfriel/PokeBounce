const Util = require('./util'),
      Ball = require('./ball'),
      Lightning = require('./lightning'),
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
