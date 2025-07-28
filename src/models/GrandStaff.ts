import { Note } from "./Note.js";

export class GrandStaff {
  public cantusFirmus: Array<Note>;
  public melody: Array<Note>;

  constructor(cantusFirmus: Array<Note> = [], melody: Array<Note> = []) {
    this.cantusFirmus = cantusFirmus;
    this.melody = melody;
  }
}
