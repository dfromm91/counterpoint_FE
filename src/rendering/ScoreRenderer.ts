// src/rendering/ScoreRenderer.ts
import { GrandStaff } from "../models/";
import { StaffRenderer } from "./StaffRenderer";
import { NoteRenderer } from "./NoteRenderer";
import { StaffConfig } from "../layout";
import { layoutMelody } from "../layout/layoutMelody";

export class ScoreRenderer {
  constructor(
    private staffRenderer: StaffRenderer,
    private noteRenderer: NoteRenderer
  ) {}

  draw(staff: GrandStaff, config: StaffConfig) {
    this.staffRenderer.drawStaff(config.upperLeftCorner.x);
    layoutMelody(staff.melody, config).forEach(({ x, y }) => {
      this.noteRenderer.drawWholeNote(x, y, config.spacing);
    });
  }
}
