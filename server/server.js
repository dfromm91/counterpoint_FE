// server/server.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve your built frontend (dist/) at /game assets (and anywhere else)
app.use(express.static(path.join(__dirname, "..", "dist"), { index: false }));

// Your landing page
app.get("/", (_req, res) => {
  res.send(`<html><body style="font-family:sans-serif;padding:24px">
    <h1>Counterpoint</h1>
    <p><a href="/room/demo">Join Demo Room</a></p>
  </body></html>`);
});

// Serve the game UI for any room URL
app.get("/room/:roomId", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

const httpServer = createServer(app);
const io = new Server(httpServer); // same-origin sockets, no CORS needed

// --- Minimal sockets: join a room and be ready to receive events ---
io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("join_room", ({ roomId, name }) => {
    socket.join(roomId);
    console.log(`${socket.id} joined ${roomId} as ${name || "Player"}`);
    socket
      .to(roomId)
      .emit("player_joined", { id: socket.id, name: name || "Player" });
  });

  // (You can add more events later: place_note, confirm_move, etc.)
  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id);
  });
  socket.on("confirm_move", ({ roomId }) => {
    socket.to(roomId).emit("opponent_confirmed_move");
  });

  // inside io.on('connection', socket => { ... })
  socket.on("place_note", ({ roomId, pitchClass, octave }) => {
    // relay to everyone else in that room
    socket.to(roomId).emit("place_opponent_note", { pitchClass, octave });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`server on :${PORT}`));
