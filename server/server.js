// server/server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1) Serve your built game at /game/*
//    This maps URLs like /game/main.js -> dist/main.js
app.use("/game", express.static(path.join(__dirname, "..", "dist")));

// 2) When someone visits /game, send the game's index.html
app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.get("/", (_req, res) => {
  res.redirect("/game");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server up on http://localhost:${PORT}`));
