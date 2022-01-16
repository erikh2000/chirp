export const sampleCountToTime = ({sampleCount, sampleRate}) => sampleCount / sampleRate;

export const timeToSampleCount = ({time, sampleRate}) => time * sampleRate;

export const samplesToJs = ({samples}) => 'export const samples = [' + samples.join(',') + '];\n';

export const samplesToJsClipboard = ({samples}) => navigator.clipboard.writeText(samplesToJs({samples}));

export const findVolumeCeiling = ({samples}) => {
  let loudestSample = 0;
  for(let i = 0; i < samples.length; ++i) { // TODO: maybe revise later to drop outliers. Maybe use RMS chunks which would average out isolated spikes.
    const sample = Math.abs(samples[i]);
    if (sample > loudestSample) loudestSample = sample;
  }
  return loudestSample;
};