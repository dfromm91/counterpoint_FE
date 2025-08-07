// src/controllers/GameController.ts
import { ScoreController } from "./ScoreController.js";
import {
  registerCanvasEvents,
  unregisterCanvasEvents,
} from "../utils/eventHandlers.js";
import { defaultStaffConfig } from "../layout/index.js";
import { Player } from "../models/Player.js";
import { Note } from "../models/Note.js";
import * as intervals from "../utils/classifyInterval.js";

export class GameController {
  private currentPlayerIndex: number = 0;
  private playedNotes: Note[] = [];
  constructor(
    private canvas: HTMLCanvasElement,
    private scoreController: ScoreController,
    private players: [Player, Player],
    private intervalDisplay: HTMLDivElement
  ) {}

  initializeGame(): void {
    const cantusFirmus: Note[] = [
      new Note("b", 2),
      new Note("e", 3),
      new Note("e", 3),
      new Note("f", 3),
      new Note("g", 3),
      new Note("e", 3),
      new Note("f", 3),
      new Note("g", 3),
    ];

    const counterMelody: Note[] = [
      new Note("c", 4),
      new Note("d", 4),
      new Note("e", 4),
      new Note("f", 4),
      new Note("g", 4),
    ];

    this.scoreController.initialize(false);
    this.scoreController.addNotes(cantusFirmus, "bass");
    this.scoreController.setCursor(0, 0);
    this.scoreController.addNote(counterMelody[4], "treble", "select");

    this.handleTurn();
  }

  handleTurn(): void {
    const currentPlayer = this.players[this.currentPlayerIndex];

    if (currentPlayer.isLocal) {
      registerCanvasEvents(this.canvas, this.scoreController, () => {
        this.onConfirm(currentPlayer);
      });
    } else {
      unregisterCanvasEvents(this.canvas);
    }

    console.log(`It's ${currentPlayer.name}'s turn`);
  }

  endTurn(): void {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
    this.handleTurn();
  }

  onConfirm(currentPlayer: Player) {
    currentPlayer.addNote(this.scoreController.getLastNote());
    this.playedNotes.push(this.scoreController.getLastNote());
    console.log("counter melody notes played so far:");
    console.log(this.playedNotes);
    this.updateInterval();
    this.endTurn();
  }

  updateInterval() {
    const playedNotesLength = this.playedNotes.length;
    const interval = intervals.getDiatonicInterval(
      this.scoreController.getCantusFirmus()[playedNotesLength - 1],
      this.playedNotes[playedNotesLength - 1]
    );
    this.intervalDisplay.innerText = interval;
  }
}
