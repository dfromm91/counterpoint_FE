// server/app.js
import express from "express";
import path from "path";
import { DIST_DIR } from "./config.js";
import pagesRouter from "./routes/pages.js";

export function createApp() {
  const app = express();

  // Static assets from your build
  app.use(express.static(DIST_DIR, { index: false }));

  // Pages (landing page + game route)
  app.use(pagesRouter);

  return app;
}
