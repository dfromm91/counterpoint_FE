import { Renderer, StaffRenderer, NoteRenderer } from "./rendering/index.js";
import { Note, GrandStaff } from "./models/index.js";
import { defaultStaffConfig } from "./layout/index.js";
import { MelodyLayouter } from "./layout/MelodyLayouter.js";
import { Score } from "./models/Score.js";
import { ScoreLayouter } from "./layout/ScoreLayouter.js";
import { ScoreRenderer } from "./rendering/ScoreRenderer.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const renderer = new Renderer(ctx);
const staffRenderer = new StaffRenderer(renderer);
const noteRenderer = new NoteRenderer(ctx, renderer);

// draw the staff once
staffRenderer.drawStaff(
  defaultStaffConfig.upperLeftCorner.y,
  /* isAnimated? */ true
);

// now set up your layout helper
const layouter = new MelodyLayouter(defaultStaffConfig.upperLeftCorner.x);
const scoreLayouter = new ScoreLayouter(
  layouter,
  defaultStaffConfig.upperLeftCorner.y
);
const staff = new GrandStaff();
const score = new Score(staff);
const melody = [new Note("d", 4), new Note("e", 4)];

// whenever you want to add a new note:
function addNoteToScore(note: Note) {
  score.addNote(note); // update your model
  const { x, y } = scoreLayouter.add(note); // compute coords
  noteRenderer.drawWholeNote(x, y, defaultStaffConfig.spacing);
}
function addLineToScore(score: Score) {
  score.addLine(new GrandStaff());
  scoreLayouter.offsetY +=
    defaultStaffConfig.spacing * 10 +
    defaultStaffConfig.staffLineSpacing +
    defaultStaffConfig.grandStaffSpacing;
  scoreLayouter.melodyLayouter.reset();
  staffRenderer.drawStaff(scoreLayouter.offsetY);
}
addNoteToScore(new Note("c", 5));
addLineToScore(score);
addNoteToScore(new Note("d", 5));
// example usage:
// melody.forEach((note) => {
//   addNoteToScore(note);
// });
// addLineToScore(score);
// const melody2 = [new Note("e", 5), new Note("a", 4), new Note("g", 5)];
// melody2.forEach((note) => {
//   addNoteToScore(note);
// });
// const melody3 = [new Note("e", 5), new Note("d", 5), new Note("g", 4)];
// addLineToScore(score);
// melody3.forEach((note) => {
//   addNoteToScore(note);
// });

// if you want to clear everything and start over:
function resetScore() {
  staff.melody = [];
  layouter.reset();
  // optionally clear the canvas here...
}
