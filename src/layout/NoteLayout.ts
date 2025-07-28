import { Note } from "../models/Note.js";

export class NoteLayout {
  constructor(public note: Note, public x: number, public y: number) {}
}
