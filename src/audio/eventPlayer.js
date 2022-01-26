import EventEncoder from "./eventEncoder";
import { theAudioContext } from 'audio/theAudioContext';

function _playAudioBuffer({audioBuffer}) {
  const ac = theAudioContext();
  const source = ac.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ac.destination);
  source.start();
}

class EventPlayer {
  constructor() {
    this.eventEncoder = new EventEncoder();
    this.startLineAudioBuffers = {};
    this.retakeLineAudioBuffer = null;
    this.endLineAudioBuffer = null;
  }

  playStartLine = ({lineNo}) => {
    let audioBuffer = this.startLineAudioBuffers[lineNo];
    if (!audioBuffer) {
      audioBuffer = this.startLineAudioBuffers[lineNo] = this.eventEncoder.encodeStartLine({lineNo});
    }
    _playAudioBuffer({audioBuffer});
    return audioBuffer;
  }

  playEndLine = () => {
    if (!this.endLineAudioBuffer) this.endLineAudioBuffer = this.eventEncoder.encodeEndLine();
    _playAudioBuffer({audioBuffer:this.endLineAudioBuffer});
  }

  playRetakeLine = () => {
    if (!this.retakeLineAudioBuffer) this.retakeLineAudioBuffer = this.eventEncoder.encodeRetakeLine();
    _playAudioBuffer({audioBuffer:this.retakeLineAudioBuffer});
  }
}

export default EventPlayer;
