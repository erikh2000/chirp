import { theAudioContext } from "audio/theAudioContext";
import { sampleCountToTime } from "./sampleUtil";

export function playAudioBufferRange({audioBuffer, sampleNo, sampleCount}) {
  const ac = theAudioContext();
  const source = ac.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ac.destination);
  const sampleRate = audioBuffer.sampleRate;
  const offset = sampleCountToTime({sampleRate, sampleCount:sampleNo});
  const duration = sampleCountToTime({sampleRate, sampleCount});
  source.start(0, offset, duration);
}