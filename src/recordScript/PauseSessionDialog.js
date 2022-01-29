import React from 'react';

import FloatBarDialog from 'components/floatBar/FloatBarDialog';
import { Microphone, Exit } from 'components/floatBar/FloatBarIcons';
import recordingImage from 'images/recorder.png';

function PauseSessionDialog({isOpen, onResume, onEnd}) {
  const buttons=[
    {text:'Resume Session', onClick:onResume, icon:<Microphone />},
    {text:'End Session', onClick:onEnd, icon:<Exit />}
  ];
  const descriptionLines=[
    'If you want to resume your session, just make sure your DAW is recording and click "resume session" below.',
    'Or if you\'re done recording, click "end session" below.',
    'You can stop and restart your DAW during pauses or leave it running -- your choice!'
  ];

  return (
    <FloatBarDialog 
      buttons={buttons} 
      descriptionLines={descriptionLines}
      image={recordingImage}
      isOpen={isOpen}
      title='Pause Session'
    />
  );
}

export default PauseSessionDialog;