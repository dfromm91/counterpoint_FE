import { setupApp } from "./utils/setupApp.js";
import { GameController } from "./controllers/GameController.js";
import { Player } from "./models/Player.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
// Grab roomId from /room/:roomId path
const parts = location.pathname.split("/"); // ["", "room", ":roomId"]
const roomId = parts[2] || "lobby";
let goingFirst = true;
let players: Player[] = [];
// Use the global io from /socket.io/socket.io.js.
// If TypeScript complains, you can cast it.
const socket = (window as any).io();

// Join the room as soon as the page loads
socket.emit("join_room", { roomId, name: "Player" });

// (Optional) just to prove messages flow both ways later:
socket.on("player_joined", (p: any) => {
  goingFirst = false;
});

// You now have `socket` ready to use anywhere:
//  - wire your green check to socket.emit('confirm_move', { roomId, ... })
//  - wire arrow changes to socket.emit('place_note', { roomId, ... })

const intervalDisplay = document.getElementById(
  "interval-display"
) as HTMLDivElement;
const scoreController = setupApp(canvas);

const player1 = new Player("player1", "Player 1", true);
const player2 = new Player("player2", "Player 2", true); // later could be remote

const gameController = new GameController(
  canvas,
  scoreController,
  intervalDisplay,
  socket,
  roomId
);
gameController.initializeGame();
