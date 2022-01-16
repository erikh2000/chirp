export function findPeaks({samples, signalThreshold}) {
  const peaks = [];
  const sampleCount = samples.length;
  for(let sampleI = 0; sampleI < sampleCount; ++sampleI) {
    const amplitude = samples[sampleI];
    if (amplitude < signalThreshold) continue;

    const prevAmplitude = sampleI === 0 ? 0 : samples[sampleI - 1];
    const nextAmplitude = sampleI === sampleCount - 1 ? 0 : samples[sampleI + 1];

    if (amplitude > prevAmplitude && amplitude > nextAmplitude) peaks.push(sampleI);
  }

  return peaks;
}

export function peaksToIntervals({ peaks }) {
  if (peaks.length < 1) return [];

  const intervals = [];
  if (peaks[0] !== 0) intervals.push(peaks[0]);

  if (peaks.length < 2) return intervals;

  for (let peakI = 0; peakI < peaks.length - 1; ++peakI) {
    const interval = peaks[peakI + 1] - peaks[peakI];
    intervals.push(interval);
  }

  return intervals;
}

export function findIntervals({ samples, signalThreshold }) {
  const peaks = findPeaks({samples, signalThreshold});
  return peaksToIntervals({ peaks });
}