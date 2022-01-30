import WaveFile from 'audio/waveFile';

const LocalWavLoader = ({ onWavLoaded }) => {
    const handleWav = ({fileData}) => {
        WaveFile.load({fileData}).then(({audioBuffer}) => {
            if (onWavLoaded) onWavLoaded({audioBuffer});
        });
    };
    // TODO delete this file after you've got wave loading working again.
    // It was using LocalFileLoader component then I deleted it. Code there is like:
    /*
    reader.addEventListener( 'load', () => {
        if (onFileLoaded) {
          onFileLoaded(reader.result);
        }
    });
    reader.readAsBuffer(event.target.files[0]);
    
    
    onFileLoaded was calling handleWav with a buffer of bytes.
    */

    return null;
}

export default LocalWavLoader;