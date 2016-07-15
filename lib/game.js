const Ball = require('./ball'),
      Pikachu = require('./pikachu'),
      Lightning = require('./lightning'),
      Util = require('./util'),
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
