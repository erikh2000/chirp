import { findRangesForFrequency } from './frequencyAnalyzer';
import { findVolumeCeiling, timeToSampleCount } from './sampleUtil';

function _calcSignalThreshold({samples}) {
  const CEILING_SILENCE_RATIO = .04;
  const volumeCeiling = findVolumeCeiling({samples});
  return volumeCeiling * CEILING_SILENCE_RATIO;
}

function _doesRangeMatchSampleCount({range, sampleCount, tolerancePercent}) {
  const rangeSampleCount = range.toSampleNo - range.fromSampleNo;
  return (Math.abs(rangeSampleCount - sampleCount) <= sampleCount * tolerancePercent);
}

export function findBits({audioBuffer}) {
  const samples = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const signalThreshold = _calcSignalThreshold({ samples });
  const bitSampleCount = _calcBitSampleCount({codec, sampleRate});

  let ranges = findRangesForFrequency({ samples, sampleRate, targetFrequency:codec.bitFrequency, signalThreshold });
  ranges = _filterOutRangesThatCantBeBits({ ranges, bitSampleCount, bitSizeTolerancePercent:.25}); 
  return ranges.map(range => range.fromSampleNo);
}

export function findNotes({audioBuffer, notes, noteDuration, fromSampleNo}) {
  const samples = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const signalThreshold = _calcSignalThreshold({ samples });
  const noteSampleCount = timeToSampleCount({time:noteDuration, sampleRate});
  
  const noteRanges = notes.map(targetFrequency => { 
    return { 
      targetFrequency,
      ranges: findRangesForFrequency({samples, sampleRate, targetFrequency, signalThreshold})
          .filter(range => _doesRangeMatchSampleCount({range, sampleCount:noteSampleCount, tolerancePercent:.05}))
    } 
  });
  
  
}