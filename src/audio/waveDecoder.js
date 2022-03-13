import { findRangesForFrequency } from './frequencyAnalyzer';
import { findVolumeCeiling, timeToSampleCount } from './sampleUtil';

function _calcSignalThreshold({samples}) {
  const CEILING_SILENCE_RATIO = .04;
  const volumeCeiling = findVolumeCeiling({samples});
  return volumeCeiling * CEILING_SILENCE_RATIO;
}

function _doesRangeMatchSampleCount({range, minSampleCount, maxSampleCount}) {
  const rangeSampleCount = range.toSampleNo - range.fromSampleNo;
  return (rangeSampleCount >= minSampleCount && rangeSampleCount <= maxSampleCount);
}

function _calcAverage(numbers) {
  let sum = 0;
  numbers.forEach(number => sum += number);
  return Math.round(sum / numbers.length);
}

function _FindNoteAtSampleNo({notePositions, sampleNo, toleranceSampleCount}) {
  for(let positionI = 0; positionI < notePositions.length; ++positionI) {
    if (Math.abs(sampleNo - notePositions[positionI]) <= toleranceSampleCount) return notePositions[positionI];
  }
  return null;
}

export function findNotes({audioBuffer, notes, noteDuration, silencePadDuration}) {
  const samples = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const signalThreshold = _calcSignalThreshold({ samples });
  const noteSampleCount = timeToSampleCount({time:noteDuration, sampleRate});
  const toleranceSampleCount = timeToSampleCount({time:noteDuration * .05, sampleRate});
  const minSampleCount = timeToSampleCount({time:noteDuration-silencePadDuration, sampleRate}) - toleranceSampleCount;
  const maxSampleCount = noteSampleCount + toleranceSampleCount;
  
  const notesPositions = notes.map(targetFrequency => {
    const ranges = findRangesForFrequency({samples, sampleRate, targetFrequency, signalThreshold});
    const noteRanges = ranges.filter(range => _doesRangeMatchSampleCount({range, minSampleCount, maxSampleCount}));
    const positions = noteRanges.map(range => range.fromSampleNo);
    return { targetFrequency, positions };
  });
  
  const startPositionGuesses = [];
  const firstNotePositions = notesPositions[0].positions;
  for(let firstNoteI = 0; firstNoteI < firstNotePositions.length; ++firstNoteI) {
    const firstNoteSampleNo = firstNotePositions[firstNoteI];
    startPositionGuesses.length = 0;
    startPositionGuesses.push(firstNoteSampleNo);
    let noteI;
    for(noteI = 1; noteI < notes.length; ++noteI) {
      const noteOffset = (noteI * noteSampleCount);
      const sampleNo = firstNoteSampleNo + noteOffset;
      const foundSampleNo = _FindNoteAtSampleNo({notePositions:notesPositions[noteI].positions, sampleNo, toleranceSampleCount});
      if (foundSampleNo === null) break;
      startPositionGuesses.push(foundSampleNo - noteOffset);
    }
    if (noteI < notes.length) continue; // No match of all notes in sequence found.
    
    return _calcAverage(startPositionGuesses);
  }
  
  return null;
}