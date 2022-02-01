class BitEncoder {
  constructor() {
    this.bits = [];
  }

  clear = () => this.bits = [];

  addBit = (bool) => {
    this.bits.push(bool);
    return this;
  }

  addUint = ({number, bitCount}) => {
    const maxValue = Math.pow(2, bitCount) - 1;
    if (number > maxValue) {
      console.error('addUint(): Truncating ' + number + ' since it will not fit in ' + bitCount + ' bits.');
      number = maxValue;
    }
    let msbMask = 1 << (bitCount - 1);
    for (let i = 0; i < bitCount; ++i) {
      let bit = number & msbMask;
      this.addBit(bit !== 0);
      msbMask >>>= 1;
    }
    return this;
  };

  addUint2 = (number) => this.addUint({number, bitCount:2});
  addUint10 = (number) => this.addUint({number, bitCount:10});
  addUint12 = (number) => this.addUint({number, bitCount:12});

  getBits = () => this.bits;
}

export default BitEncoder;
