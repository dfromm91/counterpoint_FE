import { Note } from "../models/Note.js";
import { noteNamesDescending } from "../constants/pitches.js";
import { defaultStaffConfig } from "./StaffConfig.js";

export function mapNoteToYCoordinate(
  note: Note,
  topY: number,
  spacing: number,
  clef: string = "treble"
): number {
  let noteIndex = noteNamesDescending.indexOf(note.pitchClass);
  if (noteIndex > 3) note.octave++; // Adjust gap between B-C
  if (clef == "treble") {
    return topY + (spacing / 2) * noteIndex + 3.5 * spacing * (5 - note.octave);
  } else {
    return (
      topY +
      defaultStaffConfig.grandStaffSpacing +
      (spacing / 2) * noteIndex +
      3 * spacing * (5 - note.octave)
    );
  }
}
