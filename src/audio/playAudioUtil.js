import { theAudioContext, attachSource, clearSources, releaseSource, getSources } from "audio/theAudioContext";
import { sampleCountToTime } from "./sampleUtil";

export function playAudioBufferRange({audioBuffer, time, duration, onEnded}) {
  const ac = theAudioContext();
  const source = ac.createBufferSource();
  attachSource({source});
  source.buffer = audioBuffer;
  source.connect(ac.destination);
  const listener = source.addEventListener('ended', (event) => { // TODO listener is undefined
    source.removeEventListener('ended', listener);
    releaseSource({source});
    if (onEnded) onEnded({wasStopped:source.wasStopped});
  });
  source.start(0, time, duration);
  return source;
}

export function playAudioBuffer({audioBuffer, onEnded}) {
  const ac = theAudioContext();
  const source = ac.createBufferSource();
  attachSource({source});
  source.buffer = audioBuffer;
  source.connect(ac.destination);
  const listener = source.addEventListener('ended', () => { // TODO listener is undefined
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