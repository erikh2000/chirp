import './App.css';

import LocalWavLoader from 'components/LocalWavLoader';
import PlaySoundButton from 'components/PlaySoundButton';
import WaveVisualizer from 'components/WaveVisualizer';
import ZoomSlider from 'components/ZoomSlider';

import { findEvents } from 'audio/eventDecoder';
import EventEncoder from 'audio/eventEncoder';
import { MarkerType } from 'audio/markerTypes';
import { samplesToJsClipboard } from 'audio/sampleUtil';

import { useState } from "react";
import ButtonGroup from '@mui/material/ButtonGroup';

function App() {
  const [startLineAudioBuffer, setStartLineAudioBuffer] = useState(null);
  const [endLineAudioBuffer, setEndLineAudioBuffer] = useState(null);
  const [retakeLineAudioBuffer, setRetakeLineAudioBuffer] = useState(null);
  const [eventEncoder, setEventEncoder] = useState(null);
  const [samples, setSamples] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [beginSampleNo, setBeginSampleNo] = useState([]);
  const [endSampleNo, setEndSampleNo] = useState([]);
  const [displayPercent, setDisplayPercent] = useState(100);

  if (eventEncoder == null) {
    const ee = new EventEncoder();
    setStartLineAudioBuffer(ee.encodeStartLine({lineNo:753}));
    setEndLineAudioBuffer(ee.encodeEndLine());
    setRetakeLineAudioBuffer(ee.encodeRetakeLine());
    setEventEncoder(ee);
  }

  const _setSamplesFromAudioBuffer = (audioBuffer) => {
    const nextSamples = audioBuffer.getChannelData(0);
    setSamples(nextSamples);
    setMarkers([]);
    setBeginSampleNo(0);
    setEndSampleNo(nextSamples.length);
    return nextSamples;
  }

  const _onStartLinePlayed = () => _setSamplesFromAudioBuffer(startLineAudioBuffer);
  const _onEndLinePlayed = () => _setSamplesFromAudioBuffer(endLineAudioBuffer);
  const _onRetakeLinePlayed = () => _setSamplesFromAudioBuffer(retakeLineAudioBuffer);

  const _onWavLoaded = ({audioBuffer}) => {
    const nextSamples = _setSamplesFromAudioBuffer(audioBuffer);
    samplesToJsClipboard({samples:nextSamples});
    const events = findEvents({audioBuffer});
    const eventMarkers = events.map(event => { return { sampleNo:event.sampleNo, description:event.description, markerType:MarkerType.Primary }; } );
    const markers = [...eventMarkers];
    setMarkers(markers);
  }

  const _onZoomValueChanged = ({value}) => {
    if (samples === []) return;
    setEndSampleNo(samples.length * value / 100);
    setDisplayPercent(value);
  }

  return (
    <div className="App">
        <div className="ButtonBar" width="100%">
          <ButtonGroup variant='contained'>
            <PlaySoundButton text='Start' audioBuffer={startLineAudioBuffer} onPlayed={_onStartLinePlayed} />
            <PlaySoundButton text='Retake' audioBuffer={retakeLineAudioBuffer} onPlayed={_onRetakeLinePlayed}/>
            <PlaySoundButton text='End' audioBuffer={endLineAudioBuffer} onPlayed={_onEndLinePlayed} />
            <LocalWavLoader onWavLoaded={_onWavLoaded} />
            <ZoomSlider value={displayPercent} onValueChange={_onZoomValueChanged}/>
          </ButtonGroup>
        </div>
        <WaveVisualizer width='1500' height='400' samples={samples} markers={markers} beginSampleNo={beginSampleNo} endSampleNo={endSampleNo} />
    </div>
  );
}

export default App;
