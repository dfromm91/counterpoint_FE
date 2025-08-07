import { Note } from "../models";
export enum Interval {
  Unison = "Unison",
  MinorSecond = "Minor Second",
  MajorSecond = "Major Second",
  MinorThird = "Minor Third",
  MajorThird = "Major Third",
  PerfectFourth = "Perfect Fourth",
  Tritone = "Tritone",
  PerfectFifth = "Perfect Fifth",
  MinorSixth = "Minor Sixth",
  MajorSixth = "Major Sixth",
  MinorSeventh = "Minor Seventh",
  MajorSeventh = "Major Seventh",
}
export const pitchOrder = ["c", "d", "e", "f", "g", "a", "b"] as const;
export const semitoneFromC: Record<string, number> = {
  c: 0,
  d: 2,
  e: 4,
  f: 5,
  g: 7,
  a: 9,
  b: 11,
};

export const intervalQualityMap: Record<number, Record<number, Interval>> = {
  0: { 0: Interval.Unison },
  1: { 1: Interval.MinorSecond, 2: Interval.MajorSecond },
  2: { 3: Interval.MinorThird, 4: Interval.MajorThird },
  3: { 5: Interval.PerfectFourth, 6: Interval.Tritone },
  4: { 7: Interval.PerfectFifth },
  5: { 8: Interval.MinorSixth, 9: Interval.MajorSixth },
  6: { 10: Interval.MinorSeventh, 11: Interval.MajorSeventh },
};

export function getDiatonicInterval(from: Note, to: Note): Interval {
  const fromPitch = from.pitchClass;
  const toPitch = to.pitchClass;

  const fromIndex = pitchOrder.indexOf(
    fromPitch as (typeof pitchOrder)[number]
  );
  const toIndex = pitchOrder.indexOf(toPitch as (typeof pitchOrder)[number]);

  if (fromIndex === -1 || toIndex === -1) {
    throw new Error(`Invalid pitch class: ${fromPitch} or ${toPitch}`);
  }

  const stepDistance =
    (toIndex - fromIndex + (to.octave - from.octave) * 7 + 7) % 7;

  const fromSemis = semitoneFromC[fromPitch] + from.octave * 12;
  const toSemis = semitoneFromC[toPitch] + to.octave * 12;
  const semitoneDistance = (toSemis - fromSemis + 120) % 12;

  const intervalName = intervalQualityMap[stepDistance]?.[semitoneDistance];

  if (!intervalName) {
    throw new Error(
      `No interval found for ${stepDistance} diatonic steps and ${semitoneDistance} semitones`
    );
  }

  return intervalName;
}
