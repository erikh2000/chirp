import FloatBar from 'floatBar/FloatBar';
import HintArrows from 'script/HintArrows';
import Script from 'script/Script';
import { Pause, Retake, Down } from 'floatBar/FloatBarIcons';
import { findFirstLineNoForCharacter, findNextLineNoForCharacter, findLastLineNoForCharacter } from 'script/util/scriptAnalysisUtil';
import { getStore } from 'store/stickyStore';
import EventPlayer from 'audio/eventPlayer';
import PauseSessionDialog from 'recordScript/PauseSessionDialog';

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theAudioContext } from 'audio/theAudioContext';

let lineYs = {};
const eventPlayer = new EventPlayer();

function _getLineY({lineNo}) {
  if (isNaN(lineNo)) return 0;
  const lineY = lineYs[lineNo];
  return isNaN(lineY) ? 0 : lineY;
}

function _onReceiveLineY({lineNo, y}) {
  if (!lineYs.remainingCount) return; // Only want to store the initial Y position of lines. 
  lineYs[lineNo] = y;
  lineYs.remainingCount--;
}

function _selectLine({
    lineNo, 
    selectedLineNo, 
    setSelectedLineNo}) {
  if (lineNo === selectedLineNo) {
    eventPlayer.playRetakeLine();
    return;
  }
  eventPlayer.playStartLine({lineNo});

  setSelectedLineNo(lineNo);
  const lineY = lineYs[lineNo] || 0;
  const centerYOffset = window.innerHeight / -2;
  const top = lineY + centerYOffset;
  window.scrollTo({top, behavior:'smooth'});
}

function _onRetakeLine() {
  eventPlayer.playRetakeLine();
}

function _onNextLine({
    activeCharacter,
    selectedLineNo, 
    setSelectedLineNo,
    script}) {
  const lineNo = findNextLineNoForCharacter({script, character:activeCharacter, afterLineNo:selectedLineNo});
  if (lineNo === -1) return; // At end of script.
  _selectLine({lineNo, selectedLineNo, setSelectedLineNo, script});
}

function _onClickLine({
    lineNo, 
    selectedLineNo,
    setSelectedLineNo,
    script}) {
  _selectLine({lineNo, selectedLineNo, setSelectedLineNo, script});
}

function _onEnd({navigate}) {
  navigate('/viewScript');
}

function _onResume({selectedLineNo, setOpenDialog}) {
  eventPlayer.playStartLine({lineNo:selectedLineNo});
  setOpenDialog(null);
}

function _onPauseEnd({setOpenDialog}) {
  eventPlayer.playEndLine();
  setOpenDialog(PauseSessionDialog.name);
}

function _onPlayStateChange({isPlaying, setChirpPlaying}) {
  setChirpPlaying(isPlaying);
}

function RecordScriptScreen() {
  const [script, setScript] = useState(null);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [selectedLineNo, setSelectedLineNo] = useState(null);
  const [lastLineNoForCharacter, setLastLineNoForCharacter] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [isChirpPlaying, setChirpPlaying] = useState(false);
  const navigate = useNavigate();

  const buttons = [
    { text:'Retake Line', onClick:_onRetakeLine, icon:<Retake /> },
    { text:'Pause / End', onClick:() => _onPauseEnd({setOpenDialog}), icon:<Pause /> },
    { text:'Next Line', onClick:() => _onNextLine({activeCharacter, selectedLineNo, setSelectedLineNo, script}), icon:<Down /> }
  ];

  // Handle case where user hasn't had a chance to make a UI gesture in the browser, enabling audio.
  if (!theAudioContext() && openDialog !== PauseSessionDialog.name) setOpenDialog(PauseSessionDialog.name);

  if (!script) {
    eventPlayer.setOnPlayStateChange({onPlayStateChange:({isPlaying}) => _onPlayStateChange({isPlaying, setChirpPlaying})});
    const store = getStore();
    let nextCharacter = store.activeCharacter;
    let nextScript = store.scripts.active;
    if (!Object.keys(lineYs).length) lineYs.remainingCount = nextScript.lines.length;
    if (!nextCharacter) nextCharacter = nextScript.characters.length > 0 ? nextScript.characters[0] : null;
    setScript(nextScript);
    setActiveCharacter(nextCharacter);
    const lineNo = findFirstLineNoForCharacter({script:nextScript, character:nextCharacter});
    setLastLineNoForCharacter(findLastLineNoForCharacter({script:nextScript, character:nextCharacter}));
    _selectLine({lineNo, selectedLineNo, setSelectedLineNo, script});
  } else {
    buttons[2].isDisabled = (selectedLineNo === lastLineNoForCharacter);
  }

  const floatBar = !openDialog ? <FloatBar buttons={buttons} isDisabled={isChirpPlaying} /> : null;
  const onResume = () => _onResume({selectedLineNo, setOpenDialog});
  const onEnd = () => _onEnd({navigate});
  const onClickLine = ({lineNo}) => _onClickLine({lineNo, script, selectedLineNo, setSelectedLineNo});
  const selectedLineY = _getLineY({lineNo:selectedLineNo});

  return (
    <React.Fragment>
        <PauseSessionDialog isOpen={openDialog===PauseSessionDialog.name} onResume={onResume} onEnd={onEnd} />
        <HintArrows selectedLineY={selectedLineY} />
        <Script 
          activeCharacter={activeCharacter} 
          onClickLine={onClickLine}
          onReceiveLineY={_onReceiveLineY}
          script={script} 
          selectedLineNo={selectedLineNo}
          isLineSelectionDisabled={isChirpPlaying}
          isRecording={!openDialog}
        />
        {floatBar}
    </React.Fragment>
  );
}

export default RecordScriptScreen;
