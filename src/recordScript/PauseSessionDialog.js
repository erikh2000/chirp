import React from 'react';

import FloatBarDialog from 'floatBar/FloatBarDialog';
import { Microphone, Exit } from 'floatBar/FloatBarIcons';
import recordingImage from 'common/images/recorder.png';

function PauseSessionDialog({isOpen, onResume, onEnd}) {
  const options=[
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
      onCancel={onResume}
      options={options} 
      descriptionLines={descriptionLines}
      image={recordingImage}
      isOpen={isOpen}
      title='Pause Session'
    />
  );
}

export default PauseSessionDialog;