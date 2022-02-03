import FloatBar from 'floatBar/FloatBar';
import Script from 'script/Script';
import { Down, ExcludeTake, EndReview, PlayTake } from 'floatBar/FloatBarIcons';
import { getStore } from 'store/stickyStore';
import styles from './ReviewAudioScreen.module.css'

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// TODO refactor? Same code in RecordScript.
let lineElements = {};

// TODO refactor? Same code in RecordScript.
function _getLineY({lineNo}) {
  if (isNaN(lineNo)) return null;
  const lineElement = lineElements[lineNo];
  if (!lineElement) return null;
  return lineElement.offsetTop;
}

// TODO refactor? Same code in RecordScript.
function _scrollToLineNo({lineNo}) {
  const lineY = _getLineY({lineNo});
  if (lineY === null) return false;
  const positionRatio = .3; // 0% = put top of line at top of screen, 100% = put top of line at bottom of screen. Skew up from center for lines with preceding action to look good.
  const centerYOffset = -(window.innerHeight * positionRatio);
  const top = lineY + centerYOffset;
  window.scrollTo({top, behavior:'smooth'});
  return true;
}

// TODO refactor? Same code in RecordScript.
function _onReceiveLineRef({lineNo, element}) {
  lineElements[lineNo] = element;
}

function ReviewAudioScreen() {
  const [script, setScript] = useState(null);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [selectedLineNo, setSelectedLineNo] = useState(null);
  const [scrollLineNo, setScrollLineNo] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { // Needs to happen *after* the render, so I have all the line refs giving me layout info.
    if (scrollLineNo !== null && _scrollToLineNo({lineNo:scrollLineNo})) {
      setScrollLineNo(null);
    }
  }, [scrollLineNo]);

  const options = [
    { text:'Play Take', icon:<PlayTake /> },
    { text:'Exclude Take', icon:<ExcludeTake />},
    { text:'End Review', icon:<EndReview /> },
    { text:'Next Take', icon:<Down /> }
  ];

  // TODO - Handle case where user hasn't had a chance to make a UI gesture in the browser, enabling audio.

  if (!script) {
    lineElements = {};
    const store = getStore();
    let nextCharacter = store.activeCharacter;
    let nextScript = store.scripts.active;
    if (!nextCharacter) nextCharacter = nextScript.characters.length > 0 ? nextScript.characters[0] : null;
    setScript(nextScript);
    setActiveCharacter(nextCharacter);
  }

  const floatBar = !openDialog ? <FloatBar options={options} /> : null;
  
  return (
    <React.Fragment>
        <div className={styles.scriptBackground}>
          <Script 
            activeCharacter={activeCharacter} 
            onReceiveLineRef={_onReceiveLineRef}
            script={script} 
            selectedLineNo={selectedLineNo}
            isLineSelectionDisabled={false}
            isRecording={false}
          />
        </div>
        {floatBar}
    </React.Fragment>
  );
}

export default ReviewAudioScreen;
