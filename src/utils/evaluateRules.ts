import { Note } from "../models";
import { getDiatonicInterval, Interval } from "./classifyInterval.js";

// --- Helpers / enums
enum noteDirection {
  ascending = "ascending",
  descending = "descending",
  plateau = "plateau",
}
enum motionType {
  parallel = "parallel",
  oblique = "oblique",
  contrary = "contrary",
}

// Treat Unison as Octave when pitch class matches but octave differs
function isOctave(a: Note, b: Note): boolean {
  return a.pitchClass === b.pitchClass && a.octave !== b.octave;
}

function notesEqual(a: Note, b: Note): boolean {
  return a.pitchClass === b.pitchClass && a.octave === b.octave;
}

// --- Rule sets (use Set to avoid Array.prototype.includes)
const ILLEGAL_INTERVALS = new Set<Interval>([
  Interval.PerfectFourth,
  Interval.MajorSecond,
  Interval.MinorSecond,
  Interval.MajorSeventh,
  Interval.Tritone,
]);

const PERFECT_CONSONANCES = new Set<Interval>([
  Interval.PerfectFifth,
  Interval.Unison, // plus octave via isOctave()
]);

const ILLEGAL_LEAPS = new Set<Interval>([
  Interval.MinorSeventh,
  Interval.MajorSeventh,
]);

// --- Public API
export function evaluateRules(melody: Note[], cantusFirmus: Note[]): string[] {
  const violations: string[] = [];

  // Guard rails
  if (!melody?.length || !cantusFirmus?.length) return violations;

  const mLen = melody.length;
  const cLen = cantusFirmus.length;

  const currentHarmonicInterval = getDiatonicInterval(
    melody[mLen - 1],
    cantusFirmus[cLen - 1]
  );

  // First placement: allow if not an illegal harmonic interval
  if (mLen === 1) {
    if (!ILLEGAL_INTERVALS.has(currentHarmonicInterval)) {
      return [];
    } else {
      return ["illegal interval " + currentHarmonicInterval];
    }
  }

  const isPerfectConsonance =
    PERFECT_CONSONANCES.has(currentHarmonicInterval) ||
    isOctave(melody[mLen - 1], cantusFirmus[cLen - 1]);

  // Directions & melodic interval (need at least 2 melody notes and 2 CF notes)
  const cantusDirection: noteDirection = determineDirection(
    cantusFirmus[cLen - 1],
    cantusFirmus[cLen - 2]
  );
  const melodyDirection: noteDirection = determineDirection(
    melody[mLen - 1],
    melody[mLen - 2]
  );
  const melodyInterval: Interval = getDiatonicInterval(
    melody[mLen - 1],
    melody[mLen - 2]
  );

  const isParallel =
    determineMotionType(melodyDirection, cantusDirection) ===
    motionType.parallel;

  // Repeated note (by value, not reference)
  if (notesEqual(melody[mLen - 1], melody[mLen - 2])) {
    violations.push("repeated note");
  }

  // Illegal harmonic interval
  if (ILLEGAL_INTERVALS.has(currentHarmonicInterval)) {
    violations.push("Illegal interval: " + currentHarmonicInterval);
  }

  // Parallel perfect consonance (kept same logic as your original)
  if (isPerfectConsonance && isParallel) {
    violations.push("parallel perfect consonance: " + currentHarmonicInterval);
  }

  // Illegal melodic leap
  if (ILLEGAL_LEAPS.has(melodyInterval)) {
    violations.push("illegal leap: " + melodyInterval);
  }

  // Two consecutive melodic leaps in the same direction
  if (mLen >= 3) {
    const interval1 = getDiatonicInterval(melody[mLen - 3], melody[mLen - 2]);
    const interval2 = getDiatonicInterval(melody[mLen - 2], melody[mLen - 1]);
    const direction1 = determineDirection(melody[mLen - 3], melody[mLen - 2]);
    const direction2 = determineDirection(melody[mLen - 2], melody[mLen - 1]);

    if (isLeap(interval1) && isLeap(interval2) && direction1 === direction2) {
      violations.push("two leaps in the same direction");
    }
  }

  return violations;
}

export function determineDirection(note1: Note, note2: Note): noteDirection {
  const pitches = ["c", "d", "e", "f", "g", "a", "b"];
  if (note2.octave > note1.octave) {
    return noteDirection.ascending;
  }
  if (note2.octave < note1.octave) {
    return noteDirection.descending;
  }
  if (note1.octave === note2.octave && note1.pitchClass === note2.pitchClass) {
    return noteDirection.plateau;
  }
  if (pitches.indexOf(note2.pitchClass) > pitches.indexOf(note1.pitchClass)) {
    return noteDirection.ascending;
  }
  return noteDirection.descending;
}

export function determineMotionType(
  melodyDirection: noteDirection,
  cantusDirection: noteDirection
): motionType {
  if (melodyDirection === cantusDirection) {
    return motionType.parallel;
  }
  if (
    melodyDirection !== noteDirection.plateau &&
    cantusDirection !== noteDirection.plateau
  ) {
    return motionType.contrary;
  }
  return motionType.oblique;
}

export function isLeap(interval: Interval): boolean {
  const stepIntervals = new Set<Interval>([
    Interval.MajorSecond,
    Interval.MinorSecond,
  ]);
  return !stepIntervals.has(interval);
}
