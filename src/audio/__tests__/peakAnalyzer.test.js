import { findIntervals, findPeaks, peaksToIntervals } from "../peakAnalyzer";

const _expectFloatArraysCloseTo = (first, second) => {
  const FLOAT_COMPARE_PRECISION = 6;
  expect(first).toBeDefined();
  expect(second).toBeDefined();
  expect(first.length).toBe(second.length);
  for(let i = 0; i < first.length; ++i) {
    expect(first[i]).toBeCloseTo(second[i], FLOAT_COMPARE_PRECISION);
  }
}

describe("PeakAnalyzer", () => {
  describe("findPeaks()", () => {
    it("returns no peaks for empty array of samples", () => {
      const samples = [];
      const signalThreshold = .1;
      const expectedPeaks = [];
      expect(findPeaks({samples, signalThreshold})).toEqual(expectedPeaks);
    });

    it("returns peak at very beginning of samples", () => {
      const samples = [1,0,0];
      const signalThreshold = .1;
      const expectedPeaks = [0];
      expect(findPeaks({samples, signalThreshold})).toEqual(expectedPeaks);
    });

    it("returns peak at very end of samples", () => {
      const samples = [0,0,1];
      const signalThreshold = .1;
      const expectedPeaks = [2];
      expect(findPeaks({samples, signalThreshold})).toEqual(expectedPeaks);
    });

    it("returns peak in middle of samples", () => {
      const samples = [0,1,0];
      const signalThreshold = .1;
      const expectedPeaks = [1];
      expect(findPeaks({samples, signalThreshold})).toEqual(expectedPeaks);
    });

    it("returns multiple peaks", () => {
      const samples = [0,1,0,.5, 0];
      const signalThreshold = .1;
      const expectedPeaks = [1, 3];
      expect(findPeaks({samples, signalThreshold})).toEqual(expectedPeaks);
    });

    it("excludes peaks below signal threshold", () => {
      const samples = [0,1,0,.05,0];
      const signalThreshold = .1;
      const expectedPeaks = [1];
      expect(findPeaks({samples, signalThreshold})).toEqual(expectedPeaks);
    });

    it("returns peak on the upward slope of another peak", () => {
      const samples = [0,.5,.3,.7, 0];
      const signalThreshold = .1;
      const expectedPeaks = [1, 3];
      expect(findPeaks({samples, signalThreshold})).toEqual(expectedPeaks);
    });

    it("returns peak on the downward slope of another peak", () => {
      const samples = [0,.7,.3,.5, 0];
      const signalThreshold = .1;
      const expectedPeaks = [1, 3];
      expect(findPeaks({samples, signalThreshold})).toEqual(expectedPeaks);
    });

    it("returns peak with adjacent valleys below the signal threshold", () => {
      const samples = [0,1,0];
      const signalThreshold = .1;
      const expectedPeaks = [1];
      expect(findPeaks({samples, signalThreshold})).toEqual(expectedPeaks);
    });

    it("returns peak with adjacent valleys above the signal threshold", () => {
      const samples = [.5,1,.5];
      const signalThreshold = .1;
      const expectedPeaks = [1];
      expect(findPeaks({samples, signalThreshold})).toEqual(expectedPeaks);
    });

    it("returns only one peak despite changes in upward/downward slopes", () => {
      const samples = [0,.3,1,.7,0];
      const signalThreshold = .1;
      const expectedPeaks = [2];
      expect(findPeaks({samples, signalThreshold})).toEqual(expectedPeaks);
    });
  });

  describe("findIntervals()", () => {
    it("returns no intervals for empty array of samples", () => {
      const samples = [];
      const signalThreshold = .1;
      const expectedIntervals = [];
      expect(findIntervals({samples, signalThreshold})).toEqual(expectedIntervals);
    });

    it("returns no intervals for just one peak", () => {
      const samples = [1,0,0];
      const signalThreshold = .1;
      const expectedIntervals = [];
      expect(findIntervals({samples, signalThreshold})).toEqual(expectedIntervals);
    });

    it("returns interval from two peaks where first is at 0", () => {
      const samples = [1,0,.5];
      const signalThreshold = .1;
      const expectedIntervals = [2];
      expect(findIntervals({samples, signalThreshold})).toEqual(expectedIntervals);
    });

    it("returns two intervals from two peaks where first is >0", () => {
      const samples = [0,1,0,.5];
      const signalThreshold = .1;
      const expectedIntervals = [1,2];
      expect(findIntervals({samples, signalThreshold})).toEqual(expectedIntervals);
    });

    it("excludes intervals for peaks below signal threshold", () => {
      const samples = [0,.05,0,.05,0];
      const signalThreshold = .1;
      const expectedIntervals = [];
      expect(findIntervals({samples, signalThreshold})).toEqual(expectedIntervals);
    });
  });

  describe('peaksToIntervals()', () => {
    it('returns empty array for no peaks', () => {
      const peaks = [];
      const expectedIntervals = [];
      const intervals = peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });

    it('returns empty array for no peaks', () => {
      const peaks = [];
      const expectedIntervals = [];
      const intervals = peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });

    it('returns empty array for one peak at 0', () => {
      const peaks = [0];
      const expectedIntervals = [];
      const intervals = peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });

    it('returns one interval for one peak at >0', () => {
      const peaks = [1];
      const expectedIntervals = [1];
      const intervals = peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });

    it('returns one interval for two peaks with first at 0', () => {
      const INTERVAL = 10;
      const peaks = [0, 0 + INTERVAL];
      const expectedIntervals = [INTERVAL];
      const intervals = peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });

    it('returns two intervals for two peaks with first peak > 0', () => {
      const INTERVAL = 10;
      const peaks = [1, 1 + INTERVAL];
      const expectedIntervals = [1, INTERVAL];
      const intervals = peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });

    it('returns intervals for three peaks', () => {
      const INTERVAL = 10;
      const a = 1, b = a + INTERVAL, c = b + INTERVAL;
      const peaks = [a, b, c];
      const expectedIntervals = [1, INTERVAL, INTERVAL];
      const intervals = peaksToIntervals({peaks});
      _expectFloatArraysCloseTo(intervals, expectedIntervals);
    });
  });
});