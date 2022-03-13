import { LATEST } from 'audio/waveCodecs';
import { toAudioBuffer } from 'audio/UnpackedAudio';
import {findRangesForFrequency} from 'audio/frequencyAnalyzer';
import { getStore } from 'store/stickyStore';
import WaveVisualizer from 'common/WaveVisualizer';
import {findVolumeCeiling, timeToSampleCount} from "audio/sampleUtil";
import {MarkerType} from "audio/markerTypes";
import {findStartSession} from "audio/eventDecoder";

import React, { useState } from "react";

function _calcSignalThreshold({samples}) {
    const CEILING_SILENCE_RATIO = .04;
    const volumeCeiling = findVolumeCeiling({samples});
    return volumeCeiling * CEILING_SILENCE_RATIO;
}

function _findMarkers({samples, audioBuffer}) {
    /* const signalThreshold = _calcSignalThreshold({samples});
    const targetFrequency = LATEST.startSessionNotes[2];
    const sampleRate = audioBuffer.sampleRate; */
    const sampleNo = findStartSession({audioBuffer});
    const marker = { sampleNo, markerType:MarkerType.Primary };
    return [marker];
    
    /*
    const ranges = findRangesForFrequency({samples, sampleRate, targetFrequency, signalThreshold});
    return ranges.map(range => {
      const sampleCount = range.toSampleNo - range.fromSampleNo;
      const description = sampleCount > 5000 ? sampleCount : null;
      return { 
          sampleNo:range.fromSampleNo, 
          toSampleNo:range.toSampleNo, 
          markerType:MarkerType.Primary,
          description
      };  
    }); */
}

function DebugWaveScreen() {
    const [initVars, setInitVars] = useState(null);
    
    if (!initVars) {
        const store = getStore();
        const unpackedAudio = store.attachedAudio.unpacked;
        const audioBuffer = toAudioBuffer({unpackedAudio});
        const samples = unpackedAudio.channelSamples[0];
        const markers = _findMarkers({samples, audioBuffer});
        setInitVars({ audioBuffer, samples, markers });
        return null; // Render after state vars are updated.
    }

    const { markers, samples, audioBuffer } = initVars;
    
    const firstFiveSeconds = timeToSampleCount({time:5, sampleRate:audioBuffer.sampleRate});
    const endSampleNo = firstFiveSeconds > samples.length ? samples.length : firstFiveSeconds;
    return (
        <React.Fragment>
            <WaveVisualizer samples={samples} beginSampleNo={0} endSampleNo={endSampleNo} markers={markers} width={1000} height={400} />
        </React.Fragment>
    );
}

export default DebugWaveScreen;