import { Note } from "../models/Note.js";
import { noteNamesDescending } from "../constants/pitches.js";

export function mapNoteToYCoordinate(
  note: Note,
  topY: number,
  spacing: number
): number {
  let noteIndex = noteNamesDescending.indexOf(note.pitchClass);
  if (noteIndex > 3) note.octave++; // Adjust gap between B-C
  return topY + (spacing / 2) * noteIndex + 3.5 * spacing * (5 - note.octave);
}
