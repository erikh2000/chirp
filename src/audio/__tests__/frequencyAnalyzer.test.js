import { timeToSampleCount } from 'audio/sampleUtil.js';
import { findRangesForFrequency, UNIT_TESTING_EXPORTS } from '../frequencyAnalyzer.js';

const {
  INAUDIBLE_PEAK_INTERVAL,
  _calcFrequencyDetectTolerance, 
  _calcMaximumJoinGap,
  _consolidateAndFilterIntervalsToRanges, 
  _joinGappedRanges, 
} = UNIT_TESTING_EXPORTS;

describe('frequencyAnalyzer', () => {
  describe('_consolidateAndFilterIntervalsToRanges', () => {
    it('returns empty array for no intervals', () => {
      const intervals = [];
      const sampleRate = 10;
      const targetFrequency = 100;
      const expectedRanges = [];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency, sampleRate});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns empty array for one interval that does not match target frequency', () => {
      const intervals = [50];
      const targetFrequency = 100;
      const sampleRate = 10;
      const expectedRanges = [];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency, sampleRate});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for one interval that matches target frequency', () => {
      const intervals = [10];
      const targetFrequency = 1;
      const sampleRate = 10;
      const expectedRanges = [{fromSampleNo:0, toSampleNo:10}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency, sampleRate});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for two intervals that match target frequency', () => {
      const intervals = [10, 10];
      const targetFrequency = 1;
      const sampleRate = 10;
      const expectedRanges = [{fromSampleNo:0, toSampleNo:20}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency, sampleRate});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for three intervals that match target frequency', () => {
      const intervals = [10, 10, 10];
      const targetFrequency = 1;
      const sampleRate = 10;
      const expectedRanges = [{fromSampleNo:0, toSampleNo:30}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency, sampleRate});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns ranges for three intervals with a non-frequency-matching gap', () => {
      const intervals = [10, 25, 10];
      const targetFrequency = 1;
      const sampleRate = 10;
      const expectedRanges = [{fromSampleNo:0, toSampleNo:10}, {fromSampleNo:35, toSampleNo:45}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency, sampleRate});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for two freq-matching intervals after a non-freq-matching gap', () => {
      const intervals = [25, 10, 10];
      const targetFrequency = 1;
      const sampleRate = 10;
      const expectedRanges = [{fromSampleNo:25, toSampleNo:45}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency, sampleRate});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for two freq-matching intervals before a non-freq-matching gap', () => {
      const intervals = [10, 10, 25];
      const targetFrequency = 1;
      const sampleRate = 10;
      const expectedRanges = [{fromSampleNo:0, toSampleNo:20}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency, sampleRate});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for two freq-matching intervals between non-freq-matching gaps', () => {
      const intervals = [25, 10, 10, 25];
      const targetFrequency = 1;
      const sampleRate = 10;
      const expectedRanges = [{fromSampleNo:25, toSampleNo:45}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency, sampleRate});
      expect(ranges).toStrictEqual(expectedRanges);
    });

    it('returns range for three intervals that match using tolerance', () => {
      const targetFrequency = 1;
      const sampleRate = 10;
      const frequencyDetectTolerance = _calcFrequencyDetectTolerance({targetFrequency, sampleRate});
      const intervals = [10 + frequencyDetectTolerance, 10, 10 - frequencyDetectTolerance];
      const expectedRanges = [{fromSampleNo:0, toSampleNo:30}];
      const ranges = _consolidateAndFilterIntervalsToRanges({intervals, targetFrequency, sampleRate});
      expect(ranges).toStrictEqual(expectedRanges);
    });
  });

  describe('_calcMaximumJoinGap', () => {
    it('returns a value equal or greater to target frequency gap', () => {
      const targetFrequency = 1;
      const sampleRate = 10;
      const joinGap = _calcMaximumJoinGap({targetFrequency, sampleRate});
      expect(joinGap).toBeGreaterThan(0); // Avoid coupling to a specific number.
    });
  });

  describe('_joinGappedRanges', () => {
    it('returns empty array for no ranges', () => {
      const ranges = [];
      const targetFrequency = 100;
      const sampleRate = 10;
      const expectedRanges = [];
      const joinedRanges = _joinGappedRanges({ranges, targetFrequency, sampleRate});
      expect(joinedRanges).toStrictEqual(expectedRanges);
    });

    it('returns one range when passed one range', () => {
      const ranges = [{fromSampleNo:0, toSampleNo:100}];
      const targetFrequency = 100;
      const sampleRate = 10;
      const expectedRanges = [{fromSampleNo:0, toSampleNo:100}];
      const joinedRanges = _joinGappedRanges({ranges, targetFrequency, sampleRate});
      expect(joinedRanges).toStrictEqual(expectedRanges);
    });

    it('returns two ranges when passed two ranges with a too-large gap', () => {
      const targetFrequency = 1;
      const sampleRate = 10;
      const tooFarToJoinGap = _calcMaximumJoinGap({targetFrequency, sampleRate}) + 1;
      const range1 = {fromSampleNo:0, toSampleNo:10};
      const range2 = {fromSampleNo:range1 + tooFarToJoinGap, toSampleNo:range1 + tooFarToJoinGap + 10};
      const ranges = [range1, range2];
      const expectedRanges = [range1, range2];
      const joinedRanges = _joinGappedRanges({ranges, targetFrequency, sampleRate});
      expect(joinedRanges).toStrictEqual(expectedRanges);
    });

    it('joins two ranges with a not-too-large gap', () => {
      const targetFrequency = 100;
      const sampleRate = 10;
      const smallEnoughToJoinGap = _calcMaximumJoinGap({targetFrequency, sampleRate}) - 1;
      const interval = timeToSampleCount({time: 1/targetFrequency, sampleRate});
      const range1 = {fromSampleNo:0, toSampleNo:interval};
      const range2 = {fromSampleNo:range1.toSampleNo + smallEnoughToJoinGap, toSampleNo:range1.toSampleNo + smallEnoughToJoinGap + interval};
      const ranges = [range1, range2];
      const expectedRanges = [{fromSampleNo:range1.fromSampleNo, toSampleNo:range2.toSampleNo}];
      const joinedRanges = _joinGappedRanges({ranges, targetFrequency, sampleRate});
      expect(joinedRanges).toStrictEqual(expectedRanges);
    });

    it('joins three ranges with not-too-large gaps', () => {
      const targetFrequency = 100;
      const sampleRate = 10;
      const smallEnoughToJoinGap = _calcMaximumJoinGap({targetFrequency, sampleRate}) - 1;
      const interval = timeToSampleCount({time: 1/targetFrequency, sampleRate});
      const range1 = {fromSampleNo:0, toSampleNo:interval};
      const range2 = {fromSampleNo:range1.toSampleNo + smallEnoughToJoinGap, toSampleNo:range1.toSampleNo + smallEnoughToJoinGap + interval};
      const range3 = {fromSampleNo:range2.toSampleNo + smallEnoughToJoinGap, toSampleNo:range2.toSampleNo + smallEnoughToJoinGap + interval};
      const ranges = [range1, range2, range3];
      const expectedRanges = [{fromSampleNo:range1.fromSampleNo, toSampleNo:range3.toSampleNo}];
      const joinedRanges = _joinGappedRanges({ranges, targetFrequency, sampleRate});
      expect(joinedRanges).toStrictEqual(expectedRanges);
    });
  });

  describe('findRangesForFrequency()', () => {
    it('returns empty array when no samples passed', () => {
      const samples = [];
      const targetFrequency = 100;
      const sampleRate = 10;
      const signalThreshold = .1;
      const expectedRanges = [];
      const ranges = findRangesForFrequency({ samples, targetFrequency, signalThreshold, sampleRate });
      expect(ranges).toStrictEqual(expectedRanges);
    });
  });
});