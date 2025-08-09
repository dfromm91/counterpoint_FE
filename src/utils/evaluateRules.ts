import { Note } from "../models";
import { getDiatonicInterval, Interval } from "./classifyInterval.js";

const perfectConsonances = new Set([
  Interval.Unison,
  Interval.PerfectFifth,
  // We'll treat Unison as Octave when octave is different
]);

const consonantIntervals = new Set([
  Interval.Unison,
  Interval.MinorThird,
  Interval.MajorThird,
  Interval.PerfectFifth,
  Interval.MinorSixth,
  Interval.MajorSixth,
  // Interval.Octave, // not included in enum, see below
]);
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

export function evaluateRules(melody: Note[], cantusFirmus: Note[]): string[] {
  const violations: string[] = [];
  const illegalIntervals: Interval[] = [
    Interval.PerfectFourth,
    Interval.MajorSecond,
    Interval.MinorSecond,
    Interval.MajorSeventh,
    Interval.MajorSeventh,
    Interval.Tritone,
  ];

  const perfectConsonances: Interval[] = [
    Interval.PerfectFifth,
    Interval.Unison,
  ];
  const illegalLeaps = [Interval.MinorSeventh, Interval.MajorSeventh];
  const interval = getDiatonicInterval(
    melody[melody.length - 1],
    cantusFirmus[cantusFirmus.length - 1]
  );
  if (melody.length == 1) {
    if (!illegalIntervals.includes(interval)) {
      return [];
    } else {
      return ["illegal interval " + interval];
    }
  }
  const isPerfectConsonance = perfectConsonances.includes(interval);

  const cantusDirection: noteDirection = determineDirection(
    cantusFirmus[cantusFirmus.length - 1],
    cantusFirmus[cantusFirmus.length - 2]
  );
  let melodyDirection: noteDirection = determineDirection(
    melody[melody.length - 1],
    melody[melody.length - 2]
  );
  const melodyInterval: Interval = getDiatonicInterval(
    melody[melody.length - 1],
    melody[melody.length - 2]
  );

  const isParallel =
    determineMotionType(melodyDirection, cantusDirection) ==
    motionType.parallel;
  if (illegalIntervals.includes(interval)) {
    violations.push("Illegal interval: " + interval);
  }

  if (isPerfectConsonance && isParallel) {
    violations.push("parallel perfect consonance: " + interval);
  }

  if (illegalLeaps.includes(melodyInterval)) {
    violations.push("illegal leap: " + interval);
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
  if (note1.octave == note2.octave && note1.pitchClass == note2.pitchClass) {
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
  if (melodyDirection == cantusDirection) {
    return motionType.parallel;
  }
  if (
    melodyDirection != noteDirection.plateau &&
    cantusDirection != noteDirection.plateau
  ) {
    return motionType.contrary;
  }
  return motionType.oblique;
}
