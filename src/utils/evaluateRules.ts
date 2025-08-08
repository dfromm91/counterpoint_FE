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

export function evaluateRules(melody: Note[], cantusFirmus: Note[]): string[] {
  const violations: string[] = [];

  if (melody.length !== cantusFirmus.length) {
    violations.push("Melody and cantus firmus must be the same length.");
    return violations;
  }

  const intervals: Interval[] = [];

  for (let i = 0; i < melody.length; i++) {
    const m = melody[i];
    const c = cantusFirmus[i];

    const interval = getDiatonicInterval(c, m);
    intervals.push(interval);

    // 1. Check for consonance
    if (!consonantIntervals.has(interval)) {
      violations.push(`Dissonant interval (${interval}) at index ${i}`);
    }
  }

  // 2. Check for parallel perfect intervals
  for (let i = 1; i < intervals.length; i++) {
    const prev = intervals[i - 1];
    const curr = intervals[i];
    if (
      (prev === Interval.Unison || prev === Interval.PerfectFifth) &&
      curr === prev
    ) {
      violations.push(`Parallel ${curr} between notes ${i - 1} and ${i}`);
    }
  }

  // 3. Check opening and closing interval
  const opening = getDiatonicInterval(cantusFirmus[0], melody[0]);
  const closing = getDiatonicInterval(
    cantusFirmus[cantusFirmus.length - 1],
    melody[melody.length - 1]
  );

  if (!perfectConsonances.has(opening)) {
    violations.push(
      `Opening interval (${opening}) is not a perfect consonance`
    );
  }

  if (!perfectConsonances.has(closing)) {
    violations.push(
      `Closing interval (${closing}) is not a perfect consonance`
    );
  }

  return violations;
}
