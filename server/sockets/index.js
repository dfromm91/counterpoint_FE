// server/sockets/index.js
import { Server } from "socket.io";
import { registerGameSocketHandlers } from "./game.js";

export function attachSockets(httpServer) {
  const io = new Server(httpServer); // same-origin

  io.on("connection", (socket) => {
    // Register all socket modules for this connection
    registerGameSocketHandlers(io, socket);

    socket.on("disconnect", () => {});
  });

  return io;
}
