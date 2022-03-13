import WaveEncoder, { DEFAULT_SAMPLE_RATE } from "audio/waveEncoder";
import { LATEST } from "audio/waveCodecs";

export function encodeStartSession() {
  const { startSessionNotes, noteDuration, silencePadDuration } = LATEST;
  const waveEncoder = new WaveEncoder({sampleRate:DEFAULT_SAMPLE_RATE});
  startSessionNotes.forEach(frequency => {
    waveEncoder.appendSineNote({frequency, duration: noteDuration - silencePadDuration});
    waveEncoder.appendSilence({duration: silencePadDuration});
  });
  return waveEncoder.getAudioBuffer();
}

export function calcStartToneDuration() {
  const { startSessionNotes, noteDuration } = LATEST;
  return startSessionNotes.length * noteDuration;
}