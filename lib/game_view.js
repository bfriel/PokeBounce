const Game = require('./game');

const GameView = function(game, ctx) {
  this.ctx = ctx;
  this.game = game;
};

GameView.prototype.start = function() {
  requestAnimationFrame(this.animate.bind(this));
  this.game.bindKeys();
  window.ctx = this.ctx;
};

GameView.prototype.animate = function () {
  this.game.step();
  this.game.draw(this.ctx);
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
