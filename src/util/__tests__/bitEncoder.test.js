import BitEncoder from "../bitEncoder";

describe('BitEncoder', () => {
  describe('constructor()', () => {
    it('creates a valid instance', () => {
        const bitEncoder = new BitEncoder();
        expect(bitEncoder).toBeDefined();
    });

    describe('addBit()', () => {
      it('adds an on bit', () => {
        const bitEncoder = new BitEncoder();
        bitEncoder.addBit(true);
        const bits = bitEncoder.getBits();
        expect(bits).toStrictEqual([true]);
      });

      it('adds an off bit', () => {
        const bitEncoder = new BitEncoder();
        bitEncoder.addBit(false);
        const bits = bitEncoder.getBits();
        expect(bits).toStrictEqual([false]);
      });

      it('adds multiple bits', () => {
        const bitEncoder = new BitEncoder();
        bitEncoder.addBit(true);
        bitEncoder.addBit(false);
        bitEncoder.addBit(true);
        const bits = bitEncoder.getBits();
        expect(bits).toStrictEqual([true, false, true]);
      });

      it('chains multiple calls', () => {
        const bitEncoder = new BitEncoder();
        bitEncoder.addBit(true).addBit(false).addBit(true);
        const bits = bitEncoder.getBits();
        expect(bits).toStrictEqual([true, false, true]);
      });
    });

    describe('clear()', () => {
      it('clears when no bits are added', () => {
        const bitEncoder = new BitEncoder();
        bitEncoder.clear();
        const bits = bitEncoder.getBits();
        expect(bits).toStrictEqual([]);
      });

      it('clears after bits are added', () => {
        const bitEncoder = new BitEncoder();
        bitEncoder.addBit(true).addBit(false).addBit(true);
        bitEncoder.clear();
        const bits = bitEncoder.getBits();
        expect(bits).toStrictEqual([]);
      });
    });

    describe('addUnit()', () => {
      it('encodes 0 in 1 bits', () => {
        const bitEncoder = new BitEncoder();
        bitEncoder.addUint({number:0, bitCount:1});
        const bits = bitEncoder.getBits();
        expect(bits).toStrictEqual([false]);
      });

      it('encodes 1 in 1 bits', () => {
        const bitEncoder = new BitEncoder();
        bitEncoder.addUint({number:1, bitCount:1});
        const bits = bitEncoder.getBits();
        expect(bits).toStrictEqual([true]);
      });

      it('encodes 0 in 2 bits', () => {
        const bitEncoder = new BitEncoder();
        bitEncoder.addUint({number:0, bitCount:2});
        const bits = bitEncoder.getBits();
        expect(bits).toStrictEqual([false, false]);
      });

      it('encodes 1 in 2 bits', () => {
        const bitEncoder = new BitEncoder();
        bitEncoder.addUint({number:1, bitCount:2});
        const bits = bitEncoder.getBits();
        expect(bits).toStrictEqual([false, true]);
      });

      it('encodes 2 in 2 bits', () => {
        const bitEncoder = new BitEncoder();
        bitEncoder.addUint({number:2, bitCount:2});
        const bits = bitEncoder.getBits();
        expect(bits).toStrictEqual([true, false]);
      });

      it('encodes 3 in 2 bits', () => {
        const bitEncoder = new BitEncoder();
        bitEncoder.addUint({number:3, bitCount:2});
        const bits = bitEncoder.getBits();
        expect(bits).toStrictEqual([true, true]);
      });

      it('encodes 105 in 8 bits', () => {
        const bitEncoder = new BitEncoder();
        bitEncoder.addUint({number:105, bitCount:8});
        const bits = bitEncoder.getBits();
        expect(bits).toStrictEqual([false, true, true, false, true, false, false, true]);
      });

      describe('failure checks', () => {
        let consoleSpy;

        beforeEach(() => {
          consoleSpy = jest.spyOn(console, "error").mockImplementation();
        });

        it('truncates 2 in 1 bits', () => {
          const bitEncoder = new BitEncoder();
          bitEncoder.addUint({number:2, bitCount:1});
          expect(consoleSpy).toHaveBeenCalled();
          const bits = bitEncoder.getBits();
          expect(bits).toStrictEqual([true]);
        });
  
        it('truncates 3 in 1 bits', () => {
          const bitEncoder = new BitEncoder();
          bitEncoder.addUint({number:2, bitCount:1});
          expect(consoleSpy).toHaveBeenCalled();
          const bits = bitEncoder.getBits();
          expect(bits).toStrictEqual([true]);
        });

        afterEach(() => {
          consoleSpy.mockRestore();
        });
      });
    });
  });
});