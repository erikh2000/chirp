class BitDecoder {
  static decode = ({bits}) => {
    const bitCount = bits.length;
    let bitValue = Math.pow(2, bitCount - 1);
    let sum = 0;
    bits.forEach(bit => {
      if (bit) sum += bitValue;
      bitValue /= 2;
    });
    return sum;
  }
}

export default BitDecoder;
