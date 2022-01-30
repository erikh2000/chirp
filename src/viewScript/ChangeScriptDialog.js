import React, { useRef } from 'react';

import FloatBarDialog from 'floatBar/FloatBarDialog';
import { Close, Script } from 'floatBar/FloatBarIcons';
import image from 'common/images/openFile.png';
import { loadScriptFromText } from 'script/util/scriptLoader';

function ChangeScriptDialog({isOpen, onCancel, onScriptLoaded}) {
  const fileInputRef = useRef();

  const handleFile = (event) => {
    const reader = new FileReader();
    reader.addEventListener( 'load', () => {
        if (onScriptLoaded) {
          const loadedScript = loadScriptFromText({text: reader.result});
          onScriptLoaded({loadedScript});
        }
    });
    reader.readAsText(event.target.files[0]);
  };

  const _onOpenScript = () => {
    fileInputRef.current.click();
  };

  const options=[
    {text:'Cancel', onClick:onCancel, icon:<Close />},
    {text:'Open Script', onClick:_onOpenScript, icon:<Script />}
  ];
  const descriptionLines=[
    'If you have a script on your device or computer you\'d like to use, click "open script" below.',
    'The script needs to be in the Fountain screenwriting format.'
  ];

  return (
    <React.Fragment>
      <input type='file' multiple={false} ref={fileInputRef} onChange = {handleFile} hidden/>
      <FloatBarDialog 
        options={options} 
        descriptionLines={descriptionLines}
        image={image}
        isOpen={isOpen}
        title='Open Script'
      />
    </React.Fragment>
  );
}

export default ChangeScriptDialog;