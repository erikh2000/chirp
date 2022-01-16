import { LATEST } from './waveCodecs';
import { findRangesForFrequency } from './frequencyAnalyzer';
import { findVolumeCeiling, timeToSampleCount } from './sampleUtil';

function _calcBitSampleCount({codec, sampleRate}) { 
  return timeToSampleCount({time:codec.bitDuration - codec.silencePadDuration, sampleRate}); 
}

function _filterOutRangesThatCantBeBits({ ranges, bitSampleCount, bitSizeTolerancePercent }) {
  const toleranceSampleCount = bitSampleCount * bitSizeTolerancePercent;
  const minSampleCount = bitSampleCount - toleranceSampleCount, maxSampleCount = bitSampleCount + toleranceSampleCount;
  return ranges.filter(range => {
    const rangeSampleCount = range.toSampleNo - range.fromSampleNo;
    return rangeSampleCount >= minSampleCount && rangeSampleCount <= maxSampleCount;
  });
}

function _calcSignalThreshold({samples}) {
  const CEILING_SILENCE_RATIO = .04;
  const volumeCeiling = findVolumeCeiling({samples});
  return volumeCeiling * CEILING_SILENCE_RATIO;
}

export function findBits({audioBuffer}) {
  const codec = LATEST;
  const samples = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const signalThreshold = _calcSignalThreshold({ samples });
  const bitSampleCount = _calcBitSampleCount({codec, sampleRate});

  let ranges = findRangesForFrequency({ samples, sampleRate, targetFrequency:codec.bitFrequency, signalThreshold });
  ranges = _filterOutRangesThatCantBeBits({ ranges, bitSampleCount, bitSizeTolerancePercent:.25}); 
  return ranges.map(range => range.fromSampleNo);
}

export function calcBitIntervalSampleCount({codec, sampleRate}) {
  return timeToSampleCount({time:codec.bitDuration, sampleRate});
}