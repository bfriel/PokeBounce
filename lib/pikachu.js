const Util = require('./util'),
      Ball = require('./ball'),
      Lightning = require('./lightning'),
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
