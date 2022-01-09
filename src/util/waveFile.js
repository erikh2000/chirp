class WaveFile {
  constructor({fileData}) {
    this.fileData = fileData;   // Raw bytes of WAV file.
    this.isLoaded = false;      // Is the WAV loaded?

    if (!WaveFile.audioContext) WaveFile.audioContext = new AudioContext();
    this.audioContext = WaveFile.audioContext;
  }

  _load = () => {
    const that = this;
    return new Promise(function(resolve, reject) {
        that.audioContext.decodeAudioData(that.fileData, function(audioBuffer) {
            that.audioBuffer = audioBuffer;
            that.isLoaded = true;
            resolve({wave:that});
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
