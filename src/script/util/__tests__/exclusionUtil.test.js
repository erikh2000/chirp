import { excludeTake, includeTake, isTakeExcluded } from '../exclusionUtil';

describe('exclusionUtil', () => {
  describe('includeUtil', () => {
    it('returns empty structure when exclusions begin empty', () => {
      const exclusions = {};
      const lineNo = 3, takeNo = 0;
      const expected = {};
      const nextExclusions = includeTake({exclusions, lineNo, takeNo});
      expect(nextExclusions).toStrictEqual(expected);
    });

    it('returns same exclusions when included line/take doesn\'t match a line.', () => {
      const exclusions = { 1:[0,1,2] };
      const lineNo = 3, takeNo = 0;
      const expected = { 1:[0,1,2] };
      const nextExclusions = includeTake({exclusions, lineNo, takeNo});
      expect(nextExclusions).toStrictEqual(expected);
    });

    it('returns same exclusions when included line/take doesn\'t match a take.', () => {
      const exclusions = { 3:[0,2] };
      const lineNo = 3, takeNo = 1;
      const expected = { 3:[0,2] };
      const nextExclusions = includeTake({exclusions, lineNo, takeNo});
      expect(nextExclusions).toStrictEqual(expected);
    });

    it('returns exclusions with a matching line/take removed.', () => {
      const exclusions = { 3:[0,1,2] };
      const lineNo = 3, takeNo = 1;
      const expected = { 3:[0,2] };
      const nextExclusions = includeTake({exclusions, lineNo, takeNo});
      expect(nextExclusions).toStrictEqual(expected);
    });

    it('returns exclusions with line removed when its last take is removed.', () => {
      const exclusions = { 3:[1] };
      const lineNo = 3, takeNo = 1;
      const expected = {};
      const nextExclusions = includeTake({exclusions, lineNo, takeNo});
      expect(nextExclusions).toStrictEqual(expected);
    });
  });

  describe('excludeUtil', () => {
    it('returns same structure when line/take is already excluded', () => {
      const exclusions = { 3:[1] };
      const lineNo = 3, takeNo = 1;
      const expected = { 3:[1] };
      const nextExclusions = excludeTake({exclusions, lineNo, takeNo});
      expect(nextExclusions).toStrictEqual(expected);
    });

    it('returns expected structure when take is added to exclusions for an existing line', () => {
      const exclusions = { 3:[1] };
      const lineNo = 3, takeNo = 2;
      const expected = { 3:[1,2] };
      const nextExclusions = excludeTake({exclusions, lineNo, takeNo});
      expect(nextExclusions).toStrictEqual(expected);
    });

    it('returns expected structure when take is added to exclusions for a new line', () => {
      const exclusions = { 3:[1] };
      const lineNo = 0, takeNo = 1;
      const expected = { 0:[1], 3:[1] };
      const nextExclusions = excludeTake({exclusions, lineNo, takeNo});
      expect(nextExclusions).toStrictEqual(expected);
    });

    it('returns take#s for a line in ascending order when adding an exclusion', () => {
      const exclusions = { 3:[1,3] };
      const lineNo = 3, takeNo = 2;
      const expected = { 3:[1,2,3] };
      const nextExclusions = excludeTake({exclusions, lineNo, takeNo});
      expect(nextExclusions).toStrictEqual(expected);
    });
  });

  describe('isTakeExcluded', () => {
    it('returns false for an empty exclusions structure', () => {
      const exclusions = {};
      const lineNo = 3, takeNo = 2;
      const expected = false;
      const result = isTakeExcluded({exclusions, lineNo, takeNo});
      expect(result).toEqual(expected);
    });

    it('returns false if line# matches exclusion, but take# does not.', () => {
      const exclusions = {3:[0,1,3]};
      const lineNo = 3, takeNo = 2;
      const expected = false;
      const result = isTakeExcluded({exclusions, lineNo, takeNo});
      expect(result).toEqual(expected);
    });

    it('returns false if take# matches exclusion, but line# does not.', () => {
      const exclusions = {0:[1]};
      const lineNo = 3, takeNo = 1;
      const expected = false;
      const result = isTakeExcluded({exclusions, lineNo, takeNo});
      expect(result).toEqual(expected);
    });

    it('returns true if line/take match an exclusion', () => {
      const exclusions = {3:[1]};
      const lineNo = 3, takeNo = 1;
      const expected = true;
      const result = isTakeExcluded({exclusions, lineNo, takeNo});
      expect(result).toEqual(expected);
    });
  });
})