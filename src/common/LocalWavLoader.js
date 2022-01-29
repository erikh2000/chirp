import React from 'react';
import LocalFileLoader from './LocalFileLoader';
import WaveFile from 'audio/waveFile';

const LocalWavLoader = ({ onWavLoaded }) => {
    const handleWav = ({fileData}) => {
        WaveFile.load({fileData}).then(({audioBuffer}) => {
            if (onWavLoaded) onWavLoaded({audioBuffer});
        });
    };

    return(
        <div>
            <LocalFileLoader fileType='WAV' onFileLoaded={handleWav} />
        </div>
    );
}

export default LocalWavLoader;