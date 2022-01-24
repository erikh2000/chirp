import FloatBar from 'components/FloatBar';
import Script from 'components/script/Script';
import { findFirstLineNoForCharacter, findNextLineNoForCharacter } from 'scripts/scriptAnalysisUtil';
import { getStore } from 'store/stickyStore';

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineStyle } from '@mui/icons-material';

const initialSelectionState = {
  selectedLineNo:null
};

const lineYs = {};

function _onRetakeLine() {
  
}

function RecordScriptScreen() {
  const [script, setScript] = useState(null);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [selectionState, setSelectionState] = useState(initialSelectionState);
  const navigate = useNavigate();

  function _onReceiveLineY({lineNo, y}) {
    if (!lineYs.remainingCount) return; // Only want to store the initial Y position of lines. 
    lineYs[lineNo] = y;
    lineYs.remainingCount--;
  }

  function _selectLine({lineNo}) {
    setSelectionState({
      ...selectionState,
      selectedLineNo:lineNo
    });
    const lineY = lineYs[lineNo] || 0;
    const centerYOffset = window.innerHeight / -2;
    const top = lineY + centerYOffset;
    window.scrollTo({top, behavior:'smooth'});
  }

  function _onNextLine() {
    const lineNo = findNextLineNoForCharacter({script, character:activeCharacter, afterLineNo:selectionState.selectedLineNo});
    if (lineNo === -1) return; // At end of script.
    _selectLine({lineNo});
  }

  function _onClickLine({lineNo}) {
    _selectLine({lineNo});
  }

  function _onPauseEnd() {
    navigate('/viewScript');
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
    lineYs.remainingCount = nextScript.lines.length;
    if (!nextCharacter) nextCharacter = nextScript.characters.length > 0 ? nextScript.characters[0] : null;
    setScript(nextScript);
    setActiveCharacter(nextCharacter);
    const lineNo = findFirstLineNoForCharacter({script:nextScript, character:nextCharacter});
    _selectLine({lineNo});
  }

  return (
    <React.Fragment>
        <Script 
          activeCharacter={activeCharacter} 
          onClickLine={_onClickLine}
          onReceiveLineY={_onReceiveLineY}
          script={script} 
          selectedLineNo={selectionState.selectedLineNo}
        />
        <FloatBar buttons={buttons} />
    </React.Fragment>
  );
}

export default RecordScriptScreen;
