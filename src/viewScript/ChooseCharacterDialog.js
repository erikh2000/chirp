import React from 'react';

import FloatBarDialog from 'floatBar/FloatBarDialog';
import charactersImage from 'common/images/characters.png';


function ChooseCharacterDialog({character, isOpen, onCancel, onChooseCharacter, script}) {
  if (!isOpen) return null;

  function _onChoose({optionNo, optionText}) {
    if (onChooseCharacter) onChooseCharacter({character:optionText});
  }

  const options = script.characters.map(text => { return { text }; } );

  const descriptionLines=[
    `You are currently reading for ${character}.`,
    'Characters found in this script are shown below.',
    'Choose the character for whom you will be reading.'
  ];

  return (
    <FloatBarDialog 
      options={options} 
      descriptionLines={descriptionLines}
      image={charactersImage}
      isOpen={isOpen}
      title='Choose Character'
      onChoose={_onChoose}
      onCancel={onCancel}
    />
  );
}

export default ChooseCharacterDialog;