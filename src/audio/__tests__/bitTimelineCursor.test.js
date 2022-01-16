import BitTimelineCursor from "../bitTimelineCursor";

describe('BitTimelineCursor', () => {

  describe('constructor', () => {
    it('instances', () => {
      const btc = new BitTimelineCursor({bits:[], spacing:10, spacingToleranceRatio:0});
      expect(btc).toBeDefined();
    });

    it('defaults position to 0', () => {
      const btc = new BitTimelineCursor({bits:[], spacing:10, spacingToleranceRatio:0});
      expect(btc.getPosition()).toEqual(0);
    })
  });

  describe('seekToSample()', () => {
    it('seeks to beginning', () => {
      const btc = new BitTimelineCursor({bits:[], spacing:10, spacingToleranceRatio:0});
      btc.seekTo({position:0});
      expect(btc.getPosition()).toEqual(0);
    });

    it('seeks to positive position', () => {
      const btc = new BitTimelineCursor({bits:[], spacing:10, spacingToleranceRatio:0});
      btc.seekTo({position:100});
      expect(btc.getPosition()).toEqual(100);
    });

    it('seeks to negative position', () => {
      const btc = new BitTimelineCursor({bits:[], spacing:10, spacingToleranceRatio:0});
      btc.seekTo({position:-100});
      expect(btc.getPosition()).toEqual(-100);
    });
  });

  describe('seekToNextBit()', () => {
    it('seeks to first bit', () => {
      const btc = new BitTimelineCursor({bits:[100,200], spacing:10, spacingToleranceRatio:0});
      expect(btc.seekToNextBit()).toBeTruthy();
      expect(btc.getPosition()).toEqual(100);
    });

    it('seeks to next bit after setting position between two bits', () => {
      const btc = new BitTimelineCursor({bits:[100,200], spacing:10, spacingToleranceRatio:0});
      btc.seekTo({position:150});
      expect(btc.seekToNextBit()).toBeTruthy();
      expect(btc.getPosition()).toEqual(200);
    });

    it('seeks to second bit after setting position on first of two bits', () => {
      const btc = new BitTimelineCursor({bits:[100,200], spacing:10, spacingToleranceRatio:0});
      btc.seekTo({position:100});
      expect(btc.seekToNextBit()).toBeTruthy();
      expect(btc.getPosition()).toEqual(200);
    });

    it('returns false when no bits are present to seek to', () => {
      const btc = new BitTimelineCursor({bits:[], spacing:10, spacingToleranceRatio:0});
      expect(btc.seekToNextBit()).toBeFalsy();
    });

    it('returns false when no bit comes after a set position', () => {
      const btc = new BitTimelineCursor({bits:[100,200], spacing:10, spacingToleranceRatio:0});
      btc.seekTo({position:250});
      expect(btc.seekToNextBit()).toBeFalsy();
    });

    it('keeps position unchanged when cannot seek to next bit', () => {
      const btc = new BitTimelineCursor({bits:[100,200], spacing:10, spacingToleranceRatio:0});
      btc.seekTo({position:250});
      btc.seekToNextBit();
      expect(btc.getPosition()).toEqual(250);
    });
  });

  describe('readBit()', () => {
    it('returns false when there are no bits', () => {
      const btc = new BitTimelineCursor({bits:[], spacing:10, spacingToleranceRatio:0});
      expect(btc.readBit()).toBeFalsy();
    });

    it('advances position by spacing interval', () => {
      const spacing = 10;
      const btc = new BitTimelineCursor({bits:[], spacing, spacingToleranceRatio:0});
      btc.readBit();
      expect(btc.getPosition()).toEqual(spacing);
    });

    it('reads a series of bit values with some exactly aligned with the spacing interval', () => {
      const btc = new BitTimelineCursor({bits:[10, 30, 40], spacing:10, spacingToleranceRatio:0});
      expect(btc.readBit()).toBeFalsy();
      expect(btc.readBit()).toBeTruthy();
      expect(btc.readBit()).toBeFalsy();
      expect(btc.readBit()).toBeTruthy();
      expect(btc.readBit()).toBeTruthy();
    });

    it('reads a series of bit values after seeking', () => {
      const btc = new BitTimelineCursor({bits:[10, 30, 40], spacing:10, spacingToleranceRatio:0});
      btc.seekTo({position:30});
      expect(btc.readBit()).toBeTruthy();
      expect(btc.readBit()).toBeTruthy();
    });

    it('returns false when position is past last bit', () => {
      const btc = new BitTimelineCursor({bits:[10, 30, 40], spacing:10, spacingToleranceRatio:0});
      btc.seekTo({position:50});
      expect(btc.readBit()).toBeFalsy();
    });

    it('reads a bit aligned before of the spacing interval within tolerance', () => {
      const btc = new BitTimelineCursor({bits:[9], spacing:10, spacingToleranceRatio:.2});
      btc.seekTo({position:10});
      expect(btc.readBit()).toBeTruthy();
    });

    it('reads a bit aligned after the spacing interval within tolerance', () => {
      const btc = new BitTimelineCursor({bits:[11], spacing:10, spacingToleranceRatio:.2});
      btc.seekTo({position:10});
      expect(btc.readBit()).toBeTruthy();
    });
  });

  describe('readBits()', () => {
    it('returns empty array when requesting 0 bits', () => {
      const btc = new BitTimelineCursor({bits:[], spacing:10, spacingToleranceRatio:0});
      expect(btc.readBits({count:0})).toEqual([]);
    });

    it('returns array of false values if no bits available', () => {
      const btc = new BitTimelineCursor({bits:[], spacing:10, spacingToleranceRatio:0});
      expect(btc.readBits({count:3})).toEqual([false, false, false]);
    });

    it('returns array of values reflecting bits', () => {
      const btc = new BitTimelineCursor({bits:[10, 30, 40], spacing:10, spacingToleranceRatio:0});
      expect(btc.readBits({count:5})).toEqual([false, true, false, true, true]);
    });

    it('moves position to location after last bit value read', () => {
      const btc = new BitTimelineCursor({bits:[10, 30, 40], spacing:10, spacingToleranceRatio:0});
      btc.readBits({count:5});
      expect(btc.getPosition()).toEqual(50);
    });
  });

  describe('isPastEnd()', () => {
    it('returns true when there are no bits', () => {
      const btc = new BitTimelineCursor({bits:[], spacing:10, spacingToleranceRatio:0});
      expect(btc.isPastEnd()).toBeTruthy();
    });

    it('returns false when positioned before last bit', () => {
      const btc = new BitTimelineCursor({bits:[100], spacing:10, spacingToleranceRatio:0});
      btc.seekTo({position:99});
      expect(btc.isPastEnd()).toBeFalsy();
    });

    it('returns false when positioned on last bit', () => {
      const btc = new BitTimelineCursor({bits:[100], spacing:10, spacingToleranceRatio:0});
      btc.seekTo({position:100});
      expect(btc.isPastEnd()).toBeFalsy();
    });

    it('returns true when positioned one past last bit with no tolerance', () => {
      const btc = new BitTimelineCursor({bits:[100], spacing:10, spacingToleranceRatio:0});
      btc.seekTo({position:101});
      expect(btc.isPastEnd()).toBeTruthy();
    });

    it('returns false when positioned past last bit but within tolerance', () => {
      const btc = new BitTimelineCursor({bits:[100], spacing:10, spacingToleranceRatio:.2});
      btc.seekTo({position:101});
      expect(btc.isPastEnd()).toBeFalsy();
    });
  });

  describe('seekPastEnd()', () => {
    it('seeks past end when there are no bits', () => {
      const btc = new BitTimelineCursor({bits:[], spacing:10, spacingToleranceRatio:0});
      btc.seekPastEnd();
      expect(btc.isPastEnd()).toBeTruthy();
    });

    it('seeks past end when there bits with no tolerance', () => {
      const btc = new BitTimelineCursor({bits:[10], spacing:10, spacingToleranceRatio:0});
      btc.seekPastEnd();
      expect(btc.isPastEnd()).toBeTruthy();
    });

    it('seeks past end when there bits with tolerance', () => {
      const btc = new BitTimelineCursor({bits:[10], spacing:10, spacingToleranceRatio:.2});
      btc.seekPastEnd();
      expect(btc.isPastEnd()).toBeTruthy();
    });
  });
});