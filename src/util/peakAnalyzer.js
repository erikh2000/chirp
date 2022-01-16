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
};
