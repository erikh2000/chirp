export const sampleCountToTime = ({sampleCount, sampleRate}) => sampleCount / sampleRate;

export const timeToSampleCount = ({time, sampleRate}) => time * sampleRate;

export const samplesToJs = ({samples}) => 'export const samples = [' + samples.join(',') + '];\n';

export const samplesToJsClipboard = ({samples}) => navigator.clipboard.writeText(samplesToJs({samples}));