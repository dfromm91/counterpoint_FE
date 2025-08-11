// src/controllers/GameController.ts
import { ScoreController } from "./ScoreController.js";
import {
  registerCanvasEvents,
  unregisterCanvasEvents,
} from "../utils/eventHandlers.js";
import { Player } from "../models/Player.js";
import { Note } from "../models/Note.js";
import * as intervals from "../utils/classifyInterval.js";
import { evaluateRules } from "../utils/evaluateRules.js";

export type ISocket = {
  on: (event: string, cb: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
  id?: string;
};

type OpponentNotePayload = {
  pitchClass: string; // e.g. "c" | "d" | ...
  octave: number; // e.g. 4
  // (optionally include indices/roomId if you need them)
};

export class GameController {
  private currentPlayerIndex = 0;
  private playedNotes: Note[] = [];
  private cantusFirmus: Note[] = [];
  private isTurn: boolean = false;
  constructor(
    private canvas: HTMLCanvasElement,
    private scoreController: ScoreController,

    private intervalDisplay: HTMLDivElement,
    private socket: ISocket,
    private roomId: string
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

    this.registerSocketHandlers();
    this.handleTurn();
  }

  private registerSocketHandlers() {
    this.socket.on("opponent_confirm_note", () => {
      this.scoreController.confirmNote();
      this.onConfirm(false);
    });
    this.socket.on("opponent_update_note", ({ increment }) => {
      this.scoreController.updateLastNote(increment);
    });
    this.socket.on("set_turn_order", ({ goingFirst }) => {
      this.isTurn = goingFirst;
      this.handleTurn();
    });
    this.socket.on("change_turns", () => {
      console.log("isturn was: " + this.isTurn);
      this.isTurn = !this.isTurn;
      console.log("isturn is now: " + this.isTurn);
      this.handleTurn();
    });
  }

  handleTurn(): void {
    registerCanvasEvents(
      this.canvas,
      this.scoreController,
      () => {
        this.onConfirm(true);
      },
      this.socket,
      this.roomId,
      this.isTurn
    );
  }

  endTurn(): void {
    this.socket.emit("end_turn", { roomId: this.roomId });
    console.log(this.playedNotes);
  }

  onConfirm(shouldEndTurn: boolean) {
    const last = this.scoreController.getLastNote();
    this.playedNotes.push(last);
    const i = this.playedNotes.length - 1;
    this.cantusFirmus.push(this.scoreController.getCantusFirmus()[i]);
    this.updateInterval();
    if (shouldEndTurn) {
      this.endTurn();
    }
  }

  updateInterval() {
    const i = this.playedNotes.length - 1;
    const interval = intervals.getDiatonicInterval(
      this.scoreController.getCantusFirmus()[i],
      this.playedNotes[i]
    );
    this.intervalDisplay.innerText = interval;
  }
}
