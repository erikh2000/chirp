import {sampleCountToTime} from 'audio/sampleUtil';
import { LATEST } from 'audio/waveCodecs';
import { findNotes } from 'audio/waveDecoder';

export function findStartSession({audioBuffer}) {
    const { startSessionNotes, noteDuration, silencePadDuration } = LATEST;
    const sampleNo = findNotes({audioBuffer, notes:startSessionNotes, noteDuration, silencePadDuration});
    if (sampleNo === null) return null;
    return sampleCountToTime({sampleCount:sampleNo, sampleRate:audioBuffer.sampleRate});
}