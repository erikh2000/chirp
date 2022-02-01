import BitEncoder from "./bitEncoder";
import WaveEncoder from "./waveEncoder";
import { EventType } from './eventTypes';

class EventEncoder {
  constructor() {
    this.bitEncoder = new BitEncoder();
    this.waveEncoder = new WaveEncoder();
  }

  _addStartTone = () => {
    this.bitEncoder.addBit(true);
    this.bitEncoder.addBit(false);
  }

  _createNewEvent = () => {
    this.bitEncoder.clear();
    this.waveEncoder.clear();
    this._addStartTone();
  }

  _completeEncoding = () => {
    this.waveEncoder.appendBits({bits:this.bitEncoder.getBits()});
    return this.waveEncoder.getAudioBuffer();
  }

  encodeStartLine = ({lineNo}) => {
    this._createNewEvent();
    this.bitEncoder.addUint2(EventType.StartLine);
    this.bitEncoder.addUint12(lineNo);
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
