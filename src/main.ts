import { setupApp } from "./utils/setupApp.js";
import { GameController } from "./controllers/GameController.js";
import { Player } from "./models/Player.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const intervalDisplay = document.getElementById(
  "interval-display"
) as HTMLDivElement;
const scoreController = setupApp(canvas);

const player1 = new Player("player1", "Player 1", true);
const player2 = new Player("player2", "Player 2", true); // later could be remote

const gameController = new GameController(
  canvas,
  scoreController,
  [player1, player2],
  intervalDisplay
);
gameController.initializeGame();
