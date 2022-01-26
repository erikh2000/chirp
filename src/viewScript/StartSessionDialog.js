import React from 'react';

import FloatBarDialog from 'components/FloatBarDialog';
import recordingImage from 'images/recorder.png';

function StartSessionDialog({isOpen, onCancel, onContinue}) {
  const buttons=[
    {text:'Cancel', onClick:onCancel},
    {text:'The Mic is Alive!', onClick:onContinue}
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