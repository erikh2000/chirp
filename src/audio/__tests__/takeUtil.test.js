import { 
  findCharactersInLineTakeMap,
  findFirstIncludedTakeNoForLine,
  findLastIncludedTakeNoForLine,
  findNextIncludedTake,
  generateLineTakeMapFromTakes,
  getTakeFromLineTakeMap
} from '../takeUtil';
import * as eventDecoderModule from 'audio/eventDecoder';
import * as exclusionUtilModule from 'script/util/exclusionUtil';
import { EventType } from 'audio/eventTypes';
import Take from 'audio/take';

describe('takeUtil', () => {
  describe('generateLineTakeMapFromTakes', () => {
    it('returns an empty map when passed empty array of takes', () => {
      const takes = [];
      const expected = {};
      const map = generateLineTakeMapFromTakes({takes});
      expect(map).toStrictEqual(expected);
    });

    it('returns a map representing 1 take', () => {
      const take1 = new Take({lineNo:5, sampleNo:61, sampleCount:20, takeNo:0});
      const takes = [take1];
      const expected = {5:[take1]};
      const map = generateLineTakeMapFromTakes({takes});
      expect(map).toStrictEqual(expected);
    });

    it('returns a map representing 2 takes for one line', () => {
      const take1 = new Take({lineNo:5, sampleNo:61, sampleCount:20, takeNo:0});
      const take2 = new Take({lineNo:5, sampleNo:161, sampleCount:20, takeNo:1});
      const takes = [take1, take2];
      const expected = {5:[take1, take2]};
      const map = generateLineTakeMapFromTakes({takes});
      expect(map).toStrictEqual(expected);
    });

    it('returns a map representing 2 takes for different lines', () => {
      const take1 = new Take({lineNo:5, sampleNo:61, sampleCount:20, takeNo:0});
      const take2 = new Take({lineNo:3, sampleNo:161, sampleCount:20, takeNo:1});
      const takes = [take1, take2];
      const expected = {5:[take1], 3:[take2]};
      const map = generateLineTakeMapFromTakes({takes});
      expect(map).toStrictEqual(expected);
    });

    it('returns a map representing 3 takes for 2 different lines', () => {
      const take1 = new Take({lineNo:3, sampleNo:41, sampleCount:30, takeNo:0});
      const take2 = new Take({lineNo:5, sampleNo:91, sampleCount:10, takeNo:0});
      const take3 = new Take({lineNo:3, sampleNo:121, sampleCount:5, takeNo:0});
      const takes = [take1, take2, take3];
      const expected = {3:[take1, take3], 5:[take2]};
      const map = generateLineTakeMapFromTakes({takes});
      expect(map).toStrictEqual(expected);
    });
  });

  describe('findCharactersInLineTakeMap', () => {
    let script;
    const ignoredTakes = [new Take({lineNo:0})];

    beforeEach(() => {
      script = {
        title:'Fake Script',
        characters:['PUP','WILLIS'],
        lines:[
          {lineNo:1, character:'PUP', normalizedCharacter:'PUP'},
          {lineNo:2, character:'PUP (Cont)', normalizedCharacter:'PUP'},
          {lineNo:3, character:'WILLIS', normalizedCharacter:'WILLIS'},
          {lineNo:4, character:'PUP', normalizedCharacter:'PUP'},
          {lineNo:5, character:'WILLIS', normalizedCharacter:'WILLIS'}
        ]
      };
    });

    it('returns empty array for empty lineTakeMap', () => {
      const lineTakeMap = {};
      const expected = [];
      const characters = findCharactersInLineTakeMap({lineTakeMap, script});
      expect(characters).toStrictEqual(expected);
    });

    it('returns empty array for lineTakeMap that does not match lines in script', () => {
      const lineTakeMap = {6:ignoredTakes};
      const expected = [];
      const characters = findCharactersInLineTakeMap({lineTakeMap, script});
      expect(characters).toStrictEqual(expected);
    });

    it('returns one character for a lineTakeMap matchine one line', () => {
      const lineTakeMap = {3:ignoredTakes};
      const expected = ['WILLIS'];
      const characters = findCharactersInLineTakeMap({lineTakeMap, script});
      expect(characters).toStrictEqual(expected);
    });

    it('returns 2 characters for a lineTakeMap matching lines for 2 characters', () => {
      const lineTakeMap = {1:ignoredTakes, 3:ignoredTakes};
      const expected = ['PUP','WILLIS'];
      const characters = findCharactersInLineTakeMap({lineTakeMap, script});
      expect(characters).toStrictEqual(expected);
    });

    it('returns characters in alphabetical order despite match order reversed', () => {
      const lineTakeMap = {3:ignoredTakes, 4:ignoredTakes};
      const expected = ['PUP','WILLIS'];
      const characters = findCharactersInLineTakeMap({lineTakeMap, script});
      expect(characters).toStrictEqual(expected);
    });

    it('returns normalized name of a matching character', () => {
      const lineTakeMap = {2:ignoredTakes};
      const expected = ['PUP'];
      const characters = findCharactersInLineTakeMap({lineTakeMap, script});
      expect(characters).toStrictEqual(expected);
    });
  });

  describe('getTakeFromLineTakeMap', () => {
    it('returns null when lineTakeMap is empty', () => {
      const lineTakeMap = {};
      const lineNo = 2, takeNo = 0;
      const expected = null;
      const takes = getTakeFromLineTakeMap({lineTakeMap, lineNo, takeNo});
      expect(takes).toStrictEqual(expected);
    });

    it('returns null when requested line does not match a line', () => {
      const lineNo = 2, takeNo = 0;
      const lineTakeMap = {1:[new Take({lineNo, takeNo:0})]};
      const expected = null;
      const takes = getTakeFromLineTakeMap({lineTakeMap, lineNo, takeNo});
      expect(takes).toStrictEqual(expected);
    });

    it('returns null when requested take# for a line does not match', () => {
      const lineNo = 1, takeNo = 1;
      const lineTakeMap = {1:[
        new Take({lineNo, takeNo:0}),
        new Take({lineNo, takeNo:2}),
      ]};
      const expected = null;
      const takes = getTakeFromLineTakeMap({lineTakeMap, lineNo, takeNo});
      expect(takes).toStrictEqual(expected);
    });

    it('returns null when requested take# is less than first take#', () => {
      const lineNo = 1, takeNo = -1;
      const lineTakeMap = {1:[
        new Take({lineNo, takeNo:0}),
        new Take({lineNo, takeNo:2}),
      ]};
      const expected = null;
      const takes = getTakeFromLineTakeMap({lineTakeMap, lineNo, takeNo});
      expect(takes).toStrictEqual(expected);
    });

    it('returns null when requested take# is more than last take#', () => {
      const lineNo = 1, takeNo = 3;
      const lineTakeMap = {1:[
        new Take({lineNo, takeNo:0}),
        new Take({lineNo, takeNo:2}),
      ]};
      const expected = null;
      const takes = getTakeFromLineTakeMap({lineTakeMap, lineNo, takeNo});
      expect(takes).toStrictEqual(expected);
    });

    it('returns take for matching take/line', () => {
      const lineNo = 1, takeNo = 2;
      const expected = new Take({lineNo, takeNo:2});
      const lineTakeMap = {1:[
        new Take({lineNo, takeNo:0}),
        expected,
      ]};
      const takes = getTakeFromLineTakeMap({lineTakeMap, lineNo, takeNo});
      expect(takes).toStrictEqual(expected);
    });
  });

  describe('findFirstIncludedTakeNoForLine', () => {
    const exclusions = {}; // Ignored due to mock below.

    beforeEach(() => {
      jest.spyOn(exclusionUtilModule, 'isTakeExcluded').mockImplementation(
        ({takeNo}) => (takeNo % 2) === 1 // All odd-numbered takes will be excluded.
      );
    });
    
    it('returns null when no takes for line', () => {
      const lineNo = 0;
      const lineTakeMap = {};
      const expected = null;
      const takeNo = findFirstIncludedTakeNoForLine({lineTakeMap, lineNo, exclusions});
      expect(takeNo).toEqual(expected);
    });

    it('returns first take# for line when that take is included', () => {
      const lineNo = 0;
      const lineTakeMap = {0:[
        new Take({lineNo, takeNo:2})
      ]};
      const expected = 2;
      const takeNo = findFirstIncludedTakeNoForLine({lineTakeMap, lineNo, exclusions});
      expect(takeNo).toEqual(expected);
    });

    it('returns first included take# for line when preceded by an excluded take', () => {
      const lineNo = 0;
      const lineTakeMap = {0:[
        new Take({lineNo, takeNo:1}),
        new Take({lineNo, takeNo:2})
      ]};
      const expected = 2;
      const takeNo = findFirstIncludedTakeNoForLine({lineTakeMap, lineNo, exclusions});
      expect(takeNo).toEqual(expected);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });
  });

  describe('findLastIncludedTakeNoForLine', () => {
    const exclusions = {}; // Ignored due to mock below.

    beforeEach(() => {
      jest.spyOn(exclusionUtilModule, 'isTakeExcluded').mockImplementation(
        ({takeNo}) => (takeNo % 2) === 1 // All odd-numbered takes will be excluded.
      );
    });
    
    it('returns null when no takes for line', () => {
      const lineNo = 0;
      const lineTakeMap = {};
      const expected = null;
      const takeNo = findLastIncludedTakeNoForLine({lineTakeMap, lineNo, exclusions});
      expect(takeNo).toEqual(expected);
    });

    it('returns last take# for line when that take is included', () => {
      const lineNo = 0;
      const lineTakeMap = {0:[
        new Take({lineNo, takeNo:2})
      ]};
      const expected = 2;
      const takeNo = findLastIncludedTakeNoForLine({lineTakeMap, lineNo, exclusions});
      expect(takeNo).toEqual(expected);
    });

    it('returns last included take# for line when followed by an excluded take', () => {
      const lineNo = 0;
      const lineTakeMap = {0:[
        new Take({lineNo, takeNo:2}),
        new Take({lineNo, takeNo:3})
      ]};
      const expected = 2;
      const takeNo = findLastIncludedTakeNoForLine({lineTakeMap, lineNo, exclusions});
      expect(takeNo).toEqual(expected);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });
  });

  describe('findNextIncludedTake', () => {
    const exclusions = {}; // Ignored due to mock below.

    beforeEach(() => {
      jest.spyOn(exclusionUtilModule, 'isTakeExcluded').mockImplementation(
        ({takeNo}) => (takeNo % 2) === 1 // All odd-numbered takes will be excluded.
      );
    });

    it('returns null for an empty line/take map', () => {
      const lineTakeMap = {};
      const lineNo = 0;
      const takeNo = 0;
      const expected = null;
      const nextTakeNo = findNextIncludedTake({lineTakeMap, lineNo, takeNo, exclusions});
      expect(nextTakeNo).toEqual(expected);
    });

    it('returns take after a preceding take on same line', () => {
      const lineNo = 0;
      const expected = new Take({lineNo, takeNo:2});
      const lineTakeMap = {0:[
        new Take({lineNo, takeNo:0}),
        expected
      ]};
      const takeNo = 0;
      const nextTakeNo = findNextIncludedTake({lineTakeMap, lineNo, takeNo, exclusions});
      expect(nextTakeNo).toEqual(expected);
    });

    it('returns next take when beginning from a line preceding first line in the line/take map', () => {
      const expected = new Take({lineNo:1, takeNo:2});
      const lineTakeMap = {1:[expected]};
      const lineNo = 0;
      const takeNo = 0;
      const nextTakeNo = findNextIncludedTake({lineTakeMap, lineNo, takeNo, exclusions});
      expect(nextTakeNo).toEqual(expected);
    });

    it('returns null when beginning after the last line in the line/take map', () => {
      const expected = null
      const lineTakeMap = {1:[expected]};
      const lineNo = 2;
      const takeNo = 0;
      const nextTakeNo = findNextIncludedTake({lineTakeMap, lineNo, takeNo, exclusions});
      expect(nextTakeNo).toEqual(expected);
    });

    it('returns take after a preceding take on same line that is not in the line/take map', () => {
      const lineNo = 0;
      const expected = new Take({lineNo, takeNo:2});
      const lineTakeMap = {0:[
        expected
      ]};
      const takeNo = 0;
      const nextTakeNo = findNextIncludedTake({lineTakeMap, lineNo, takeNo, exclusions});
      expect(nextTakeNo).toEqual(expected);
    });

    it('returns take on next line when on last included take of line', () => {
      const expected = new Take({lineNo:1, takeNo:0});
      const lineTakeMap = {
        0:[new Take({lineNo:0, takeNo:0}), new Take({lineNo:0, takeNo:2})],
        1:[expected]
      };
      const lineNo = 0;
      const takeNo = 2;
      const nextTakeNo = findNextIncludedTake({lineTakeMap, lineNo, takeNo, exclusions});
      expect(nextTakeNo).toEqual(expected);
    });


    it('returns take on next line when on last excluded take of line', () => {
      const expected = new Take({lineNo:1, takeNo:0});
      const lineTakeMap = {
        0:[new Take({lineNo:0, takeNo:0}), new Take({lineNo:0, takeNo:1})],
        1:[expected]
      };
      const lineNo = 0;
      const takeNo = 1;
      const nextTakeNo = findNextIncludedTake({lineTakeMap, lineNo, takeNo, exclusions});
      expect(nextTakeNo).toEqual(expected);
    });

    it('returns take on next line when past the last take of current line', () => {
      const expected = new Take({lineNo:1, takeNo:0});
      const lineTakeMap = {
        0:[new Take({lineNo:0, takeNo:0}), new Take({lineNo:0, takeNo:2})],
        1:[expected]
      };
      const lineNo = 0;
      const takeNo = 3;
      const nextTakeNo = findNextIncludedTake({lineTakeMap, lineNo, takeNo, exclusions});
      expect(nextTakeNo).toEqual(expected);
    });

    it('returns null when all following takes are excluded', () => {
      const expected = null;
      const lineTakeMap = {
        0:[new Take({lineNo:0, takeNo:0}), new Take({lineNo:0, takeNo:2})],
        1:[new Take({lineNo:1, takeNo:1})]
      };
      const lineNo = 0;
      const takeNo = 2;
      const nextTakeNo = findNextIncludedTake({lineTakeMap, lineNo, takeNo, exclusions});
      expect(nextTakeNo).toEqual(expected);
    });

    it('returns first included take on next line when that take is preceded by excluded takes', () => {
      const expected = new Take({lineNo:1, takeNo:2});
      const lineTakeMap = {
        0:[new Take({lineNo:0, takeNo:0}), new Take({lineNo:0, takeNo:2})],
        1:[new Take({lineNo:1, takeNo:1}), expected]
      };
      const lineNo = 0;
      const takeNo = 2;
      const nextTakeNo = findNextIncludedTake({lineTakeMap, lineNo, takeNo, exclusions});
      expect(nextTakeNo).toEqual(expected);
    });

    it('returns next included take, skipping over multiple excluded takes', () => {
      const expected = new Take({lineNo:1, takeNo:2});
      const lineTakeMap = {
        0:[new Take({lineNo:0, takeNo:0}), new Take({lineNo:0, takeNo:1})],
        1:[new Take({lineNo:1, takeNo:1}), expected]
      };
      const lineNo = 0;
      const takeNo = 0;
      const nextTakeNo = findNextIncludedTake({lineTakeMap, lineNo, takeNo, exclusions});
      expect(nextTakeNo).toEqual(expected);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });
  });
});