import { theAudioContext, attachSource, clearSources, releaseSource, getSources } from "audio/theAudioContext";
import { sampleCountToTime } from "./sampleUtil";

export function playAudioBufferRange({audioBuffer, sampleNo, sampleCount, onEnded}) {
  const ac = theAudioContext();
  const source = ac.createBufferSource();
  attachSource({source});
  source.buffer = audioBuffer;
  source.connect(ac.destination);
  const sampleRate = audioBuffer.sampleRate;
  const offset = sampleCountToTime({sampleRate, sampleCount:sampleNo});
  const duration = sampleCountToTime({sampleRate, sampleCount});
  const listener = source.addEventListener('ended', (event) => {
    source.removeEventListener('ended', listener);
    releaseSource({source});
    if (onEnded) onEnded({wasStopped:source.wasStopped});
  });
  source.start(0, offset, duration);
  return source;
}

export function playAudioBuffer({audioBuffer, onEnded}) {
  const ac = theAudioContext();
  const source = ac.createBufferSource();
  attachSource({source});
  source.buffer = audioBuffer;
  source.connect(ac.destination);
  const listener = source.addEventListener('ended', () => {
    source.removeEventListener('ended', listener);
    releaseSource({source});
    if (onEnded) onEnded({wasStopped:source.wasStopped});
  });
  source.start(0);
  return source;
}

export function stopAll() {
  const sources = getSources();
  sources.forEach(source => {
    source.wasStopped = true;
    source.stop(0);
  });
  clearSources();
}