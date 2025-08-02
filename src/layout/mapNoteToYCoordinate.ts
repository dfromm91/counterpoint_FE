import { Note } from "../models/Note.js";
import { noteNamesDescending } from "../constants/pitches.js";
import { defaultStaffConfig } from "./StaffConfig.js";

export function mapNoteToYCoordinate(
  note: Note,
  topY: number,
  spacing: number,
  clef: string = "treble"
): number {
  const pitchClass = note.pitchClass;
  let octave = note.octave;
  let noteIndex = noteNamesDescending.indexOf(pitchClass);

  if (clef === "treble") {
    if (noteIndex > 3) octave++; // adjust visually but DO NOT mutate
    return topY + (spacing / 2) * noteIndex + 3.5 * spacing * (5 - octave);
  } else {
    noteIndex -= 2;
    if (noteIndex > 1) octave++; // again, visual-only adjustment
    return (
      topY +
      defaultStaffConfig.grandStaffSpacing +
      (spacing / 2) * noteIndex +
      3.5 * spacing * (5 - octave)
    );
  }
}
