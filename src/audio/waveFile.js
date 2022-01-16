class WaveFile {
  constructor({fileData}) {
    this.fileData = fileData;   // Raw bytes of WAV file.

    if (!WaveFile.audioContext) WaveFile.audioContext = new AudioContext();
    this.audioContext = WaveFile.audioContext;
  }

  _load = () => {
    const that = this;
    return new Promise(function(resolve, reject) {
        that.audioContext.decodeAudioData(that.fileData, function(audioBuffer) {
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

WaveFile.audioContext = null;

export default WaveFile;
