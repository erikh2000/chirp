/* The value below should be arrived at by using the largest number that won't cause noticable 
   differences in most, but not all, operations the chunks might be used for. */

export const DEFAULT_CHUNK_DURATION = 1 / 20;

function _calcRmsFromAudioSection({startPos, endPos, samples}) {
  let rmsTotal = 0, sampleCountForRms = 0;
  for (let i = startPos; i < endPos; ++i) {
    rmsTotal += (samples[i] * samples[i]);
    ++sampleCountForRms;
  }
  return (sampleCountForRms === 0) ? 0 : Math.sqrt(rmsTotal / sampleCountForRms);
}

export function calcRmsChunksFromSamples({samples, sampleRate, chunkDuration = DEFAULT_CHUNK_DURATION}) {
  const samplesPerChunk = Math.ceil(sampleRate * chunkDuration);
  
  let startPos = 0, endPos;
  const chunks = [];
  while (startPos < samples.length) {
    endPos = startPos + samplesPerChunk;
    if (endPos > samples.length) endPos = samples.length;
    const rms = _calcRmsFromAudioSection({startPos, endPos, samples});
    chunks.push(rms);
    startPos = endPos;
  }
  return chunks;
}

export function rmsValueForSampleNo({sampleNo, sampleRate, chunks, chunkDuration = DEFAULT_CHUNK_DURATION}) {
  const samplesPerChunk = Math.ceil(sampleRate * chunkDuration);
  let chunkNo = Math.floor(sampleNo / samplesPerChunk);
  if (chunkNo >= chunks.length) chunkNo = chunks.length - 1;
  return chunks[chunkNo];
}

export function findRmsCeiling({chunks}) {
  let ceiling = 0;
  chunks.forEach(rms => {
    if (rms > ceiling) ceiling = rms;
  })
  return ceiling;
}

function _timeToChunkI({time, chunkDuration}) {
  return Math.floor(time / chunkDuration);  
}

export function findSilenceTrimmedRange({time, duration, rmsSignalThreshold, marginDuration, chunks, chunkDuration = DEFAULT_CHUNK_DURATION}) {
  let leftChunkI = _timeToChunkI({time, chunkDuration});
  let rightChunkI = _timeToChunkI({time:time + duration, chunkDuration});
  if (leftChunkI < 0 || leftChunkI >= chunks.length || rightChunkI < leftChunkI || rightChunkI >= chunks.length) return [time, duration];
  
  while (leftChunkI < rightChunkI - 1 && chunks[leftChunkI] < rmsSignalThreshold) ++leftChunkI;
  while (rightChunkI > leftChunkI + 1 && chunks[rightChunkI] < rmsSignalThreshold) --rightChunkI;
  
  const trimmedTime = Math.max((leftChunkI * chunkDuration) - marginDuration, time);
  const rightTime = time + duration;
  const trimmedRightTime = Math.min((rightChunkI * chunkDuration) + marginDuration, rightTime);
  const trimmedDuration = trimmedRightTime - trimmedTime;
  return [trimmedTime, trimmedDuration];
}