import BitEncoder from "./bitEncoder";
import WaveAppender from "./waveAppender";
import { EventType } from './eventTypes';

class EventEncoder {
  constructor() {
    this.bitEncoder = new BitEncoder();
    this.waveAppender = new WaveAppender();
  }

  _addStartTone = () => {
    this.bitEncoder.addBit(true);
    this.bitEncoder.addBit(false);
  }

  _createNewEvent = () => {
    this.bitEncoder.clear();
    this.waveAppender.clear();
    this._addStartTone();
  }

  _completeEncoding = () => {
    this.waveAppender.appendBits({bits:this.bitEncoder.getBits()});
    return this.waveAppender.getAudioBuffer();
  }

  encodeStartLine = ({lineNo}) => {
    this._createNewEvent();
    this.bitEncoder.addUint2(EventType.StartLine);
    this.bitEncoder.addUint10(lineNo);
    return this._completeEncoding();
  }

  encodeEndLine = () => {
    this._createNewEvent();
    this.bitEncoder.addUint2(EventType.EndLine);
    return this._completeEncoding();
  }

  encodeRetakeLine = () => {
    this._createNewEvent();
    this.bitEncoder.addUint2(EventType.RetakeLine);
    return this._completeEncoding();
  }
}

export default EventEncoder;
