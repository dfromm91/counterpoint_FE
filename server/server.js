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

// --- Socket event handlers: join a room and handle game events ---
io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("join_room", ({ roomId, name }) => {
    socket.join(roomId);
    console.log(`${socket.id} joined ${roomId} as ${name || "Player"}`);
    socket
      .to(roomId)
      .emit("player_joined", { id: socket.id, name: name || "Player" });
  });

  // when a client tweaks note locally (arrow up/down)
  socket.on("update_note", ({ roomId, increment }) => {
    // broadcast to *other* clients in that room
    socket.to(roomId).emit("opponent_update_note", { increment });
  });

  // when a client confirms a note
  socket.on("confirm_note", ({ roomId }) => {
    socket.to(roomId).emit("opponent_confirm_note");
  });

  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`server on :${PORT}`));
