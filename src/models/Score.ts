import { GrandStaff } from "./GrandStaff.js";
import { Note } from "./Note.js";
export class Score {
  public staffLines: GrandStaff[];
  private workingStaffLine = 0;

  constructor(grandStaff: GrandStaff) {
    this.staffLines = [grandStaff];
  }
  addLine(staffLine: GrandStaff) {
    this.staffLines.push(staffLine);
    this.workingStaffLine += 1;
  }
  addNote(note: Note, clef: string = "treble") {
    if (clef == "treble") {
      this.staffLines[this.workingStaffLine].melody.push(note);
    } else {
      this.staffLines[this.workingStaffLine].cantusFirmus.push(note);
    }
  }
  showNotes() {}
  setCursor(staffIndex: number) {
    this.workingStaffLine = staffIndex;
  }
}
