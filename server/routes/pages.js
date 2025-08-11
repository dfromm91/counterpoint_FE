// server/routes/pages.js
import { Router } from "express";
import path from "path";
import { DIST_DIR } from "../config.js";

const router = Router();

router.get("/", (_req, res) => {
  res.send(`<html><body style="font-family:sans-serif;padding:24px">
    <h1>Counterpoint</h1>
    <p><a href="/room/demo">Join Demo Room</a></p>
  </body></html>`);
});

router.get("/room/:roomId", (_req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

export default router;
