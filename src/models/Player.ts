import { Note } from "./Note";
export class Player {
  private playedNotes: Note[] = [];
  constructor(
    public id: string,
    public name: string,
    public isLocal: boolean = true
  ) {}
  getPlayerNotes() {
    return this.playedNotes;
  }
  addNote(note: Note) {
    this.playedNotes.push(note);
  }
}
