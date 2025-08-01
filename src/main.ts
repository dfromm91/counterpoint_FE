import { Renderer, StaffRenderer, NoteRenderer } from "./rendering/index.js";
import { Note, GrandStaff } from "./models/index.js";
import { defaultStaffConfig } from "./layout/index.js";
import { MelodyLayouter } from "./layout/MelodyLayouter.js";
import { Score } from "./models/Score.js";
import { ScoreLayouter } from "./layout/ScoreLayouter.js";
import { ScoreController } from "./controllers/ScoreController.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const renderer = new Renderer(ctx);
const staffRenderer = new StaffRenderer(renderer);
const noteRenderer = new NoteRenderer(ctx, renderer);
const layouter = new MelodyLayouter(defaultStaffConfig.upperLeftCorner.x);
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
  noteRenderer
);
const cantusFirmus: Note[] = [
  new Note("c", 2),
  new Note("d", 3),
  new Note("e", 3),
  new Note("f", 3),
  new Note("g", 3),
];

const counterMelody: Note[] = [
  new Note("e", 4),
  new Note("f", 4),
  new Note("g", 4),
  new Note("a", 4),
  new Note("g", 4),
];

scoreController.initialize(true);
scoreController.addNotes(cantusFirmus, "bass");
scoreController.addNotes(counterMelody, "treble");
scoreController.addLine(true);
