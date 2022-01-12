class RollingMax {
  constructor({capacity}) {
    this.capacity = capacity;
    this.values = [];
  }

  add = ({number}) => {
    if (this.capacity === 0) return; // Avoid errors below caused by this strange setting.

    this.values.push(number);
    while (this.values.length > this.capacity) this.values.shift();
  }

  clear = () => {
    this.values = [];
  }

  getMax = () => {
    let max = 0;
    this.values.forEach(value => {
      if (value > max) max = value;
    });
    return max;
  }

  getCount = () => this.values.length;

  isAtCapacity = () => this.values.length === this.capacity;
}

export default RollingMax;