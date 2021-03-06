import { findIntervals } from 'audio/peakAnalyzer';
import { timeToSampleCount } from 'audio/sampleUtil';

const FREQUENCY_TOLERANCE_DETECT = .15;
const MAXIMUM_PEAK_COUNT_GAP = 5;

/*
Problem:
If FREQUENCY_TOLERANCE_DETECT set too low (e.g. .1) will not select enough of the note.
If FREQUENCY_TOLERANCE_DETECT set too high (e.g. .2) will select ranges that belong to a different note close to the target note's frequency.
There is no middle number that avoids both bad things. And if there was, I'd not trust it in varied recording environments.

#1 Just read through code to find potential errors in current alg.

#2
2 tolerances - one for peak-to-peak and the other for an average across all peaks that match.
PeakToPeakTolerance = .2
RangeFrequencyTolerance = .05

#3
Set note pitches further apart so you can use high tolerance.

#4
Try different octaves.


 */

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

function _joinGappedRanges({ ranges, targetFrequency, sampleRate }) {
  if (ranges.length < 2) return ranges;

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
      if (_toSampleMatchesPreviousJoinedRange({range})) {
        lastJoinedRange.toSampleNo = nextRange.toSampleNo;
      } else {
        lastJoinedRange = {fromSampleNo:range.fromSampleNo, toSampleNo:ranges[rangeI + 1].toSampleNo};
        joinedRanges.push(lastJoinedRange);
      }
      continue;
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
  const intervals = findIntervals({ samples, sampleRate, signalThreshold });
  const ranges = _consolidateAndFilterIntervalsToRanges({ intervals, sampleRate, targetFrequency });
  return _joinGappedRanges({ ranges, sampleRate, targetFrequency });
}

export const UNIT_TESTING_EXPORTS = {
  _calcFrequencyDetectTolerance,
  _calcMaximumJoinGap,
  _consolidateAndFilterIntervalsToRanges,
  _joinGappedRanges
};