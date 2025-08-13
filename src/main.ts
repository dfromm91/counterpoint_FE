import { setupApp } from "./utils/setupApp.js";
import { GameController } from "./controllers/GameController.js";
import { Player } from "./models/Player.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const parts = location.pathname.split("/");
const roomId = parts[2] || "lobby";
let goingFirst = true;
let players: Player[] = [];

const socket = (window as any).io();

socket.emit("join_room", { roomId, name: "Player" });

socket.on("player_joined", (p: any) => {
  goingFirst = false;
});

const intervalDisplay = document.getElementById(
  "interval-display"
) as HTMLDivElement;
const scoreController = setupApp(canvas);

const player1 = new Player("player1", "Player 1", true);
const player2 = new Player("player2", "Player 2", true);

const gameController = new GameController(
  canvas,
  scoreController,
  intervalDisplay,
  socket,
  roomId
);
gameController.initializeGame();
