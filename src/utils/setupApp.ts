// setupApp.ts
import { Renderer, StaffRenderer, NoteRenderer } from "../rendering/index.js";
import { Note, GrandStaff } from "../models/index.js";
import { ButtonLayouter, defaultStaffConfig } from "../layout/index.js";
import { MelodyLayouter } from "../layout/MelodyLayouter.js";
import { Score } from "../models/Score.js";
import { ScoreLayouter } from "../layout/ScoreLayouter.js";
import { ScoreController } from "../controllers/ScoreController.js";
import { ButtonRenderer } from "../rendering/ButtonRenderer.js";

export function setupApp(canvas: HTMLCanvasElement): ScoreController {
  const ctx = canvas.getContext("2d")!;
  const renderer = new Renderer(ctx);
  const staffRenderer = new StaffRenderer(renderer);
  const noteRenderer = new NoteRenderer(ctx, renderer);
  const layouter = new MelodyLayouter(defaultStaffConfig.upperLeftCorner.x);
  const buttonRenderer = new ButtonRenderer(ctx);
  const buttonLayouter = new ButtonLayouter({ x: 0, y: 0 });
  const scoreLayouter = new ScoreLayouter(
    layouter,
    defaultStaffConfig.upperLeftCorner.y
  );
  const staff = new GrandStaff();
  const score = new Score(staff);
  const scoreController = new ScoreController(
    score,
    scoreLayouter,
    staffRenderer,
    noteRenderer,
    buttonRenderer,
    buttonLayouter
  );
  return scoreController;
}
