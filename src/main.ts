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
const cantusFirmus = [
  new Note("c", 3),
  new Note("d", 3),
  new Note("e", 3),
  new Note("f", 3),
  new Note("g", 3),
];
const counterMelody = [
  new Note("g", 4), // P5 above C
  new Note("f", 4), // consonant 3rd above D
  new Note("g", 4), // consonant 3rd above E
  new Note("a", 4), // consonant 3rd above F
  new Note("g", 4), // perfect unison with G
];

// whenever you want to add a new note:
function addNoteToScore(note: Note, clef = "treble") {
  score.addNote(note); // update your model
  const { x, y } = scoreLayouter.add(note, clef); // compute coords
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
cantusFirmus.forEach((element) => {});
addNoteToScore(cantusFirmus[0], "bass");

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
