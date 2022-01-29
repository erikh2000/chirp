import React from 'react';

import FloatBarDialog from 'components/floatBar/FloatBarDialog';
import { Close, Microphone } from 'components/floatBar/FloatBarIcons';
import recordingImage from 'images/recorder.png';

function StartSessionDialog({isOpen, onCancel, onContinue}) {
  const buttons=[
    {text:'Cancel', onClick:onCancel, icon:<Close />},
    {text:'The Mic is Alive!', onClick:onContinue, icon:<Microphone />}
  ];
  const descriptionLines=[
    'After your DAW is recording, press the "alive" button below.',
    'The app will then chirp before and after lines as you record to add digital markers to your recording.'
  ];

  return (
    <FloatBarDialog 
      buttons={buttons} 
      descriptionLines={descriptionLines}
      image={recordingImage}
      isOpen={isOpen}
      title='Ready to Start?'
    />
  );
}

export default StartSessionDialog;