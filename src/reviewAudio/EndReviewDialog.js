import React from 'react';

import FloatBarDialog from 'floatBar/FloatBarDialog';
import { Close, Exit, GenerateDelivery } from 'floatBar/FloatBarIcons';
import generateImage from 'reviewAudio/images/generateDelivery.png';

function EndReviewDialog({isOpen, onCancel, onSkip, onGenerate}) {
  const options=[
    {text:'Cancel', onClick:onCancel, icon:<Close />},
    {text:'Skip Delivery', onClick:onSkip, icon:<Exit />},
    {text:'Generate Delivery', onClick:onGenerate, icon:<GenerateDelivery/>},
  ];

  const descriptionLines=[
    'To generate a "delivery" audio file based on your review selections, choose "generate".',
    'To end the review session without generating anything, choose "skip".',
    'To return to the review session, choose "cancel".'
  ];

  return (
    <FloatBarDialog 
      onCancel={onCancel}
      options={options} 
      descriptionLines={descriptionLines}
      image={generateImage}
      isOpen={isOpen}
      title='Done Reviewing?'
    />
  );
}

export default EndReviewDialog;