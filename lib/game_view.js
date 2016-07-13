const Game = require('./game'),
      key = require("../vendor/keymaster.js");


const GameView = function(game, ctx) {
  this.ctx = ctx;
  this.game = game;
};

GameView.prototype.start = function() {
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function () {
  this.game.step();
  this.game.draw(this.ctx);
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
