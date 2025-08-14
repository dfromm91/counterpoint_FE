// server/routes/pages.js
import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { DIST_DIR } from "../config.js";
import { gameStates } from "../sockets/game.js";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve ALL views (so /lobby/foo.css etc work if you need them)
router.use(express.static(path.join(DIST_DIR, "..", "server", "views")));

// Prefer mounting the specific page folder under /play
router.use(
  "/play",
  express.static(path.join(DIST_DIR, "..", "server", "views", "lobby"), {
    index: "index.html",
  })
);

// Ensure /play (no slash) resolves as a directory so index.html and relative assets load
router.get("/play", (_req, res) => {
  res.redirect(302, "/play/");
});

// Home
router.get("/", (_req, res) => {
  res.sendFile(path.join(DIST_DIR, "..", "server", "views", "home.html"));
});

// ---- Room gate ----
function getPlayerCount(roomObj) {
  return Array.isArray(roomObj?.players) ? roomObj.players.length : 0;
}

router.get("/room/:roomId", (req, res) => {
  const roomId = decodeURIComponent(req.params.roomId || "");
  const room = gameStates[roomId];
  const count = getPlayerCount(room);

  // Allow first/second player in (or if room doesn't exist yet)
  if (!room || count < 2) {
    return res.sendFile(path.join(DIST_DIR, "index.html"));
  }

  // Room is full -> redirect back to lobby with a flag
  res.set("Cache-Control", "no-store");
  return res.redirect(303, `/play/?full=${encodeURIComponent(roomId)}`);
});

// Rooms API for your lobby list
router.get("/rooms", (_req, res) => {
  res.json(gameStates);
});

export default router;
