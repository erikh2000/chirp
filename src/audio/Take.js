class Take {
  constructor({lineNo, takeNo, time, duration, isExcluded = false}) {
    this.lineNo = lineNo;
    this.takeNo = takeNo;
    this.time = time;
    this.duration = duration;
    this.isExcluded = isExcluded;
  }
}

export default Take;