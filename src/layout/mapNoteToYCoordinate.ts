import { Note } from "../models/Note.js";
import { noteNamesDescending } from "../constants/pitches.js";
import { defaultStaffConfig } from "./StaffConfig.js";

export function mapNoteToYCoordinate(
  note: Note,
  topY: number,
  spacing: number,
  clef: string = "treble"
): number {
  if (clef == "treble") {
    let noteIndex = noteNamesDescending.indexOf(note.pitchClass);
    if (noteIndex > 3) note.octave++; // Adjust gap between B-C
    return topY + (spacing / 2) * noteIndex + 3.5 * spacing * (5 - note.octave);
  } else {
    let noteIndex = noteNamesDescending.indexOf(note.pitchClass) - 2;
    if (noteIndex > 1) note.octave++; // Adjust gap between B-C
    return (
      topY +
      defaultStaffConfig.grandStaffSpacing +
      (spacing / 2) * noteIndex +
      3.5 * spacing * (5 - note.octave)
    );
  }
}
