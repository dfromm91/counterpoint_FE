// src/rendering/ScoreRenderer.ts
import { GrandStaff } from "../models/GrandStaff.js";
import { StaffRenderer } from "./StaffRenderer.js";
import { NoteRenderer } from "./NoteRenderer.js";
import { StaffConfig } from "../layout/StaffConfig.js";
import { layoutMelody } from "../layout/layoutMelody.js";

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
