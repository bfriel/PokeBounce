# Poke Bounce

[Live Link][gh-p]

[gh-p]: https://bfriel.github.io/PokeBounce/

Capitalizing on the latest Pokemon craze, PokeBounce is an addicting browser game built with JavaScript and HTML5 Canvas.
Users play as Pikachu as they shoot lightning to fend off 5 waves of bouncing pokeballs. Get hit by a pokeball 5 times, and its game over!
When a larger pokeball is shot, it will split into 2 smaller pokeballs. Try to chain strikes so that pokeballs hit the ceiling!

[![LEVEL 3 DEMO](https://img.youtube.com/vi/mvNd4VvSe18/0.jpg "Level 3 Demo")](https://www.youtube.com/watch?v=mvNd4VvSe18)

## Features

### Customized Sprite Animation

To draw a 'running' Pikachu in HTML5 Canvas, I came up with my own animation that reacts to user keystrokes.
Example: When a user hits the left arrow key, a series of 4 images will be rendered depending on a running count that increments with each step of the game:

```javascript
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
```

### Dynamically Set Images

The type of pokeball shown (i.e. Greatball, Ultraball) is determined based on the size of the pokeball. When a large pokeball is split into two smaller pokeballs, the images of the smaller pokeballs are dynamically set to represent the new pokeball.

```javascript
const Ball = function(options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.size = options.size;
  this.radius = this.size * 10;
  this.game = options.game;
  this.ballType = new Image();
  this.ballType.src = TYPES[this.size];
};

const TYPES = {
  1: './assets/Pokeball.png',
  2: './assets/Pokeball.png',
  3: './assets/Greatball.png',
  4: './assets/Ultraball.png',
  5: './assets/Masterball.png',
};

const BOUNCE = {
  1: -7.25,
  2: -8,
  3: -10,
  4: -12,
  5: -14,
};

Ball.prototype.draw = function(ctx) {
  ctx.drawImage(this.ballType, this.pos[0], this.pos[1], this.size * 20, this.size * 20);
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
```

### Amazon Web Services (AWS)

To recreate the 1990's Pokemon nostalgia, I integrated Amazon Web Services for retro sound effects. These retro sound effects are played played on specific user input and in-game situations.

Example: When a user presses the spacebar to initialize the game, Pikachu makes his trademarked cry.

```javascript
function keyDownHandler(e) {
  if (e.keyCode === 37) {
    this.pikachu.direction = "left";
  } else if (e.keyCode === 39) {
    this.pikachu.direction = "right";
  } else if (e.keyCode === 32) {
    if (!this.initialized) {
      if (this.gameLost || this.gameWon) {
        this.signalNewGame = true;
        victorySong.pause();
        victorySong.currentTime = 0;
      } else {
        this.initialized = true;
        pikaStart.play();
      }
    } else {
      this.pikachu.shoot(this.ctx);
    }
  }
}
```

The result: [Pikachu Cry](https://s3-us-west-2.amazonaws.com/pokebounce/Pikachu.mp3)
