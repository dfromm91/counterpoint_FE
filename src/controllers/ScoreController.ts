import * as models from "../models/index.js";
import * as renderers from "../rendering/index.js";
import * as layouter from "../layout/index.js";

export class ScoreController {
  constructor(
    private score: models.Score,
    private scoreLayouter: layouter.ScoreLayouter,
    private staffRenderer: renderers.StaffRenderer,
    private noteRenderer: renderers.NoteRenderer,
    private buttonRenderer: renderers.ButtonRenderer,
    public buttonLayouter: layouter.ButtonLayouter
  ) {}

  addNote(note: models.Note, clef: string = "treble") {
    this.score.addNote(note);
    const { x, y } = this.scoreLayouter.add(note, clef);


    if(clef=="treble"){
      const nextButtonX = x+layouter.defaultStaffConfig.horizontalNoteSpacing;
      const buttonY = this.scoreLayouter.offsetY+layouter.defaultStaffConfig.spacing;
      this.buttonRenderer.eraseArrowButtons({x:x,y:buttonY},layouter.defaultStaffConfig.spacing)
      this.buttonRenderer.drawArrowButtons({x:nextButtonX,y:buttonY},layouter.defaultStaffConfig.spacing)
      this.buttonLayouter.updateButtonCenter({x:nextButtonX,y:buttonY})
    }
    this.noteRenderer.drawWholeNote(
      x,
      y,
      layouter.defaultStaffConfig.spacing,
      clef,
      this.scoreLayouter.offsetY
    );
    this.staffRenderer.drawStaff(this.scoreLayouter.offsetY,false)

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
        layouter.defaultStaffConfig.staffLineSpacing)+layouter.defaultStaffConfig.upperLeftCorner.y;
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
      offsetY ,false
    );
  }
  clearStaff(staffIndex:number){
this.scoreLayouter.staffLocationData[staffIndex].cantusFirmus.forEach((noteLocation,noteIndex) => {
  this.eraseNote(staffIndex,noteIndex,"bass");
});
this.scoreLayouter.staffLocationData[staffIndex].counterMelody.forEach((noteLocation,noteIndex) => {
  this.eraseNote(staffIndex,noteIndex,"treble");
});
  }
}
