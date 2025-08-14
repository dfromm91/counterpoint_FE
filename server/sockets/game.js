// server/sockets/game.js

// (optionally import a room service here if you track turns/state)
// import { rooms, nextTurn } from "../services/roomService.js";
import { GameState } from "../models/gameState.js";
export const gameStates = {};

export function registerGameSocketHandlers(io, socket) {
  socket.on("join_room", ({ roomId, name }) => {
    if (!gameStates[roomId]) {
      gameStates[roomId] = new GameState();
    }
    socket.join(roomId);

    socket
      .to(roomId)
      .emit("player_joined", { id: socket.id, name: name || "Player" });
    socket.emit("set_turn_order", {
      goingFirst: gameStates[roomId].goingFirst,
    });
    gameStates[roomId].goingFirst = false;
    gameStates[roomId].players.push(name);
  });
  socket.on("end_turn", ({ roomId }) => {
    io.to(roomId).emit("change_turns", {});
  });
  socket.on("update_note", ({ roomId, increment }) => {
    // Relay to everyone else in the room
    socket.to(roomId).emit("opponent_update_note", { increment });
  });

  socket.on("confirm_note", ({ roomId }) => {
    socket.to(roomId).emit("opponent_confirm_note");
    // If you later track turns on the server, you can advance here
    // const next = nextTurn(roomId);
    // io.to(roomId).emit("turn_changed", { currentTurn: next });
  });
}
