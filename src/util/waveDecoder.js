import RollingAverage from './rollingAverage';
import RollingMax from './rollingMax';
import { LATEST } from './waveCodecs';
import { Note } from './notes';

class WaveDecoder {
  constructor({audioBuffer}) {
    this.sampleRate = audioBuffer.sampleRate;
    this.audioBuffer = audioBuffer;
    this.samples = audioBuffer.getChannelData(0);
    this.codec = LATEST;
  }

  _findVolumeCeiling = ({samples}) => {
    let loudestSample = 0;
    for(let i = 0; i < samples.length; ++i) { // TODO: maybe revise later to drop outliers. Maybe use RMS chunks which would average out isolated spikes.
      const sample = Math.abs(samples[i]);
      if (sample > loudestSample) loudestSample = sample;
    }
    return loudestSample;
  };

  _findSignalInSamples = ({samples, signalThreshold, sampleNo}) => {
    let i = sampleNo;
    while (i < samples.length && samples[i] < signalThreshold) ++i;
    return i === samples.length ? -1 : i;
  }

  _findPeakInSamples = ({samples, sampleNo}) => {
    let i = sampleNo;
    let maxAmplitude = 0; // Anything beats.
    while (i < samples.length && samples[i] >= maxAmplitude) maxAmplitude = samples[i++];
    return i === samples.length || i === 0 ? -1 : i - 1;
  }

  _findSilenceInSamples = ({samples, signalThreshold, sampleNo}) => {
    let i = sampleNo;
    while (i < samples.length && samples[i] >= signalThreshold) ++i;
    return i === samples.length ? -1 : i;
  }

  // How many signal peaks should comprise one "bit" tone?
  _calcPeaksPerBit = ({codec}) => (codec.bitDuration - codec.silencePadDuration) * codec.bitFrequency;

  // How many signal peaks should be used to detect a "bit" tone?
  _calcMinPeaksToDetectBit = ({codec}) => {
    const AMPLE_COUNT = 20; // As long as no competing sound is playing over the bit signal, this should be enough peaks to confidently identify a bit.
    const peaksPerBit = this._calcPeaksPerBit({codec});
    return peaksPerBit > AMPLE_COUNT ? AMPLE_COUNT : peaksPerBit;
  }

  _sampleCountToTime = ({sampleCount, sampleRate}) => sampleCount / sampleRate;

  _timeToSampleCount = ({time, sampleRate}) => time * sampleRate;

  _calcIntervalDuration = ({firstSampleNo, secondSampleNo, sampleRate}) => (secondSampleNo - firstSampleNo) / sampleRate;

  findBits = () => {
    const CEILING_SILENCE_RATIO = .1;
    const PEAK_SILENCE_RATIO = .4;
    const INAUDIBLE_PEAK_INTERVAL = Note.C0;
    const FREQUENCY_DETECTION_TOLERANCE = this.codec.bitFrequency * .05;

    const sampleRate = this.sampleRate, samples = this.samples, sampleCount = samples.length;
    const volumeCeiling = this._findVolumeCeiling({samples});
    let signalThreshold = volumeCeiling * CEILING_SILENCE_RATIO; // This gets adjusted as peaks are found.

    const samplesPerBit = this.codec.bitDuration * sampleRate;
    const minPeaksToDetectBit = this._calcMinPeaksToDetectBit({codec:this.codec});
    const rollingFrequencyAverage = new RollingAverage({capacity:minPeaksToDetectBit});
    const rollingAmplitudeMax = new RollingMax({capacity:minPeaksToDetectBit});

    const foundABit = () => rollingFrequencyAverage.isAtCapacity() && (rollingFrequencyAverage.getAverage() - this.codec.bitFrequency) < FREQUENCY_DETECTION_TOLERANCE;

    const bits = [];
    let sampleNo = this._findSignalInSamples({samples, signalThreshold, sampleNo:0});
    const INFINITELY_LOOPING = 1000000;
    let loopCount = 0;
    while (sampleNo !== -1 && sampleNo < sampleCount && ++loopCount !== INFINITELY_LOOPING) {
      // Top of loop always starts with sampleNo at a peak. Find the next peak and the interval between them.
      let nextSampleNo = this._findSilenceInSamples({samples, signalThreshold, sampleNo});
      if (nextSampleNo === -1) return bits;
      nextSampleNo = this._findSignalInSamples({samples, signalThreshold, sampleNo:nextSampleNo});
      if (nextSampleNo === -1) return bits;
      nextSampleNo = this._findPeakInSamples({samples, sampleNo:nextSampleNo});
      if (nextSampleNo === -1) return bits;
      const intervalDuration = this._calcIntervalDuration({firstSampleNo:sampleNo, secondSampleNo:nextSampleNo, sampleRate});
      const nextPeakAmplitude = samples[nextSampleNo];

      if (intervalDuration > INAUDIBLE_PEAK_INTERVAL) {
        rollingFrequencyAverage.clear();
        rollingAmplitudeMax.clear();
        rollingAmplitudeMax.add({number:nextPeakAmplitude});
        signalThreshold = nextPeakAmplitude * PEAK_SILENCE_RATIO;
        sampleNo = nextSampleNo;
        continue;
      }

      const intervalHertz = 1 / intervalDuration;
      rollingFrequencyAverage.add({number:intervalHertz});
      rollingAmplitudeMax.add({number:nextPeakAmplitude});
      signalThreshold = rollingAmplitudeMax.getMax() * PEAK_SILENCE_RATIO;
      if (foundABit()) {
        bits.push(sampleNo);
        sampleNo += samplesPerBit; // Advance to next place to look for a bit.
        if (sampleNo >= sampleCount) return bits;
        sampleNo = this._findSignalInSamples({samples, signalThreshold, sampleNo});
        continue;
      }

      sampleNo = nextSampleNo;
    }

    return bits;
  };

  calcBitIntervalSampleCount = () => this._timeToSampleCount({time:this.codec.bitDuration, sampleRate:this.sampleRate});
}

export default WaveDecoder;