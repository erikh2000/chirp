import Button from '@mui/material/Button';

import { theAudioContext } from 'audio/theAudioContext';

const PlaySoundButton = ({ text, audioBuffer, onPlayed }) => {
    const _onClick = () => {
      const source = theAudioContext().createBufferSource();
      source.buffer = audioBuffer;
      source.connect(theAudioContext().destination);
      source.start();
      onPlayed();
    }

    return(
        <div>
            <Button onClick={_onClick}>{text}</Button>
        </div>
    );
}

export default PlaySoundButton;