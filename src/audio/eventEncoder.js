import WaveEncoder, { DEFAULT_SAMPLE_RATE } from "audio/waveEncoder";
import { LATEST } from "audio/waveCodecs";

class EventEncoder {
  constructor({sampleRate = DEFAULT_SAMPLE_RATE}) {
    this.waveEncoder = new WaveEncoder({sampleRate});
  }
  
  encodeStartSession() {
    const { startSessionNotes, noteDuration } = LATEST; 
    this.waveEncoder.clear();
    startSessionNotes.forEach(frequency =>
      this.waveEncoder.appendSineNote({frequency, duration:noteDuration})
    );
    return this.waveEncoder.getAudioBuffer();
  }
}

export default EventEncoder;
