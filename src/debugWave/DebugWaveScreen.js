import { toAudioBuffer } from 'audio/UnpackedAudio';
import { getStore } from 'store/stickyStore';
import WaveVisualizer from 'common/WaveVisualizer';
import {timeToSampleCount} from "audio/sampleUtil";
import {MarkerType} from "audio/markerTypes";
import {findStartSession} from "audio/eventDecoder";

import React, { useState } from "react";

function _findMarkers({samples, audioBuffer}) {
    const sampleNo = findStartSession({audioBuffer});
    const marker = { sampleNo, markerType:MarkerType.Primary };
    return [marker];
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