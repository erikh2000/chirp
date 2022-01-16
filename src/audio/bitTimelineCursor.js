class BitTimelineCursor {
  constructor({bits, spacing, spacingToleranceRatio}) {
    this.bits = bits;
    this.spacing = spacing;
    this.spacingTolerance = spacing * spacingToleranceRatio;
    const lastBitPosition = this.bits.length === 0 ? 0 : this.bits[this.bits.length - 1];
    this.pastEndPosition = lastBitPosition + this.spacingTolerance + 1;
    this.position = 0;
  }

  seekTo = ({position}) => this.position = position;

  getPosition = () => this.position;

  isPastEnd = () => 
      this.bits.length === 0 
      || this.position > this.bits[this.bits.length - 1] + this.spacingTolerance;

  seekPastEnd = () => this.position = this.pastEndPosition;

  seekToNextBit = () => {
    for (let bitI = 0; bitI < this.bits.length; ++bitI) {
      const sampleNo = this.bits[bitI];
      const delta = sampleNo - this.position;
      if (delta > this.spacingTolerance) {
        this.position = sampleNo;
        return true;
      }
    }
    return false;
  }
  
  // Returns true for an "on" bit value, false for an "off" bit value.
  readBit = () => {
    for (let bitI = 0; bitI < this.bits.length; ++bitI) {
      const sampleNo = this.bits[bitI];
      const delta = Math.abs(sampleNo - this.position);
      if (delta <= this.spacingTolerance) {
        this.position = sampleNo + this.spacing; // Use relative position from the bit's sample# to correct accumulating inaccuracies over a series.
        return true;
      }
    }
    this.position += this.spacing;
    return false;
  }

  readBits = ({count}) => {
    const bits = [];
    for(let i = 0; i < count; ++i) {
      bits.push(this.readBit());
    }
    return bits;
  }
}

export default BitTimelineCursor;