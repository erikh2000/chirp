import { Note } from './notes';
import { findPeaks } from './peakAnalyzer';
import { timeToSampleCount } from './sampleUtil';

const FREQUENCY_TOLERANCE_DETECT = .1;
const MAXIMUM_PEAK_COUNT_GAP = 5;
const INAUDIBLE_PEAK_INTERVAL = 1 / Note.C0;

function _peaksToIntervals({ peaks }) {
  if (peaks.length < 2) return [];

  const intervals = [];
  if (peaks[0] !== 0) intervals.push(peaks[0]);

  for (let peakI = 0; peakI < peaks.length - 1; ++peakI) {
    const interval = peaks[peakI + 1] - peaks[peakI];
    intervals.push(interval);
  }

  return intervals;
}

function _calcFrequencyDetectTolerance({targetFrequency, sampleRate}) { 
  return timeToSampleCount({time:1 / targetFrequency, sampleRate}) * FREQUENCY_TOLERANCE_DETECT; 
}

function _consolidateAndFilterIntervalsToRanges({ intervals, targetFrequency, sampleRate }) {
  if (!intervals.length) return [];

  const ranges = [];
  const frequencyDetectTolerance = _calcFrequencyDetectTolerance({targetFrequency, sampleRate });
  const targetInterval = timeToSampleCount({ time:1 / targetFrequency, sampleRate });
  
  let insideRange = false, sampleNo = 0, fromSampleNo;
  for (let intervalI = 0; intervalI < intervals.length; ++intervalI) {
    const interval = intervals[intervalI];
    const doesIntervalMatchFrequency = Math.abs(interval - targetInterval) <= frequencyDetectTolerance;
    if (insideRange) {
      if (!doesIntervalMatchFrequency) {
        ranges.push({ fromSampleNo, toSampleNo: sampleNo });
        insideRange = false;
      }
    } else {
      if (doesIntervalMatchFrequency) {
        fromSampleNo = sampleNo;
        insideRange = true;
      }
    }
    sampleNo += interval;
  }

  if (insideRange) {
    ranges.push({ fromSampleNo, toSampleNo: sampleNo });
  }

  return ranges;
}

function _calcMaximumJoinGap({ targetFrequency, sampleRate }) {
  const frequencyDetectTolerance = _calcFrequencyDetectTolerance({targetFrequency, sampleRate});
  const targetFrequencyInterval = timeToSampleCount({time:1 / targetFrequency, sampleRate});
  return (targetFrequencyInterval * MAXIMUM_PEAK_COUNT_GAP) + frequencyDetectTolerance;
}

function _calcSamplesToAlignment({sampleNo, alignmentInterval}) {
  const offsetPastPreviousAligment = sampleNo % alignmentInterval;
  return offsetPastPreviousAligment > alignmentInterval / 2 
    ? alignmentInterval - offsetPastPreviousAligment // It's closer to next alignment point than previous.
    : offsetPastPreviousAligment;
}

function _joinGappedRanges({ ranges, targetFrequency, sampleRate }) {
  if (ranges.length < 2) return ranges;

  const frequencyDetectTolerance = _calcFrequencyDetectTolerance({targetFrequency, sampleRate});
  const targetFrequencyInterval = timeToSampleCount({time:1 / targetFrequency, sampleRate});
  const maxGap = _calcMaximumJoinGap({targetFrequency, sampleRate});
  const PREVENT_JOIN = maxGap + 1;
  const joinedRanges = [];
  let lastJoinedRange = null;

  const _toSampleMatchesPreviousJoinedRange = ({range}) => lastJoinedRange && lastJoinedRange.toSampleNo === range.toSampleNo;

  for (let rangeI = 0; rangeI < ranges.length; ++rangeI) {
    const range = ranges[rangeI];
    const nextRange = rangeI === ranges.length - 1 ? null : ranges[rangeI + 1];
    const rangeGap = nextRange 
      ? ranges[rangeI + 1].fromSampleNo - ranges[rangeI].toSampleNo
      : PREVENT_JOIN; // Don't try joining the very last range.
    if (rangeGap <= maxGap) {
      // const joinedSampleCount = (range.toSampleNo - range.fromSampleNo) + rangeGap + (nextRange.toSampleNo - range.fromSampleNo);
      // const gapFrequencyAlignment = _calcSamplesToAlignment({sampleNo:joinedSampleCount, alignmentInterval:targetFrequencyInterval});
      // if (gapFrequencyAlignment < frequencyDetectTolerance) {
        if (_toSampleMatchesPreviousJoinedRange({range})) {
          lastJoinedRange.toSampleNo = nextRange.toSampleNo;
        } else {
          lastJoinedRange = {fromSampleNo:range.fromSampleNo, toSampleNo:ranges[rangeI + 1].toSampleNo};
          joinedRanges.push(lastJoinedRange);
        }
        continue;
      // }
    }

    // Range can't be joined.
    if (!_toSampleMatchesPreviousJoinedRange({range})) {
      lastJoinedRange = range;
      joinedRanges.push(range);
    }
  }

  return joinedRanges;
}

export function findRangesForFrequency({ samples, sampleRate, targetFrequency, signalThreshold }) {
  const peaks = findPeaks({ samples, sampleRate, signalThreshold });
  console.log({peaks});
  const intervals = _peaksToIntervals({ peaks, sampleRate });
  console.log({intervals});
  const ranges = _consolidateAndFilterIntervalsToRanges({ intervals, sampleRate, targetFrequency });
  const joinedRanges = _joinGappedRanges({ ranges, sampleRate, targetFrequency });
  return joinedRanges;
}

export const UNIT_TESTING_EXPORTS = {
  INAUDIBLE_PEAK_INTERVAL,
  _calcFrequencyDetectTolerance,
  _calcMaximumJoinGap,
  _consolidateAndFilterIntervalsToRanges,
  _joinGappedRanges,
  _peaksToIntervals
};