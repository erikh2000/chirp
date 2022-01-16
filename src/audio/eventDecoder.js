import { calcBitIntervalSampleCount, findBits } from "./waveDecoder";
import { EventType } from './eventTypes';
import BitDecoder from "./bitDecoder";
import BitTimelineCursor from 'audio/bitTimelineCursor';
import { LATEST } from "./waveCodecs";

const START_TONE_BIT_COUNT = 2;
const EVENT_TYPE_BIT_COUNT = 2;
const COMMON_BIT_COUNT = START_TONE_BIT_COUNT + EVENT_TYPE_BIT_COUNT;
const LINE_NO_BIT_COUNT = 10;

function _isValidStartTone({bits}) {
  return bits.length >= START_TONE_BIT_COUNT && bits[0] && !bits[1];
}

function _decodeEvent({cursor}) {
  if (!cursor.seekToNextBit()) {
    cursor.seekPastEnd();
    return null;
  }

  const sampleNo = cursor.getPosition();
  const commonBits = cursor.readBits({count:COMMON_BIT_COUNT});
  if (!_isValidStartTone({bits:commonBits})) return null;
  
  const eventType = BitDecoder.decode({bits:[commonBits[2], commonBits[3]]});
  const event = { eventType, sampleNo };
  switch(eventType) {
    case EventType.StartLine:
      const lineNoBits = cursor.readBits({count:LINE_NO_BIT_COUNT});
      event.lineNo = BitDecoder.decode({bits:lineNoBits});
      event.description = "start #" + event.lineNo;
    break;

    case EventType.EndLine:
      event.description = "end";
    break;

    case EventType.RetakeLine:
      event.description = "retake";
    break;

    default:
      event.description = "decode error";
    break;
  }

  return event;
}

function _findEvents({bits, bitIntervalSampleCount}) {
  const events = [];
  if (bits.length === 0) return events;

  const cursor = new BitTimelineCursor({bits, spacing:bitIntervalSampleCount, spacingToleranceRatio:.15});
  while(!cursor.isPastEnd()) {
    const event = _decodeEvent({cursor});
    if (event) events.push(event);
  }

  return events;
}

export function findEvents({audioBuffer}) {
  const bits = findBits({audioBuffer});
  const bitIntervalSampleCount = calcBitIntervalSampleCount({codec:LATEST, sampleRate:audioBuffer.sampleRate});
  return _findEvents({bits, bitIntervalSampleCount});
}
