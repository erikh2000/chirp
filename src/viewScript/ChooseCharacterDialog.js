import React from 'react';

import FloatBarDialog from 'floatBar/FloatBarDialog';
import recordingImage from 'common/images/recorder.png';


function ChooseCharacterDialog({isOpen, onChooseCharacter, script}) {
  if (!isOpen) return null;

  function _onChoose({optionNo, optionText}) {
    if (onChooseCharacter) onChooseCharacter({character:optionText});
  }

  const options = script.characters.map(text => { return { text }; } );

  const descriptionLines=[
    'Characters found in this script are shown below.',
    'Choose the character for whom you will be reading.'
  ];

  return (
    <FloatBarDialog 
      options={options} 
      descriptionLines={descriptionLines}
      image={recordingImage}
      isOpen={isOpen}
      title='Choose Character'
      onChoose={_onChoose}
    />
  );
}

export default ChooseCharacterDialog;