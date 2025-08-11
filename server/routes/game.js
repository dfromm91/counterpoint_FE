// server/routes/game.js
// Game-related HTTP routes

import express from "express";
import GameController from "../controllers/GameController.js";

const router = express.Router();
const gameController = GameController;

// GET /api/games/rooms - Get all rooms (for lobby)
router.get("/rooms", gameController.getRooms.bind(gameController));

// GET /api/games/rooms/available - Get only available rooms
router.get(
  "/rooms/available",
  gameController.getAvailableRooms.bind(gameController)
);

// GET /api/games/rooms/:roomId - Get specific room information
router.get("/rooms/:roomId", gameController.getRoom.bind(gameController));

// POST /api/games/rooms - Create a new room
router.post("/rooms", gameController.createRoom.bind(gameController));

// POST /api/games/rooms/join - Join an existing room
router.post("/rooms/join", gameController.joinRoom.bind(gameController));

// POST /api/games/rooms/:roomId/start - Start a game in a room
router.post(
  "/rooms/:roomId/start",
  gameController.startGame.bind(gameController)
);

// GET /api/games/:roomId/state - Get game state for a room
router.get("/:roomId/state", gameController.getGameState.bind(gameController));

// GET /api/games/lobby/stats - Get lobby statistics
router.get("/lobby/stats", gameController.getLobbyStats.bind(gameController));

export default router;
