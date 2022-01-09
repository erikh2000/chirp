import React from 'react';
import LocalFileLoader from './LocalFileLoader';
import WaveFile from 'util/waveFile';

const LocalWavLoader = ({ onWavLoaded }) => {
    const handleWav = ({fileData}) => {
        WaveFile.load({fileData}).then(({wave}) => {
            if (onWavLoaded) onWavLoaded({wave});
        });
    };

    return(
        <div>
            <LocalFileLoader fileType='WAV' onFileLoaded={handleWav} />
        </div>
    );
}

export default LocalWavLoader;