import { GrandStaff } from "../models/GrandStaff.js";
import { Note } from "../models/Note.js";
import { MelodyLayouter } from "./MelodyLayouter.js";

export class ScoreLayouter {
  private staffLineLocations: number[];
  constructor(public melodyLayouter: MelodyLayouter, public offsetY: number) {
    this.melodyLayouter = melodyLayouter;
    this.offsetY = offsetY;
    this.staffLineLocations = [offsetY];
  }
  add(note: Note, clef = "treble") {
    return this.melodyLayouter.add(note, this.offsetY, clef);
  }
  addLine(staffLineLocation: number) {
    this.staffLineLocations.push(staffLineLocation);
  }
  getStaffLineLocation(index: number) {
    return this.staffLineLocations[index];
  }
}
