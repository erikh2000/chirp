import './App.css';
import EventEncoder from './util/eventEncoder';
import PlaySoundButton from './components/PlaySoundButton';
import { useState } from "react";
import WaveVisualizer from 'components/WaveVisualizer';

function App() {
  const [startLineAudioBuffer, setStartLineAudioBuffer] = useState(null);
  const [endLineAudioBuffer, setEndLineAudioBuffer] = useState(null);
  const [retakeLineAudioBuffer, setRetakeLineAudioBuffer] = useState(null);
  const [eventEncoder, setEventEncoder] = useState(null);
  let [samples, setSamples] = useState([]);

  if (eventEncoder == null) {
    const ee = new EventEncoder();
    setStartLineAudioBuffer(ee.encodeStartLine({lineNo:75}));
    setEndLineAudioBuffer(ee.encodeEndLine());
    setRetakeLineAudioBuffer(ee.encodeRetakeLine());
    setEventEncoder(ee);
  }

  const _setSamplesFromAudioBuffer = (audioBuffer) => setSamples(audioBuffer.getChannelData(0));
  const _onStartLinePlayed = () => _setSamplesFromAudioBuffer(startLineAudioBuffer);
  const _onEndLinePlayed = () => _setSamplesFromAudioBuffer(endLineAudioBuffer);
  const _onRetakeLinePlayed = () => _setSamplesFromAudioBuffer(retakeLineAudioBuffer);

  return (
    <div className="App">
      <PlaySoundButton text='Start' audioBuffer={startLineAudioBuffer} onPlayed={_onStartLinePlayed} />
      <PlaySoundButton text='End' audioBuffer={endLineAudioBuffer} onPlayed={_onEndLinePlayed} />
      <PlaySoundButton text='Retake' audioBuffer={retakeLineAudioBuffer} onPlayed={_onRetakeLinePlayed}/>
      <WaveVisualizer width='600' height='200' samples={samples} />
    </div>
  );
}

export default App;
