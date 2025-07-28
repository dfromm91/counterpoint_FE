// src/layout/layoutMelody.ts
import { Note } from "../models/index.js";
import { StaffConfig } from "./StaffConfig.js";
import { mapNoteToYCoordinate } from "./mapNoteToYCoordinate.js";

export interface PositionedNote {
  note: Note;
  x: number;
  y: number;
}

export function layoutMelody(
  melody: Note[],
  config: StaffConfig
): PositionedNote[] {
  let currX = config.upperLeftCorner.x;
  return melody.map((note) => {
    currX += config.horizontalNoteSpacing;
    const y = mapNoteToYCoordinate(
      note,
      config.upperLeftCorner.y,
      config.spacing
    );

    return { note, x: currX, y };
  });
}
