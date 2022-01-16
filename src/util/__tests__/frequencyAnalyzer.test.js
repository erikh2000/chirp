import { findRangesForFrequency, UNIT_TESTING_EXPORTS } from '../frequencyAnalyzer.js';

const {
  INAUDIBLE_PEAK_INTERVAL,
  _calcFrequencyDetectTolerance, 
  _calcMaximumJoinGap,
  _consolidateAndFilterIntervalsToRanges, 
  _joinGappedRanges, 
  _peaksToIntervals
} = UNIT_TESTING_EXPORTS;

const _expectFloatArraysCloseTo = (first, second) => {
  const FLOAT_COMPARE_PRECISION = 6;
  expect(first).toBeDefined();
  expect(second).toBeDefined();
  expect(first.length).toBe(second.length);
  for(let i = 0; i < first.length; ++i) {
    expect(first[i]).toBeCloseTo(second[i], FLOAT_COMPARE_PRECISION);
  }
}

describe('frequencyAnalyzer', () => {
  describe('_peaksToIntervals', () => {

    it('returns empty array for no peaks', () => {
      const peaks = [];
      const expectedIntervals = [];
      const intervals = _peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });

    it('returns empty array for no peaks', () => {
      const peaks = [];
      const expectedIntervals = [];
      const intervals = _peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });

    it('returns empty array for one peak', () => {
      const peaks = [1];
      const expectedIntervals = [];
      const intervals = _peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });

    it('returns interval for two peaks within audible interval', () => {
      const AUDIBLE_PEAK_INTERVAL = INAUDIBLE_PEAK_INTERVAL * .9;
      const peaks = [1, 1 + AUDIBLE_PEAK_INTERVAL];
      const expectedIntervals = [AUDIBLE_PEAK_INTERVAL];
      const intervals = _peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });

    it('returns empty array for two peaks with inaudible interval', () => {
      const peaks = [1, 1 + (INAUDIBLE_PEAK_INTERVAL * 1.1)];
      const expectedIntervals = [];
      const intervals = _peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });

    it('returns intervals for three peaks within audible interval', () => {
      const AUDIBLE_PEAK_INTERVAL = INAUDIBLE_PEAK_INTERVAL * .9;
      const a = 1, b = a + AUDIBLE_PEAK_INTERVAL, c = b + AUDIBLE_PEAK_INTERVAL;
      const peaks = [a, b, c];
      const expectedIntervals = [AUDIBLE_PEAK_INTERVAL, AUDIBLE_PEAK_INTERVAL];
      const intervals = _peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });

    it('returns intervals for four peaks with an inaudible gap in the middle', () => {
      const AUDIBLE_PEAK_INTERVAL = INAUDIBLE_PEAK_INTERVAL * .9;
      const a = 1, b = a + AUDIBLE_PEAK_INTERVAL, c = b + (INAUDIBLE_PEAK_INTERVAL * 1.1), d = c + AUDIBLE_PEAK_INTERVAL;
      const peaks = [a, b, c, d];
      const expectedIntervals = [AUDIBLE_PEAK_INTERVAL, AUDIBLE_PEAK_INTERVAL];
      const intervals = _peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });
  });

  describe('_consolidateAndFilterIntervalsToRanges', () => {
    it('returns empty array for no intervals', () => {
      const intervals = [];
      const targetFrequency = 100;
      const expectedRanges = [];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns empty array for one interval that does not match target frequency', () => {
      const intervals = [50];
      const targetFrequency = 100;
      const expectedRanges = [];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for one interval that matches target frequency', () => {
      const intervals = [100];
      const targetFrequency = 100;
      const expectedRanges = [{fromSampleNo:0, toSampleNo:100}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for two intervals that match target frequency', () => {
      const intervals = [100, 100];
      const targetFrequency = 100;
      const expectedRanges = [{fromSampleNo:0, toSampleNo:200}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for three intervals that match target frequency', () => {
      const intervals = [100, 100, 100];
      const targetFrequency = 100;
      const expectedRanges = [{fromSampleNo:0, toSampleNo:300}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns ranges for three intervals with a non-frequency-matching gap', () => {
      const intervals = [100, 250, 100];
      const targetFrequency = 100;
      const expectedRanges = [{fromSampleNo:0, toSampleNo:100}, {fromSampleNo:350, toSampleNo:450}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for two freq-matching intervals after a non-freq-matching gap', () => {
      const intervals = [250, 100, 100];
      const targetFrequency = 100;
      const expectedRanges = [{fromSampleNo:250, toSampleNo:450}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for two freq-matching intervals before a non-freq-matching gap', () => {
      const intervals = [100, 100, 250];
      const targetFrequency = 100;
      const expectedRanges = [{fromSampleNo:0, toSampleNo:200}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for two freq-matching intervals between non-freq-matching gaps', () => {
      const intervals = [250, 100, 100, 250];
      const targetFrequency = 100;
      const expectedRanges = [{fromSampleNo:250, toSampleNo:450}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for three intervals that match using tolerance', () => {
      const targetFrequency = 100;
      const frequencyDetectTolerance = _calcFrequencyDetectTolerance({targetFrequency});
      const intervals = [100 + frequencyDetectTolerance, 100, 100 - frequencyDetectTolerance];
      const expectedRanges = [{fromSampleNo:0, toSampleNo:300}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency});
      expect(ranges).toStrictEqual(expectedRanges);
    });
  });

  describe('_calcMaximumJoinGap', () => {
    it('returns a value equal or greater to target frequency gap', () => {
      const targetFrequency = 100;
      const joinGap = _calcMaximumJoinGap({targetFrequency});
      expect(joinGap).toBeGreaterThanOrEqual(1 / targetFrequency);
    });
  });

  describe('_joinGappedRanges', () => {
    it('returns empty array for no ranges', () => {
      const ranges = [];
      const targetFrequency = 100;
      const expectedRanges = [];
      const joinedRanges = _joinGappedRanges({ranges, targetFrequency});
      expect(joinedRanges).toStrictEqual(expectedRanges);
    });

    it('returns one range when passed one range', () => {
      const ranges = [{fromSampleNo:0, toSampleNo:100}];
      const targetFrequency = 100;
      const expectedRanges = [{fromSampleNo:0, toSampleNo:100}];
      const joinedRanges = _joinGappedRanges({ranges, targetFrequency});
      expect(joinedRanges).toStrictEqual(expectedRanges);
    });

    it('returns two ranges when passed two ranges with a non-freq-matching gap', () => {
      const ranges = [{fromSampleNo:0, toSampleNo:100}, {fromSampleNo:150, toSampleNo:250}];
      const targetFrequency = 100;
      const expectedRanges = [{fromSampleNo:0, toSampleNo:100}, {fromSampleNo:150, toSampleNo:250}];
      const joinedRanges = _joinGappedRanges({ranges, targetFrequency});
      expect(joinedRanges).toStrictEqual(expectedRanges);
    });

    it('returns two ranges when passed two ranges with a freq-matching, but too large, gap', () => {
      const targetFrequency = 100;
      const tooFarToJoinGap = _calcMaximumJoinGap({targetFrequency}) + 1;
      const ranges = [{fromSampleNo:0, toSampleNo:100}, {fromSampleNo:tooFarToJoinGap + 100, toSampleNo:tooFarToJoinGap + 200}];
      const expectedRanges = ranges;
      const joinedRanges = _joinGappedRanges({ranges, targetFrequency});
      expect(joinedRanges).toStrictEqual(expectedRanges);
    });

    it('joins two ranges with a freq-matching, one peak gap', () => {
      const targetFrequency = 100;
      const interval = 1 / targetFrequency;
      const range1 = {fromSampleNo:0, toSampleNo:interval};
      const range2 = {fromSampleNo:range1.toSampleNo + interval, toSampleNo:range1.toSampleNo + (interval*2)};
      const ranges = [range1, range2];
      const expectedRanges = [{fromSampleNo:range1.fromSampleNo, toSampleNo:range2.toSampleNo}];
      const joinedRanges = _joinGappedRanges({ranges, targetFrequency});
      expect(joinedRanges).toStrictEqual(expectedRanges);
    });

    it('joins two ranges with a freq-matching, two peak gap', () => {
      const targetFrequency = 100;
      const interval = 1 / targetFrequency;
      const range1 = {fromSampleNo:0, toSampleNo:interval};
      const range2 = {fromSampleNo:range1.toSampleNo + (interval*2), toSampleNo:range1.toSampleNo + (interval*3)};
      const ranges = [range1, range2];
      const expectedRanges = [{fromSampleNo:range1.fromSampleNo, toSampleNo:range2.toSampleNo}];
      const joinedRanges = _joinGappedRanges({ranges, targetFrequency});
      expect(joinedRanges).toStrictEqual(expectedRanges);
    });

    it('joins three ranges with freq-matching gaps', () => {
      const targetFrequency = 100;
      const interval = 1 / targetFrequency;
      const range1 = {fromSampleNo:0, toSampleNo:interval};
      const range2 = {fromSampleNo:range1.toSampleNo + interval, toSampleNo:range1.toSampleNo + (interval*2)};
      const range3 = {fromSampleNo:range2.toSampleNo + interval, toSampleNo:range2.toSampleNo + (interval*2)};
      const ranges = [range1, range2, range3];
      const expectedRanges = [{fromSampleNo:range1.fromSampleNo, toSampleNo:range3.toSampleNo}];
      const joinedRanges = _joinGappedRanges({ranges, targetFrequency});
      expect(joinedRanges).toStrictEqual(expectedRanges);
    });

    it('joins two ranges with a freq-matching with tolerance gap', () => {
      const targetFrequency = 100;
      const frequencyDetectTolerance = _calcFrequencyDetectTolerance({targetFrequency});
      const interval = 1 / (targetFrequency + frequencyDetectTolerance);
      const range1 = {fromSampleNo:0, toSampleNo:interval};
      const range2 = {fromSampleNo:range1.toSampleNo + interval, toSampleNo:range1.toSampleNo + (interval*2)};
      const ranges = [range1, range2];
      const expectedRanges = [{fromSampleNo:range1.fromSampleNo, toSampleNo:range2.toSampleNo}];
      const joinedRanges = _joinGappedRanges({ranges, targetFrequency});
      expect(joinedRanges).toStrictEqual(expectedRanges);
    });
  });

  describe('findRangesForFrequency()', () => {
    it('returns empty array when no samples passed', () => {
      const samples = [];
      const targetFrequency = 100;
      const signalThreshold = .1;
      const expectedRanges = [];
      const ranges = findRangesForFrequency({ samples, targetFrequency, signalThreshold });
      expect(ranges).toStrictEqual(expectedRanges);
    });
  });
});