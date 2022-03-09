import EventEncoder from "./eventEncoder";
import { playAudioBuffer } from 'audio/playAudioUtil';

class EventPlayer {
  constructor() {
    this.eventEncoder = new EventEncoder({});
    this.startSessionAudioBuffer = null;
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

  playStartSession = () => {
    if (this._warnIfAlreadyPlaying()) return; // TODO keep this check?
    let audioBuffer = this.startSessionAudioBuffer;
    if (!audioBuffer) {
      audioBuffer = this.startSessionAudioBuffer = this.eventEncoder.encodeStartSession();
    }
    if (!playAudioBuffer({audioBuffer, onEnded:this._onEnded})) return false;
    this._onPlaying();
    return true;
  }
}

export default EventPlayer;
