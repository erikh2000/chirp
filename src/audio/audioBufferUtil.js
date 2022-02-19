export function createAudioBufferForRange({audioBuffer, sampleNo, sampleCount}) {
  const newAudioBuffer = new AudioBuffer({
    length:sampleCount, 
    numberOfChannels:audioBuffer.numberOfChannels,
    sampleRate:audioBuffer.sampleRate,
  });
  for(let channelI = 0; channelI < audioBuffer.numberOfChannels; ++channelI) {
    const rangeSamples = newAudioBuffer.getChannelData(channelI);
    audioBuffer.copyFromChannel(rangeSamples, channelI, sampleNo);
    // copyToChannel() below seems redundant. But after reading https://webaudio.github.io/web-audio-api/#acquire-the-content 
    // I'm unsure if I can count on writing to rangeSamples to also update newAudioBuffer on all browsers.
    newAudioBuffer.copyToChannel(rangeSamples, channelI); 
  }
  return newAudioBuffer;
}

function _findAudioBufferStats({audioBuffers}) {
  let sampleCount = 0, maxChannelCount = 1;
  audioBuffers.forEach(audioBuffer => {
    sampleCount += audioBuffer.length;
    if (audioBuffer.numberOfChannels > maxChannelCount) maxChannelCount = audioBuffer.numberOfChannels;
  });
  return [audioBuffers[0].sampleRate, sampleCount, maxChannelCount];
}

// All audioBuffers must be same sampleRate. If there are varied channel counts, the largest will be used.
export function combineAudioBuffers({audioBuffers}) {
  const [sampleRate, combinedSampleCount, numberOfChannels] = _findAudioBufferStats({audioBuffers}); 
  
  const combinedAudioBuffer = new AudioBuffer({length:combinedSampleCount, numberOfChannels,sampleRate});

  let writePos = 0;
  audioBuffers.forEach(audioBuffer => {
    for(let toChannelI = 0; toChannelI < numberOfChannels; ++toChannelI) {
      const fromChannelI = toChannelI >= audioBuffer.numberOfChannels ? 0 : toChannelI;
      const fromSamples = audioBuffer.getChannelData(fromChannelI);
      combinedAudioBuffer.copyToChannel(fromSamples, toChannelI, writePos);
    }
    writePos += audioBuffer.length;
  });

  return combinedAudioBuffer;
}