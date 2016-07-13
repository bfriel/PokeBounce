const Game = require("./game"),
      GameView = require("./game_view");

document.addEventListener("DOMContentLoaded", function() {
  const gameCanvas = document.getElementById("game-canvas");
  gameCanvas.width = Game.DIM_X;
  gameCanvas.height = Game.DIM_Y;

  const ctx = gameCanvas.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();
});
