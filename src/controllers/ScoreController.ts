import * as models from "../models/index.js";
import * as renderers from "../rendering/index.js";
import * as layouter from "../layout/index.js";
import { noteNamesDescending } from "../constants/pitches.js";
export class ScoreController {
  constructor(
    private score: models.Score,
    private scoreLayouter: layouter.ScoreLayouter,
    private staffRenderer: renderers.StaffRenderer,
    private noteRenderer: renderers.NoteRenderer,
    private buttonRenderer: renderers.ButtonRenderer,
    public buttonLayouter: layouter.ButtonLayouter
  ) {}

  addNote(note: models.Note, clef: string = "treble", type: string = "draw") {
    this.score.showNotes();
    this.score.addNote(note, clef);
    const { x, y } = this.scoreLayouter.add(note, clef);
    const nextButtonX = x + layouter.defaultStaffConfig.horizontalNoteSpacing;

    if (clef == "treble") {
      const buttonY =
        this.scoreLayouter.offsetY + layouter.defaultStaffConfig.spacing;
      this.buttonRenderer.eraseArrowButtons(
        { x: x, y: buttonY },
        layouter.defaultStaffConfig.spacing
      );
      this.buttonRenderer.drawArrowButtons(
        { x: nextButtonX, y: buttonY },
        layouter.defaultStaffConfig.spacing
      );
      this.buttonLayouter.updateButtonCenter({ x: nextButtonX, y: buttonY });
    }
    if (type == "draw") {
      this.noteRenderer.drawWholeNote(
        x,
        y,
        layouter.defaultStaffConfig.spacing,
        clef,
        this.scoreLayouter.offsetY
      );
    } else {
      this.noteRenderer.selectWholeNote(
        x,
        y,
        layouter.defaultStaffConfig.spacing,
        clef,
        this.scoreLayouter.offsetY
      );
    }

    this.staffRenderer.drawStaff(this.scoreLayouter.offsetY, false);
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
    // this.scoreLayouter.currentStaffLine += 1;
    this.scoreLayouter.melodyLayouter.reset();
    this.scoreLayouter.addLine();
    this.staffRenderer.drawStaff(this.scoreLayouter.offsetY, isAnimated, true);
  }
  initialize(isAnimated: boolean) {
    this.staffRenderer.drawStaff(
      layouter.defaultStaffConfig.upperLeftCorner.y,
      isAnimated,
      true
    );
  }
  eraseNote(staffIndex: number, noteIndex: number, clef: string) {
    // if (clef == "bass") {
    //   this.score.staffLines[staffIndex].cantusFirmus[noteIndex] =
    //     new models.Note("z", -1);
    // } else if (clef == "treble") {
    //   this.score.staffLines[staffIndex].melody[noteIndex] = new models.Note(
    //     "z",
    //     -1
    //   );
    // }
    const offsetY =
      staffIndex *
        (10 * layouter.defaultStaffConfig.spacing +
          layouter.defaultStaffConfig.grandStaffSpacing +
          layouter.defaultStaffConfig.staffLineSpacing) +
      layouter.defaultStaffConfig.upperLeftCorner.y;
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
    this.staffRenderer.drawStaff(offsetY, false);
  }
  clearStaff(staffIndex: number) {
    this.scoreLayouter.staffLocationData[staffIndex].cantusFirmus.forEach(
      (noteLocation, noteIndex) => {
        this.eraseNote(staffIndex, noteIndex, "bass");
      }
    );
    this.scoreLayouter.staffLocationData[staffIndex].counterMelody.forEach(
      (noteLocation, noteIndex) => {
        this.eraseNote(staffIndex, noteIndex, "treble");
      }
    );
  }
  updateLastNote(increment: number) {
    const lastNoteIndex = this.scoreLayouter.currentNoteIndex - 1;
    const lastStaffIndex = this.scoreLayouter.currentStaffLine;
    const lastNoteLocation = this.scoreLayouter.getNoteLocation(
      lastStaffIndex,
      lastNoteIndex,
      "treble"
    );

    this.eraseNote(lastStaffIndex, lastNoteIndex, "treble");
    this.noteRenderer.selectWholeNote(
      lastNoteLocation.x,
      lastNoteLocation.y -
        increment * layouter.defaultStaffConfig.spacing * 0.5,
      layouter.defaultStaffConfig.spacing,
      "treble",
      this.scoreLayouter.offsetY
    );
    this.scoreLayouter.staffLocationData[lastStaffIndex].counterMelody[
      lastNoteIndex
    ].y -= increment * layouter.defaultStaffConfig.spacing * 0.5;
    this.staffRenderer.drawStaff(this.scoreLayouter.offsetY, false);
    const lastNoteLetter =
      this.score.staffLines[lastStaffIndex].melody[lastNoteIndex].pitchClass;
    const lastNoteRegister =
      this.score.staffLines[lastStaffIndex].melody[lastNoteIndex].octave;
    let newNoteLetterIndex =
      (noteNamesDescending.indexOf(lastNoteLetter) - increment) % 7;
    let newNoteRegister = lastNoteRegister;
    if (newNoteLetterIndex == -1) {
      newNoteLetterIndex = 6;
    }
    const newNoteLetter = noteNamesDescending[newNoteLetterIndex];
    if (increment == 1 && newNoteLetter == "c") {
      newNoteRegister += 1;
    }
    if (increment == -1 && newNoteLetter == "b") {
      newNoteRegister -= 1;
    }
    const newNote = new models.Note(newNoteLetter, newNoteRegister);
    this.score.staffLines[lastStaffIndex].melody[lastNoteIndex] = newNote;
  }
  confirmNote() {
    let lastNoteIndex = this.scoreLayouter.currentNoteIndex - 1;
    let lastStaffIndex = this.scoreLayouter.currentStaffLine;
    if (lastNoteIndex == 0) {
      console.log("wrapped");
    }

    const lastNoteLetter =
      this.score.staffLines[lastStaffIndex].melody[lastNoteIndex].pitchClass;
    const lastNoteRegister =
      this.score.staffLines[lastStaffIndex].melody[lastNoteIndex].octave;
    const newNote = new models.Note(lastNoteLetter, lastNoteRegister);
    console.log(
      "staff index: " + lastStaffIndex + " note index: " + lastNoteIndex
    );
    const { x, y } = this.scoreLayouter.getNoteLocation(
      lastStaffIndex,
      lastNoteIndex,
      "treble"
    );
    this.noteRenderer.drawWholeNote(
      x,
      y,
      layouter.defaultStaffConfig.spacing,
      "treble",
      this.scoreLayouter.offsetY
    );

    if (x > layouter.defaultStaffConfig.width) {
      this.addLine(true);
    }
    this.addNote(newNote, "treble", "select");
  }
}
