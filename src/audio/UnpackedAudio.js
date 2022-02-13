/* This holds data from AudioBuffer in a format that allows it to be persisted with LocalForage.
   Don't add methods. They won't survive (de)serialization. */
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