import { Renderer, StaffRenderer, NoteRenderer } from "./rendering/index.js";
import { Note, GrandStaff } from "./models/index.js";
import { ButtonLayouter, defaultStaffConfig } from "./layout/index.js";
import { MelodyLayouter } from "./layout/MelodyLayouter.js";
import { Score } from "./models/Score.js";
import { ScoreLayouter } from "./layout/ScoreLayouter.js";
import { ScoreController } from "./controllers/ScoreController.js";
import { ButtonRenderer } from "./rendering/ButtonRenderer.js";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
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
const cantusFirmus: Note[] = [
  new Note("b", 2),
  new Note("e", 3),
  new Note("e", 3),
  new Note("f", 3),
  new Note("g", 3),
];

const counterMelody: Note[] = [
  new Note("c", 4),
  new Note("d", 4),
  new Note("e", 4),
  new Note("f", 4),
  new Note("g", 4),
];
const notAnimated = false;
const animated = true;
scoreController.initialize(notAnimated);
scoreController.addNotes(cantusFirmus, "bass");
// scoreController.clearStaff(0);
// scoreController.addLine(notAnimated);
// scoreController.addNotes(counterMelody, "treble");
// scoreController.clearStaff(1);

scoreController.addNote(counterMelody[4], "treble", "select");
// scoreController.addNote(counterMelody[1],"treble");

canvas.addEventListener("click", (event: MouseEvent) => {
  const rect = canvas.getBoundingClientRect(); // get canvas position
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (
    scoreController.buttonLayouter.isInTopArrow(
      x,
      y,
      defaultStaffConfig.spacing
    )
  ) {
    console.log("top arrow clicked");
    scoreController.updateLastNote(1);
  }
  if (
    scoreController.buttonLayouter.isInBottomArrow(
      x,
      y,
      defaultStaffConfig.spacing
    )
  ) {
    console.log("bottom arrow clicked");
    scoreController.updateLastNote(-1);
  }
  if (
    scoreController.buttonLayouter.isInCheckmark(
      x,
      y,
      defaultStaffConfig.spacing
    )
  ) {
    console.log("check clicked");
    scoreController.confirmNote();
  }
});
