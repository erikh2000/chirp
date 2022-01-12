import './App.css';

import LocalWavLoader from 'components/LocalWavLoader';
import PlaySoundButton from 'components/PlaySoundButton';
import WaveVisualizer from 'components/WaveVisualizer';

import EventDecoder from 'util/eventDecoder';
import EventEncoder from 'util/eventEncoder';
import { MarkerType } from 'util/markerTypes';
import WaveDecoder from 'util/waveDecoder';

import { useState } from "react";
import ButtonGroup from '@mui/material/ButtonGroup';

function App() {
  const [startLineAudioBuffer, setStartLineAudioBuffer] = useState(null);
  const [endLineAudioBuffer, setEndLineAudioBuffer] = useState(null);
  const [retakeLineAudioBuffer, setRetakeLineAudioBuffer] = useState(null);
  const [eventEncoder, setEventEncoder] = useState(null);
  const [samples, setSamples] = useState([]);
  const [markers, setMarkers] = useState([]);

  if (eventEncoder == null) {
    const ee = new EventEncoder();
    setStartLineAudioBuffer(ee.encodeStartLine({lineNo:75}));
    setEndLineAudioBuffer(ee.encodeEndLine());
    setRetakeLineAudioBuffer(ee.encodeRetakeLine());
    setEventEncoder(ee);
  }

  const _setSamplesFromAudioBuffer = (audioBuffer) => {
    setSamples(audioBuffer.getChannelData(0));
    setMarkers([]);
  }

  const _onStartLinePlayed = () => _setSamplesFromAudioBuffer(startLineAudioBuffer);
  const _onEndLinePlayed = () => _setSamplesFromAudioBuffer(endLineAudioBuffer);
  const _onRetakeLinePlayed = () => _setSamplesFromAudioBuffer(retakeLineAudioBuffer);
  const _onWavLoaded = ({audioBuffer}) => {
    _setSamplesFromAudioBuffer(audioBuffer);
    const waveDecorder = new WaveDecoder({audioBuffer});
    const bits = waveDecorder.findBits();
    const bitMarkers = bits.map(sampleNo => { return { sampleNo, markerType:MarkerType.Secondary }; } );

    const eventDecoder = new EventDecoder();
    const events = eventDecoder.decode({audioBuffer});
    const eventMarkers = events.map(event => { return { sampleNo:event.sampleNo, description:event.description, markerType:MarkerType.Primary }; } );

    const markers = [...eventMarkers, ...bitMarkers];
    setMarkers(markers);
  }

  return (
    <div className="App">
      <div className="ButtonBar" width="100%">
        <ButtonGroup variant='contained'>
          <PlaySoundButton text='Start' audioBuffer={startLineAudioBuffer} onPlayed={_onStartLinePlayed} />
          <PlaySoundButton text='End' audioBuffer={endLineAudioBuffer} onPlayed={_onEndLinePlayed} />
          <PlaySoundButton text='Retake' audioBuffer={retakeLineAudioBuffer} onPlayed={_onRetakeLinePlayed}/>
          <LocalWavLoader onWavLoaded={_onWavLoaded} />
        </ButtonGroup>
      </div>
      <WaveVisualizer width='2000' height='400' samples={samples} markers={markers} beginSampleNo={0} endSampleNo={samples.length} />
    </div>
  );
}

export default App;
