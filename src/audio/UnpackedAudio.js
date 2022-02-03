/* This is basically an AudioBuffer wrapper that allows that data to be persisted with LocalForage.
   Methods should mirror as much as you need of AudioBuffer's interface. */
class UnpackedAudio {
  constructor({audioBuffer}) {
    this.numberOfChannels = audioBuffer.numberOfChannels;
    this.duration = audioBuffer.duration;
    this.length = audioBuffer.length;
    this.sampleRate = audioBuffer.sampleRate;
    this.channelSamples = [];
    for(let channelI = 0; channelI < this.numberOfChannels; ++channelI) {
      let samples = audioBuffer.getChannelData(channelI);
      this.channelSamples[channelI] = samples;
    }
  }

  getChannelData(channelI) {
    return this.channelSamples[channelI];
  }
}

export default UnpackedAudio;