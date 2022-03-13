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
    'You\'re paused! That means any audio that is recording now will be excluded from takes.',
    'If you want to resume your session, leave your DAW recording and click "resume session" below.',
    'Or if you\'re done recording or have stopped your DAW, click "end session" below.',
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