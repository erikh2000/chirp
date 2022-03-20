import { pad2Digit, pad3Digit, getTimeParts, getTakeName, formatHMSMTime } from "../markerUtil";

describe('markerUtil', () => {
  describe('getTakeName()', () => {
    it('returns a name for a take', () => {
      const take = { lineNo:3, takeNo:7 };
      const expected = 'Line 3 Take 8';
      const result = getTakeName({take});
      expect(result).toEqual(expected);
    });
  });
  
  describe('pad2Digit()', () => {
    it('returns 00 for 0', () => {
      const value = 0;
      const expected = '00';
      const result = pad2Digit(value);
      expect(result).toEqual(expected);
    });

    it('returns 01 for 1', () => {
      const value = 1;
      const expected = '01';
      const result = pad2Digit(value);
      expect(result).toEqual(expected);
    });

    it('returns 09 for 9', () => {
      const value = 9;
      const expected = '09';
      const result = pad2Digit(value);
      expect(result).toEqual(expected);
    });

    it('returns 10 for 10', () => {
      const value = 10;
      const expected = '10';
      const result = pad2Digit(value);
      expect(result).toEqual(expected);
    });

    it('returns 99 for 99', () => {
      const value = 99;
      const expected = '99';
      const result = pad2Digit(value);
      expect(result).toEqual(expected);
    });

    it('returns 100 for 100', () => {
      const value = 100;
      const expected = '100';
      const result = pad2Digit(value);
      expect(result).toEqual(expected);
    });
  });

  describe('pad3Digit()', () => {
    it('returns 000 for 0', () => {
      const value = 0;
      const expected = '000';
      const result = pad3Digit(value);
      expect(result).toEqual(expected);
    });

    it('returns 001 for 1', () => {
      const value = 1;
      const expected = '001';
      const result = pad3Digit(value);
      expect(result).toEqual(expected);
    });

    it('returns 009 for 9', () => {
      const value = 9;
      const expected = '009';
      const result = pad3Digit(value);
      expect(result).toEqual(expected);
    });

    it('returns 010 for 10', () => {
      const value = 10;
      const expected = '010';
      const result = pad3Digit(value);
      expect(result).toEqual(expected);
    });

    it('returns 099 for 99', () => {
      const value = 99;
      const expected = '099';
      const result = pad3Digit(value);
      expect(result).toEqual(expected);
    });

    it('returns 100 for 100', () => {
      const value = 100;
      const expected = '100';
      const result = pad3Digit(value);
      expect(result).toEqual(expected);
    });

    it('returns 999 for 99', () => {
      const value = 999;
      const expected = '999';
      const result = pad3Digit(value);
      expect(result).toEqual(expected);
    });

    it('returns 1000 for 1000', () => {
      const value = 1000;
      const expected = '1000';
      const result = pad3Digit(value);
      expect(result).toEqual(expected);
    });
  });
  
  describe('getTimeParts()', () => {
    it('gets 0 for 0s', () => {
      const time = 0;
      const expected = {hours:0, minutes:0, seconds:0, msecs:0};
      const result = getTimeParts({time});
      expect(result).toStrictEqual(expected);
    });
    
    it('gets milliseconds when < 1 second', () => {
      const time = .999;
      const expected = {hours:0, minutes:0, seconds:0, msecs:999};
      const result = getTimeParts({time});
      expect(result).toStrictEqual(expected);
    });

    it('gets 1 second for 1 second', () => {
      const time = 1;
      const expected = {hours:0, minutes:0, seconds:1, msecs:0};
      const result = getTimeParts({time});
      expect(result).toStrictEqual(expected);
    });

    it('gets 1s, 500ms for 1.5 seconds', () => {
      const time = 1.5;
      const expected = {hours:0, minutes:0, seconds:1, msecs:500};
      const result = getTimeParts({time});
      expect(result).toStrictEqual(expected);
    });

    it('gets 59s, 999ms for 59.999 seconds', () => {
      const time = 59.999;
      const expected = {hours:0, minutes:0, seconds:59, msecs:999};
      const result = getTimeParts({time});
      expect(result).toStrictEqual(expected);
    });

    it('gets 1m for 60s', () => {
      const time = 60;
      const expected = {hours:0, minutes:1, seconds:0, msecs:0};
      const result = getTimeParts({time});
      expect(result).toStrictEqual(expected);
    });

    it('gets 2m 30s for 150s', () => {
      const time = 150;
      const expected = {hours:0, minutes:2, seconds:30, msecs:0};
      const result = getTimeParts({time});
      expect(result).toStrictEqual(expected);
    });

    it('gets 59m for 3540s', () => {
      const time = 3540;
      const expected = {hours:0, minutes:59, seconds:0, msecs:0};
      const result = getTimeParts({time});
      expect(result).toStrictEqual(expected);
    });

    it('gets 1h for 3600s', () => {
      const time = 3600;
      const expected = {hours:1, minutes:0, seconds:0, msecs:0};
      const result = getTimeParts({time});
      expect(result).toStrictEqual(expected);
    });

    it('gets 2h 1s for 7201s', () => {
      const time = 7201;
      const expected = {hours:2, minutes:0, seconds:1, msecs:0};
      const result = getTimeParts({time});
      expect(result).toStrictEqual(expected);
    });
  });
  
  describe('formatHMSMTime()', () => {
    it('formats 0s', () => {
      const time = 0;
      const expected = '0:00.000';
      const result = formatHMSMTime({time});
      expect(result).toEqual(expected);
    });
    
    it('formats .999s', () => {
      const time = .999;
      const expected = '0:00.999';
      const result = formatHMSMTime({time});
      expect(result).toEqual(expected);
    });

    it('formats 1 second', () => {
      const time = 1;
      const expected = '0:01.000';
      const result = formatHMSMTime({time});
      expect(result).toEqual(expected);
    });

    it('formats 1s, 500ms', () => {
      const time = 1.5;
      const expected = '0:01.500';
      const result = formatHMSMTime({time});
      expect(result).toEqual(expected);
    });

    it('formats 59s, 999ms', () => {
      const time = 59.999;
      const expected = '0:59.999';
      const result = formatHMSMTime({time});
      expect(result).toEqual(expected);
    });

    it('formats 1m', () => {
      const time = 60;
      const expected = '1:00.000';
      const result = formatHMSMTime({time});
      expect(result).toEqual(expected);
    });

    it('formats 2m 30s', () => {
      const time = 150;
      const expected = '2:30.000';
      const result = formatHMSMTime({time});
      expect(result).toEqual(expected);
    });

    it('formats 59m', () => {
      const time = 3540;
      const expected = '59:00.000'
      const result = formatHMSMTime({time});
      expect(result).toEqual(expected);
    });

    it('formats 1h', () => {
      const time = 3600;
      const expected = '1:00:00.000';
      const result = formatHMSMTime({time});
      expect(result).toEqual(expected);
    });

    it('formats 2h 1s', () => {
      const time = 7201;
      const expected = '2:00:01.000';
      const result = formatHMSMTime({time});
      expect(result).toEqual(expected);
    });
  });
});