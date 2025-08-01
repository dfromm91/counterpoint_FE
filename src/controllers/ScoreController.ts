import * as models from "../models/index.js";
import * as renderers from "../rendering/index.js";
import * as layouter from "../layout/index.js";

export class ScoreController {
  constructor(
    private score: models.Score,
    private scoreLayouter: layouter.ScoreLayouter,
    private staffRenderer: renderers.StaffRenderer,
    private noteRenderer: renderers.NoteRenderer
  ) {}

  addNote(note: models.Note, clef: string = "treble") {
    this.score.addNote(note);
    const { x, y } = this.scoreLayouter.add(note, clef);
    this.noteRenderer.drawWholeNote(
      x,
      y,
      layouter.defaultStaffConfig.spacing,
      clef,
      this.scoreLayouter.offsetY
    );
  }

  addNotes(notes: models.Note[], clef: string = "treble") {
    notes.forEach((note) => this.addNote(note, clef));
    this.scoreLayouter.melodyLayouter.reset();
  }

  addLine(isAnimated: boolean) {
    this.score.addLine(new models.GrandStaff());
    this.scoreLayouter.offsetY +=
      layouter.defaultStaffConfig.spacing * 10 +
      layouter.defaultStaffConfig.staffLineSpacing +
      layouter.defaultStaffConfig.grandStaffSpacing;
    this.scoreLayouter.melodyLayouter.reset();
    this.scoreLayouter.addLine();
    this.staffRenderer.drawStaff(this.scoreLayouter.offsetY, isAnimated);
  }
  initialize(isAnimated: boolean) {
    this.staffRenderer.drawStaff(
      layouter.defaultStaffConfig.upperLeftCorner.y,
      isAnimated
    );
  }
  eraseNote(staffIndex: number, noteIndex: number, clef: string) {
    if (clef == "bass") {
      this.score.staffLines[staffIndex].cantusFirmus[noteIndex] =
        new models.Note("z", -1);
    } else if (clef == "treble") {
      this.score.staffLines[staffIndex].melody[noteIndex] = new models.Note(
        "z",
        -1
      );
    }
    const offsetY =
      staffIndex *
      (10 * layouter.defaultStaffConfig.spacing +
        layouter.defaultStaffConfig.grandStaffSpacing +
        layouter.defaultStaffConfig.staffLineSpacing);
    const noteLocation = this.scoreLayouter.getNoteLocation(
      staffIndex,
      noteIndex,
      clef
    );
    this.noteRenderer.eraseWholeNote(
      noteLocation.x,
      noteLocation.y,
      layouter.defaultStaffConfig.spacing,
      clef,
      offsetY
    );
    this.staffRenderer.drawStaff(
      offsetY + layouter.defaultStaffConfig.upperLeftCorner.y
    );
  }
}
