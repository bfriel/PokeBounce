const Game = require('./game');

const GameView = function(game, ctx) {
  this.ctx = ctx;
  this.game = game;
};

GameView.prototype.start = function() {
  requestAnimationFrame(this.animate.bind(this));
  this.game.bindKeys();
  window.ctx = this.ctx;
  window.paused = false;
};

GameView.prototype.animate = function () {
    this.game.step(this.ctx);
    this.game.draw(this.ctx);
    requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
