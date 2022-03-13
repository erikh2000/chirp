import UnpackedAudio from 'audio/UnpackedAudio';
import {waveFileDataToAudioBuffer} from 'audio/waveFile';
import image from 'common/images/openWav.png';
import FloatBarDialog from 'floatBar/FloatBarDialog';
import {Close, Script} from 'floatBar/FloatBarIcons';
import {getStore} from 'store/stickyStore';

import React, {useRef} from 'react';

function ReviewAudioDialog({isOpen, onCancel, onWavLoaded}) {
  const fileInputRef = useRef();

  const handleFile = (event) => {
    if (!onWavLoaded) return;
    const reader = new FileReader();
    reader.addEventListener( 'load', () => {
        waveFileDataToAudioBuffer({fileData:reader.result}).then(({audioBuffer}) => {
          const store = getStore();
          store.attachedAudio.unpacked = new UnpackedAudio({audioBuffer});
          onWavLoaded();
        });
    });
    reader.readAsArrayBuffer(event.target.files[0]);
  };

  const _onAttachAudio = () => {
    fileInputRef.current.click();
  };

  const options=[
    {text:'Cancel', onClick:onCancel, icon:<Close />},
    {text:'Attach Audio File', onClick:_onAttachAudio, icon:<Script />}
  ];
  const descriptionLines=[
    'Attach an audio file from your device or computer to review.',
    'This file needs to have been recorded with Chirp and match the same script you have open now.', 
    'Your files will never be uploaded to a server. It all stays with you!'
  ];

  return (
    <React.Fragment>
      <input type='file' multiple={false} ref={fileInputRef} onChange = {handleFile} hidden/>
      <FloatBarDialog 
        onCancel={onCancel}
        options={options} 
        descriptionLines={descriptionLines}
        image={image}
        isOpen={isOpen}
        title='Attach Audio to Review'
      />
    </React.Fragment>
  );
}

export default ReviewAudioDialog;