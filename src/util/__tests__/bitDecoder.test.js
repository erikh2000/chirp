import BitDecoder from "../bitDecoder";

describe("BitDecoder", () => {
  describe("decode()", () => {
    it("returns 0 for an empty array", () => {
      expect(BitDecoder.decode({bits:[]})).toEqual(0);
    });

    it("returns 0 for one off bit", () => {
      expect(BitDecoder.decode({bits:[false]})).toEqual(0);
    });

    it("returns 1 for one on bit", () => {
      expect(BitDecoder.decode({bits:[true]})).toEqual(1);
    });

    it("returns 0 for off+off", () => {
      expect(BitDecoder.decode({bits:[false,false]})).toEqual(0);
    });

    it("returns 1 for off+on", () => {
      expect(BitDecoder.decode({bits:[false,true]})).toEqual(1);
    });

    it("returns 2 for on+off", () => {
      expect(BitDecoder.decode({bits:[true,false]})).toEqual(2);
    });

    it("returns 3 for on+on", () => {
      expect(BitDecoder.decode({bits:[true,true]})).toEqual(3);
    });
  });
});