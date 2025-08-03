import { GrandStaff } from "../models/GrandStaff.js";
import { Note } from "../models/Note.js";
import { MelodyLayouter } from "./MelodyLayouter.js";
interface staffLocationData {
  cantusFirmus: { x: number; y: number }[];
  counterMelody: { x: number; y: number }[];
}

export class ScoreLayouter {
  public staffLocationData: staffLocationData[] = [
    { cantusFirmus: [], counterMelody: [] },
  ];
  public currentStaffLine = 0;
  public currentNoteIndex = -1;
  constructor(public melodyLayouter: MelodyLayouter, public offsetY: number) {
    this.melodyLayouter = melodyLayouter;
    this.offsetY = offsetY;
  }
  add(note: Note, clef = "treble") {
    const { x, y } = this.melodyLayouter.add(note, this.offsetY, clef);

    if (clef == "treble") {
      this.currentNoteIndex += 1;
      this.staffLocationData[
        this.staffLocationData.length - 1
      ].counterMelody.push({ x, y });
    }
    if (clef == "bass") {
      this.staffLocationData[
        this.staffLocationData.length - 1
      ].cantusFirmus.push({ x, y });
    }

    return { x, y };
  }
  addLine() {
    this.staffLocationData.push({ cantusFirmus: [], counterMelody: [] });
    this.currentStaffLine += 1;
  }
  getNoteLocation(
    staffIndex: number,
    noteIndex: number,
    clef: string = "treble"
  ): { x: number; y: number } {
    if (clef == "treble")
      return this.staffLocationData[staffIndex].counterMelody[noteIndex];
    if (clef == "bass")
      return this.staffLocationData[staffIndex].cantusFirmus[noteIndex];
    return { x: -1, y: -1 };
  }
}

//[{staffindex:1,notes:}]
