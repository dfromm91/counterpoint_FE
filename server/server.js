// server/index.js
import { createServer } from "http";
import { createApp } from "./app.js";
import { attachSockets } from "./sockets/index.js";
import { PORT } from "./config.js";

const app = createApp();
const httpServer = createServer(app);

// Attach socket handlers
attachSockets(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server listening on :${PORT}`);
});
