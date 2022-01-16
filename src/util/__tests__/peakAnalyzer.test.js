import { findPeaks } from "../peakAnalyzer";

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
});