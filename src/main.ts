// main.ts
import { setupApp } from "./utils/setupApp.js";
import { registerCanvasEvents } from "./utils/eventHandlers.js";
import { Note } from "./models/index.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const scoreController = setupApp(canvas);

const cantusFirmus: Note[] = [
  new Note("b", 2),
  new Note("e", 3),
  new Note("e", 3),
  new Note("f", 3),
  new Note("g", 3),
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

scoreController.initialize(false);
scoreController.addNotes(cantusFirmus, "bass");
scoreController.setCursor(0, 0);
scoreController.addNote(counterMelody[4], "treble", "select");

registerCanvasEvents(canvas, scoreController);
