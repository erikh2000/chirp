import { theAudioContext } from 'audio/theAudioContext';

export async function waveFileDataToAudioBuffer({fileData}) {
  try {
    const ac = theAudioContext(); // It would be nicer to use offline audio context, but then it's a chicken-and-egg problem to learn sample rate, sample count, channels needed to inialize offlineAudioContext().
    const audioBuffer = await ac.decodeAudioData(fileData);
    return {audioBuffer};
  } catch(exception) {
    console.error(exception);
    return null;
  }
}

export function audioBufferToWaveFile({audioBuffer}) {
  function setUint16(value) {
    view.setUint16(writeOffset, value, true);
    writeOffset += 2;
  }
  
  function setUint32(value) {
    view.setUint32(writeOffset, value, true);
    writeOffset += 4;
  }

  const WAVE_HEADER_SIZE = 44;
  const channelCount = audioBuffer.numberOfChannels;
  const fileLength = audioBuffer.length * channelCount * 2 + WAVE_HEADER_SIZE;
  const buffer = new ArrayBuffer(fileLength);
  const view = new DataView(buffer);
  const channels = [];
  let readOffset = 0;
  let writeOffset = 0;

  // write WAVE header
  setUint32(0x46464952);                         // "RIFF"
  setUint32(fileLength - 8);                         // file length - 8
  setUint32(0x45564157);                         // "WAVE"

  setUint32(0x20746d66);                         // "fmt " chunk
  setUint32(16);                                 // length = 16
  setUint16(1);                                  // PCM (uncompressed)
  setUint16(channelCount);
  setUint32(audioBuffer.sampleRate);
  setUint32(audioBuffer.sampleRate * 2 * channelCount); // avg. bytes/sec
  setUint16(channelCount * 2);                      // block-align
  setUint16(16);                                 // 16-bit (hardcoded in this demo)

  setUint32(0x61746164);                         // "data" - chunk
  setUint32(fileLength - writeOffset - 4);                   // chunk length

  // write interleaved data
  for(let channelI = 0; channelI < channelCount; ++channelI) {
    channels.push(audioBuffer.getChannelData(channelI));
  }

  while(writeOffset < fileLength) {
    for(let channelI = 0; channelI < channelCount; ++channelI) {             // interleave channels
      let sample = Math.max(-1, Math.min(1, channels[channelI][readOffset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
      view.setInt16(writeOffset, sample, true);          // write 16-bit sample
      writeOffset += 2;
    }
    ++readOffset;                                     // next source sample
  }

  // create Blob
  return new Blob([buffer], {type: "audio/wav"});
}