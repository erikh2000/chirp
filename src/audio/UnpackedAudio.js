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

  getChannelData(channelI) { // I'm not sure if this survives localForage unpacking. It might be better to just have UnpackedAudio be data-only.
    return this.channelSamples[channelI];
  }
}

export function toAudioBuffer({unpackedAudio}) {
  const audioBuffer = new AudioBuffer({
    length:unpackedAudio.length, 
    numberOfChannels:unpackedAudio.numberOfChannels,
    sampleRate:unpackedAudio.sampleRate,
  });
  for(let channelI = 0; channelI < unpackedAudio.numberOfChannels; ++channelI) {
    audioBuffer.copyToChannel(unpackedAudio.channelSamples[channelI], channelI);
  }
  return audioBuffer;
}

export default UnpackedAudio;