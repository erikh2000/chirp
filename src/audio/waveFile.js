import { theAudioContext } from 'audio/theAudioContext';

class WaveFile {
  constructor({fileData}) {
    this.fileData = fileData;   // Raw bytes of WAV file.
  }

  _load = () => {
    const that = this;
    return new Promise(function(resolve, reject) {
      theAudioContext().decodeAudioData(that.fileData, function(audioBuffer) {
            resolve({audioBuffer});
        }, (e) => {
            reject(Error("Error decoding audio data " + e.err));
        });
    });
  }

  static load = ({fileData}) => {
    const waveFile = new WaveFile({fileData});
    return waveFile._load();
  }
}

export default WaveFile;
