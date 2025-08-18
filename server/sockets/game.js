export const gameStates = {};
import { GameState } from "../models/gameState.js";
export function registerGameSocketHandlers(io, socket) {
  // === JOIN ===
  socket.on("join_room", ({ roomId, name }) => {
    if (!gameStates[roomId]) gameStates[roomId] = new GameState();

    socket.data.roomId = roomId; // stash for disconnect
    socket.data.name = name || "Player";

    socket.join(roomId);

    // track players by socket id to make removal easy later
    const state = gameStates[roomId];
    gameStates[roomId].players = gameStates[roomId].players || [];
    gameStates[roomId].players.push({ id: socket.id, name: socket.data.name });

    socket
      .to(roomId)
      .emit("player_joined", { id: socket.id, name: socket.data.name });
    socket.emit("set_turn_order", { goingFirst: state.goingFirst });
    state.goingFirst = false;
  });

  // === GAME EVENTS ===
  socket.on("end_turn", ({ roomId }) => {
    io.to(roomId).emit("change_turns", {});
  });

  socket.on("update_note", ({ roomId, increment }) => {
    socket.to(roomId).emit("opponent_update_note", { increment });
  });

  socket.on("confirm_note", ({ roomId }) => {
    socket.to(roomId).emit("opponent_confirm_note");
  });

  // === OPTIONAL explicit leave ===
  socket.on("leave_room", () => {
    safelyRemoveFromRooms(io, socket);
  });

  // === DISCONNECT ===
  socket.on("disconnecting", () => {
    safelyRemoveFromRooms(io, socket);
  });

  socket.on("get_opponent_name", ({ playerName, roomId }) => {
    const players = gameStates[roomId]?.players || [];
    const opponentName =
      players.find((p) => p.name !== playerName)?.name || null;

    socket.emit("receive_opponent_name", { name: opponentName });
    console.log(gameStates[roomId]);
  });
}

/** Removes the socket from any game rooms, updates player lists,
 *  emits 'player_left', and deletes GameState if the room becomes empty. */
function safelyRemoveFromRooms(io, socket) {
  // All rooms this socket is currently in (includes its own room = socket.id)
  const rooms = [...socket.rooms].filter((r) => r !== socket.id);

  for (const roomId of rooms) {
    const state = gameStates[roomId];

    // Update players array if we track it
    if (state && Array.isArray(state.players)) {
      state.players = state.players.filter((p) => p.id !== socket.id);
    }

    // Notify remaining peers in the room
    socket
      .to(roomId)
      .emit("player_left", { id: socket.id, name: socket.data?.name });

    // Adapter set currently includes this socket; after it leaves, size - 1 remain
    const set = io.sockets.adapter.rooms.get(roomId);
    const sizeAfter = (set ? set.size : 0) - 1;

    if (sizeAfter <= 0) {
      // No one left—clean up the room state
      delete gameStates[roomId];
    }
  }
}
