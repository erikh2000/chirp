class RollingAverage {
  constructor({capacity}) {
    this.capacity = capacity;
    this.values = [];
  }

  add = ({number}) => {
    if (this.capacity === 0) return; // Avoid errors below caused by this strange setting.

    this.values.push(number);
    while (this.values.length > this.capacity) this.values.shift();
  }

  clear = () => this.values = [];

  getAverage = () => {
    if (this.values.length === 0) return 0;
    const sum = this.values.reduce((partialSum, a) => partialSum + a, 0);
    return sum / this.values.length;
  }

  getCount = () => this.values.length;

  isAtCapacity = () => this.values.length === this.capacity;
}

export default RollingAverage;