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
  res.redirect(302, "/play/"); // after this, <link href="styles.css"> resolves to /play/styles.css
});

// Other routes
router.get("/", (_req, res) => {
  res.sendFile(path.join(DIST_DIR, "..", "server", "views", "home.html"));
});

router.get("/room/:roomId", (_req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

router.get("/rooms", (_req, res) => {
  res.json(gameStates);
});

export default router;
