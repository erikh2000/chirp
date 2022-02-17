export function quantizeToNearestStep({value, stepInterval}) {
  return Math.round(value / stepInterval) * stepInterval;
}