import Button from '@mui/material/Button';

const PlaySoundButton = ({ text, audioBuffer, onPlayed }) => {
    const _onClick = () => {
      const audioContext = new AudioContext();
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
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