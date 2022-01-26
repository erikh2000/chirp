import { LATEST } from './waveCodecs';
import { theAudioContext } from 'audio/theAudioContext';

class WaveEncoder {
    constructor() {
      this.sampleRate = 44100;
      this.audioBuffers = [];
      this.codec = LATEST;
    }

    _createBuffer = ({duration}) => {
      const newBuffer = theAudioContext().createBuffer(1, this.sampleRate * duration, this.sampleRate);
      const samples = newBuffer.getChannelData(0);
      return [newBuffer, samples];
    }

    _getSampleCount = ({buffers}) => {
      let count = 0;
      buffers.forEach(buffer => count += buffer.length);
      return count;
    }

    _combineBuffers = ({buffers}) => {
      if (buffers.length === 0) return null;
      
      if (buffers.length > 1) {
        const combinedSampleCount = this._getSampleCount({buffers});
        const combinedBuffer = theAudioContext().createBuffer(1, combinedSampleCount, this.sampleRate);
        const combinedSamples = combinedBuffer.getChannelData(0);

        let writeI = 0;
        buffers.forEach(fromBuffer => {
          const fromSamples = fromBuffer.getChannelData(0);
          for(let readI = 0; readI < fromSamples.length; ++readI) {
            combinedSamples[writeI++] = fromSamples[readI];
          }
        });

        buffers = [];
        buffers.push(combinedBuffer);
      }
      
      return buffers[0]; 
    }

    _isSquareOn = ({sampleNo, sampleRate, frequency}) => {
      const onSampleInterval = (1 / frequency) * sampleRate;
      const intervalPosition = sampleNo % onSampleInterval;
      return intervalPosition / onSampleInterval < .5;
    }

    appendSquareNote = ({frequency, duration}) => {
      const [newBuffer, samples] = this._createBuffer({duration});
      for (let i = 0; i < samples.length-1; i++) {
        samples[i] = this._isSquareOn({sampleNo:i, sampleRate:this.sampleRate, frequency}) ? 1 : -1;
      }
      samples[samples.length-1] = 0;
      this.audioBuffers.push(newBuffer);
    }

    appendSineNote = ({frequency, duration}) => {
      const [newBuffer, samples] = this._createBuffer({duration});
      const onSampleInterval = (1 / frequency) * this.sampleRate;
      for (let i = 0; i < samples.length-1; i++) {
        const intervalPosition = (i % onSampleInterval) / onSampleInterval;
        samples[i] = Math.sin(intervalPosition * Math.PI * 2);
      }
      samples[samples.length-1] = 0;
      this.audioBuffers.push(newBuffer);
    }

    appendSilence = ({duration}) => {
      const [newBuffer] = this._createBuffer({duration});
      this.audioBuffers.push(newBuffer);
    }

    appendOnBit = () => {
      this.appendSineNote({frequency:this.codec.bitFrequency, duration:this.codec.bitDuration - this.codec.silencePadDuration});
      this.appendSilence({duration:this.codec.silencePadDuration});
    }

    appendOffBit = () => {
      this.appendSilence({duration:this.codec.bitDuration});
    }

    appendBits = ({bits}) => {
      bits.forEach(bit => {
        if (bit) {
          this.appendOnBit();
        } else {
          this.appendOffBit();
        }
      });
    }
  
    appendWhiteNoise = ({duration}) => {
      const [newBuffer, samples] = this._createBuffer({duration});
      for (let i = 0; i < samples.length; i++) {
        samples[i] = Math.random() * 2 - 1;
      }
      samples[samples.length-1] = 0;
      this.audioBuffers.push(newBuffer);
    }

    getAudioBuffer = () => {
      return this._combineBuffers({buffers:this.audioBuffers});
    }

    play = () => {
      const audioBuffer = this.getAudioBuffer();
      if (!audioBuffer) return;

      const source = theAudioContext().createBufferSource();
      source.buffer = audioBuffer;
      source.connect(theAudioContext().destination);
      source.start();
    }

    getSamples = () => {
      const audioBuffer = this.getAudioBuffer();
      if (!audioBuffer) return [];
      return audioBuffer.getChannelData(0);
    }

    clear = () => this.audioBuffers = [];
  }
  
  export default WaveEncoder;
  