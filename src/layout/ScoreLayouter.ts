import { Note } from "../models/Note.js";
import { MelodyLayouter } from "./MelodyLayouter.js";
export class ScoreLayouter {
  constructor(public melodyLayouter: MelodyLayouter, public offsetY: number) {
    this.melodyLayouter = melodyLayouter;
    this.offsetY = offsetY;
  }
  add(note: Note) {
    return this.melodyLayouter.add(note, this.offsetY);
  }
}
