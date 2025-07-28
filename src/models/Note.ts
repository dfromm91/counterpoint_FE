export class Note {
  public pitchClass: string;
  public octave: number;
  constructor(pitchClass: string, octave: number) {
    this.pitchClass = pitchClass;
    this.octave = octave;
  }
}
