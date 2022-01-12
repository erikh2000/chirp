import RollingAverage from "../rollingAverage";

describe('RollingAverage', () => {
  const COMPARE_PRECISION = 6;

  describe('constructor', () => {
    it('instances', () => {
      const ra = new RollingAverage({capacity:3});
      expect(ra).toBeDefined();
    });
  });

  describe('add()', () => {
    it('adds one value', () => {
      const ra = new RollingAverage({capacity:3});
      ra.add({number:7});
      expect(ra.getCount()).toEqual(1);
    });

    it('adds two values', () => {
      const ra = new RollingAverage({capacity:3});
      ra.add({number:7});
      ra.add({number:7});
      expect(ra.getCount()).toEqual(2);
    });

    it('adds beyond capacity', () => {
      const ra = new RollingAverage({capacity:3});
      ra.add({number:7});
      ra.add({number:7});
      ra.add({number:7});
      ra.add({number:7});
      ra.add({number:7});
      expect(ra.getCount()).toEqual(3);
    });

    it('adds with zero capacity', () => {
      const ra = new RollingAverage({capacity:0});
      ra.add({number:7});
      expect(ra.getCount()).toEqual(0);
    });
  });

  describe('clear()', () => {
    it('clears with no values added', () => {
      const ra = new RollingAverage({capacity:3});
      ra.clear();
      expect(ra.getCount()).toEqual(0);
    });

    it('clears added values', () => {
      const ra = new RollingAverage({capacity:3});
      ra.add({number:7});
      ra.add({number:7});
      ra.clear();
      ra.add({number:7});
      expect(ra.getCount()).toEqual(1);
    });
  });

  describe('getAverage()', () => {
    it('returns 0 average when no values added', () => {
      const ra = new RollingAverage({capacity:3});
      expect(ra.getAverage()).toBeCloseTo(0, COMPARE_PRECISION);
    });

    it('averages one value', () => {
      const ra = new RollingAverage({capacity:3});
      ra.add({number:7});
      expect(ra.getAverage()).toBeCloseTo(7, COMPARE_PRECISION);
    });

    it('averages two values', () => {
      const ra = new RollingAverage({capacity:3});
      ra.add({number:7});
      ra.add({number:5});
      expect(ra.getAverage()).toBeCloseTo(6, COMPARE_PRECISION);
    });

    it('averages after adding past capacity', () => {
      const ra = new RollingAverage({capacity:2});
      ra.add({number:7});
      ra.add({number:5});
      ra.add({number:3});
      expect(ra.getAverage()).toBeCloseTo(4, COMPARE_PRECISION);
    });

  });

  describe('getCount()', () => {
    it('returns 0 when no items added', () => {
      const ra = new RollingAverage({capacity:2});
      expect(ra.getCount()).toEqual(0);
    });

    it('returns 1 when one item added', () => {
      const ra = new RollingAverage({capacity:2});
      ra.add({number:7});
      expect(ra.getCount()).toEqual(1);
    });

    it('returns 2 when 2 items added', () => {
      const ra = new RollingAverage({capacity:2});
      ra.add({number:7});
      ra.add({number:7});
      expect(ra.getCount()).toEqual(2);
    });

    it('returns capacity when items added beyond capacity', () => {
      const ra = new RollingAverage({capacity:2});
      ra.add({number:7});
      ra.add({number:7});
      ra.add({number:7});
      expect(ra.getCount()).toEqual(2);
    });
  });

  describe('isAtCapacity()', () => {
    it('returns true for 0 capacity', () => {
      const ra = new RollingAverage({capacity:0});
      expect(ra.isAtCapacity()).toBeTruthy();
    });

    it('returns false when not at capacity with 0 values', () => {
      const ra = new RollingAverage({capacity:2});
      expect(ra.isAtCapacity()).toBeFalsy();
    });

    it('returns false when not at capacity with 1 values', () => {
      const ra = new RollingAverage({capacity:2});
      ra.add({number:7});
      expect(ra.isAtCapacity()).toBeFalsy();
    });

    it('returns true when added enough values to reach capacity', () => {
      const ra = new RollingAverage({capacity:2});
      ra.add({number:7});
      ra.add({number:7});
      expect(ra.isAtCapacity()).toBeTruthy();
    });

    it('returns true when added values beyond capacity', () => {
      const ra = new RollingAverage({capacity:2});
      ra.add({number:7});
      ra.add({number:7});
      ra.add({number:7});
      expect(ra.isAtCapacity()).toBeTruthy();
    });
  });
});