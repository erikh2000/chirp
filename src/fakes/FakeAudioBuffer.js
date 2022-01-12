// Add methods/members as needed to satisfy test requirements.
class FakeAudioBuffer {
  constructor({samples, sampleRate}) {
    this.samples = samples;
    this.sampleRate = sampleRate;
  }

  getChannelData = () => this.samples;
}

export default FakeAudioBuffer;