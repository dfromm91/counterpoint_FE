import { GrandStaff } from "../models/GrandStaff.js";
import { Note } from "../models/Note.js";
import { MelodyLayouter } from "./MelodyLayouter.js";
import { defaultStaffConfig } from "./StaffConfig.js";
interface staffLocationData {
  cantusFirmus: { x: number; y: number }[];
  counterMelody: { x: number; y: number }[];
}

export class ScoreLayouter {
  public staffLocationData: staffLocationData[] = [
    { cantusFirmus: [], counterMelody: [] },
  ];
  public currentStaffLine = 0;
  public currentNoteIndex = 0;

  constructor(public melodyLayouter: MelodyLayouter, public offsetY: number) {
    this.melodyLayouter = melodyLayouter;
    this.offsetY = offsetY;
  }
  add(note: Note, clef = "treble") {
    const { x, y } = this.melodyLayouter.add(note, this.offsetY, clef);

    if (clef == "treble") {
      console.log("x: " + x + ", y: " + y);
      console.log(this.staffLocationData);
      this.currentNoteIndex += 1;
      this.staffLocationData[this.currentStaffLine].counterMelody.push({
        x,
        y,
      });
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
    this.currentNoteIndex = 0;
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
  setCursor(staffIndex: number, noteIndex: number) {
    console.log("got " + staffIndex + " for a staff index in scorelayouter");
    this.currentNoteIndex = noteIndex;
    this.currentStaffLine = staffIndex;
    const lineDistance =
      staffIndex *
        (defaultStaffConfig.spacing * 10 +
          defaultStaffConfig.grandStaffSpacing +
          defaultStaffConfig.staffLineSpacing) +
      defaultStaffConfig.upperLeftCorner.y;
    this.offsetY = lineDistance;
  }
}
