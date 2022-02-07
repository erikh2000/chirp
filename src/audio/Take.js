class Take {
  constructor({lineNo, takeNo, sampleNo, sampleCount, isExcluded = false}) {
    this.lineNo = lineNo;
    this.takeNo = takeNo;
    this.sampleNo = sampleNo;
    this.sampleCount = sampleCount;
    this.isExcluded = isExcluded;
  }
}

export default Take;