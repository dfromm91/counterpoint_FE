// src/layout/MelodyLayouter.ts
import { Note } from "../models/index.js";
import { defaultStaffConfig } from "./StaffConfig.js";
import { mapNoteToYCoordinate } from "./mapNoteToYCoordinate.js";
interface noteLocation {
  x: number;
  y: number;
}
export class MelodyLayouter {
  private lastX: number;
  private noteLocations: noteLocation[] = [];
  constructor(private upperLeftX: number) {
    // start at the very left of the staff
    this.lastX = upperLeftX;
  }

  /**
   * Compute where to place the next note.
   * Advances the X‐position by horizontalNoteSpacing.
   */
  public add(
    note: Note,
    offsetY: number,
    clef = "treble"
  ): { x: number; y: number } {
    this.lastX += defaultStaffConfig.horizontalNoteSpacing;
    const y = mapNoteToYCoordinate(
      note,
      offsetY,
      defaultStaffConfig.spacing,
      clef
    );
    const noteLocation = { x: this.lastX, y: y };
    return noteLocation;
  }
  getNoteLocation(noteIndex: number) {
    return this.noteLocations[noteIndex];
  }
  /** If you ever want to clear and start over… */
  public reset(): void {
    this.lastX = defaultStaffConfig.upperLeftCorner.x;
  }
  public setCursor(noteIndex: number) {
    this.reset();
  }
}
