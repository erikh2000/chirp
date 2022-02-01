import FloatBar from 'floatBar/FloatBar';
import HintArrows from 'script/HintArrows';
import Script from 'script/Script';
import { Pause, Retake, Down } from 'floatBar/FloatBarIcons';
import { findFirstLineNoForCharacter, findNextLineNoForCharacter, findLastLineNoForCharacter } from 'script/util/scriptAnalysisUtil';
import { getStore } from 'store/stickyStore';
import EventPlayer from 'audio/eventPlayer';
import PauseSessionDialog from 'recordScript/PauseSessionDialog';
import styles from './RecordScriptScreen.module.css'

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theAudioContext } from 'audio/theAudioContext';

let lineElements = {};
const eventPlayer = new EventPlayer();

function _getLineY({lineNo}) {
  if (isNaN(lineNo)) return null;
  const lineElement = lineElements[lineNo];
  if (!lineElement) return null;
  return lineElement.offsetTop;
}

function _scrollToLineNo({lineNo}) {
  const lineY = _getLineY({lineNo});
  if (lineY === null) return false;
  const positionRatio = .3; // 0% = put top of line at top of screen, 100% = put top of line at bottom of screen. Skew up from center for lines with preceding action to look good.
  const centerYOffset = -(window.innerHeight * positionRatio);
  const top = lineY + centerYOffset;
  window.scrollTo({top, behavior:'smooth'});
  return true;
}

function _onReceiveLineRef({lineNo, element}) {
  lineElements[lineNo] = element;
}

function _selectLine({
    lineNo, 
    selectedLineNo, 
    setSelectedLineNo,
    setScrollLineNo
  }) {
  if (lineNo === selectedLineNo) {
    eventPlayer.playRetakeLine();
    return;
  }
  eventPlayer.playStartLine({lineNo});

  setSelectedLineNo(lineNo);
  setScrollLineNo(lineNo);
}

function _onRetakeLine() {
  eventPlayer.playRetakeLine();
}

function _onNextLine({
    activeCharacter,
    selectedLineNo, 
    setSelectedLineNo,
    setScrollLineNo,
    script}) {
  const lineNo = findNextLineNoForCharacter({script, character:activeCharacter, afterLineNo:selectedLineNo});
  if (lineNo === -1) return; // At end of script.
  _selectLine({lineNo, selectedLineNo, setSelectedLineNo, setScrollLineNo, script});
}

function _onClickLine({
    lineNo, 
    selectedLineNo,
    setSelectedLineNo,
    setScrollLineNo,
    script}) {
  _selectLine({lineNo, selectedLineNo, setSelectedLineNo, setScrollLineNo, script});
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
  const [scrollLineNo, setScrollLineNo] = useState(null);
  const [lastLineNoForCharacter, setLastLineNoForCharacter] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [isChirpPlaying, setChirpPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { // Needs to happen *after* the render, so I have all the line refs giving me layout info.
    if (scrollLineNo !== null && _scrollToLineNo({lineNo:scrollLineNo})) {
      setScrollLineNo(null);
    }
  }, [scrollLineNo]);

  const options = [
    { text:'Retake Line', onClick:_onRetakeLine, icon:<Retake /> },
    { text:'Pause / End', onClick:() => _onPauseEnd({setOpenDialog}), icon:<Pause /> },
    { text:'Next Line', onClick:() => _onNextLine({activeCharacter, selectedLineNo, setSelectedLineNo, setScrollLineNo, script}), icon:<Down /> }
  ];

  // Handle case where user hasn't had a chance to make a UI gesture in the browser, enabling audio.
  if (!theAudioContext() && openDialog !== PauseSessionDialog.name) setOpenDialog(PauseSessionDialog.name);

  if (!script) {
    lineElements = {};
    eventPlayer.setOnPlayStateChange({onPlayStateChange:({isPlaying}) => _onPlayStateChange({isPlaying, setChirpPlaying})});
    const store = getStore();
    let nextCharacter = store.activeCharacter;
    let nextScript = store.scripts.active;
    if (!nextCharacter) nextCharacter = nextScript.characters.length > 0 ? nextScript.characters[0] : null;
    setScript(nextScript);
    setActiveCharacter(nextCharacter);
    const lineNo = findFirstLineNoForCharacter({script:nextScript, character:nextCharacter});
    setLastLineNoForCharacter(findLastLineNoForCharacter({script:nextScript, character:nextCharacter}));
    _selectLine({lineNo, selectedLineNo, setSelectedLineNo, setScrollLineNo, script});
  } else {
    options[2].isDisabled = (selectedLineNo === lastLineNoForCharacter);
  }

  const floatBar = !openDialog ? <FloatBar options={options} isDisabled={isChirpPlaying} /> : null;
  const onResume = () => _onResume({selectedLineNo, setOpenDialog});
  const onEnd = () => _onEnd({navigate});
  const onClickLine = ({lineNo}) => _onClickLine({lineNo, script, selectedLineNo, setSelectedLineNo, setScrollLineNo});
  const selectedLineY = _getLineY({lineNo:selectedLineNo});

  return (
    <React.Fragment>
        <PauseSessionDialog isOpen={openDialog===PauseSessionDialog.name} onResume={onResume} onEnd={onEnd} />
        <HintArrows selectedLineY={selectedLineY} />
        <div className={styles.scriptBackground}>
          <Script 
            activeCharacter={activeCharacter} 
            onClickLine={onClickLine}
            onReceiveLineRef={_onReceiveLineRef}
            script={script} 
            selectedLineNo={selectedLineNo}
            isLineSelectionDisabled={isChirpPlaying}
            isRecording={!openDialog}
          />
        </div>
        {floatBar}
    </React.Fragment>
  );
}

export default RecordScriptScreen;
