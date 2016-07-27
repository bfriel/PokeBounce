const Util = require('./util.js'),
      bolt = new Image(),
      lBolt = new Audio('https://s3-us-west-2.amazonaws.com/pokebounce/ElectricShock.mp3');


bolt.src = './assets/Lightning.png';

const Lightning = function(startPos, pikachu) {
  this.startPos = startPos;
  this.endPos = startPos;
  this.pikachu = pikachu;
  this.vel = [0, 10];
  lBolt.play();
};

Lightning.prototype.draw = function(ctx) {
  if (this.pikachu.shooting) {
    window.ctx.drawImage(bolt, (this.startPos[0] + 10), this.endPos[1], 40, 600 - this.endPos[1]);
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
    lBolt.pause();
    lBolt.currentTime = 0;
  }
};

Lightning.prototype.checkBall = function () {
  let self = this;
  this.pikachu.game.balls.forEach( (ball) => {
    if (
      (ball.pos[0] - ball.radius - 20 <= self.startPos[0]) &&
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
        lBolt.pause();
        lBolt.currentTime = 0;
      }
  });
};

module.exports = Lightning;
