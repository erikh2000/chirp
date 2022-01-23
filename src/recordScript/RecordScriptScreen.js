import FloatBar from 'components/FloatBar';
import Script from 'components/script/Script';
import { findFirstLineNoForCharacter, findNextLineNoForCharacter } from 'scripts/scriptAnalysisUtil';
import { getStore } from 'store/stickyStore';

import React, { useState } from "react";

function _onRetakeLine() {
  
}

function _onPauseEnd() {
  
}

function RecordScriptScreen() {
  const [script, setScript] = useState(null);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [selectedLineNo, setSelectedLineNo] = useState(0);

  function _onNextLine() {
    const nextLineNo = findNextLineNoForCharacter({script, character:activeCharacter, afterLineNo:selectedLineNo});
    if (nextLineNo === -1) return; // At end of script.
    setSelectedLineNo(nextLineNo);
  }

  const buttons = [
    { text:'Retake Line', onClick:_onRetakeLine },
    { text:'Pause / End', onClick:_onPauseEnd },
    { text:'Next Line', onClick:_onNextLine }
  ];

  if (!script) {
    const store = getStore();
    let nextCharacter = store.activeCharacter;
    let nextScript = store.scripts.active;
    if (!nextCharacter) nextCharacter = nextScript.characters.length > 0 ? nextScript.characters[0] : null;
    const nextLineNo = findFirstLineNoForCharacter({script:nextScript, character:nextCharacter});
    setScript(nextScript);
    setSelectedLineNo(nextLineNo);
    setActiveCharacter(nextCharacter);
  }

  return (
    <React.Fragment>
        <Script script={script} activeCharacter={activeCharacter} selectedLineNo={selectedLineNo}/>
        <FloatBar buttons={buttons} />
    </React.Fragment>
  );
}

export default RecordScriptScreen;
