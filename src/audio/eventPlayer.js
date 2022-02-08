import EventEncoder from "./eventEncoder";
import { playAudioBuffer } from 'audio/playAudioUtil';

class EventPlayer {
  constructor() {
    this.eventEncoder = new EventEncoder();
    this.startLineAudioBuffers = {};
    this.retakeLineAudioBuffer = null;
    this.endLineAudioBuffer = null;
    this.isPlaying = false;
    this.onPlayStateChange = null;
  }

  _onEnded = () => {
    this.isPlaying = false;
    if (this.onPlayStateChange) this.onPlayStateChange({isPlaying:false});
  }

  _onPlaying = () => {
    this.isPlaying = true;
    if (this.onPlayStateChange) this.onPlayStateChange({isPlaying:true});
  }

  _warnIfAlreadyPlaying = () => {
    if (!this.isPlaying) return false;
    console.warn('Tried to play event audio while another was already playing.');
    return true;
  }

  setOnPlayStateChange({onPlayStateChange}) {
    this.onPlayStateChange = onPlayStateChange;
  }

  playStartLine = ({lineNo}) => {
    if (this._warnIfAlreadyPlaying()) return;
    let audioBuffer = this.startLineAudioBuffers[lineNo];
    if (!audioBuffer) {
      audioBuffer = this.startLineAudioBuffers[lineNo] = this.eventEncoder.encodeStartLine({lineNo});
    }
    if (!playAudioBuffer({audioBuffer, onEnded:this._onEnded})) return false;
    this._onPlaying();
    return true;
  }

  playEndLine = () => {
    if (this._warnIfAlreadyPlaying()) return;
    if (!this.endLineAudioBuffer) this.endLineAudioBuffer = this.eventEncoder.encodeEndLine();
    if (!playAudioBuffer({audioBuffer:this.endLineAudioBuffer, onEnded:this._onEnded})) return false;
    this._onPlaying();
    return true;
  }

  playRetakeLine = () => {
    if (this._warnIfAlreadyPlaying()) return;
    if (!this.retakeLineAudioBuffer) this.retakeLineAudioBuffer = this.eventEncoder.encodeRetakeLine();
    if (!playAudioBuffer({audioBuffer:this.retakeLineAudioBuffer, onEnded:this._onEnded})) return false;
    this._onPlaying();
    return true;
  }
}

export default EventPlayer;
