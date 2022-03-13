import EventPlayer from 'audio/eventPlayer';
import { theAudioContext } from 'audio/theAudioContext';
import { clearLineElements, getLineY, scrollToLineNo, onReceiveLineRef } from 'common/scrollToLineBehavior';
import FloatBar from 'floatBar/FloatBar';
import { Pause, Retake, Down } from 'floatBar/FloatBarIcons';
import PauseSessionDialog from 'recordScript/PauseSessionDialog';
import HintArrows from 'script/HintArrows';
import Script from 'script/Script';
import { findFirstLineNoForCharacter, findNextLineNoForCharacter, findLastLineNoForCharacter } from 'script/util/scriptAnalysisUtil';
import { getStore } from 'store/stickyStore';
import {closeTake, createTakeCaptureState, openTake} from "takes/takeUtil";
import styles from './RecordScriptScreen.module.css'

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const eventPlayer = new EventPlayer();

function _selectLine({
    lineNo, 
    selectedLineNo, 
    setSelectedLineNo,
    setScrollLineNo,
    takeCaptureState
  }) {
  if (lineNo === selectedLineNo) return;
  setSelectedLineNo(lineNo);
  setScrollLineNo(lineNo);
  openTake({takeCaptureState, lineNo});
}

function _onRetakeLine({takeCaptureState, lineNo}) {
  openTake({takeCaptureState, lineNo});
}

function _onNextLine({
    activeCharacter,
    selectedLineNo, 
    setSelectedLineNo,
    setScrollLineNo,
    script,
    takeCaptureState
}) {
  const lineNo = findNextLineNoForCharacter({script, character:activeCharacter, afterLineNo:selectedLineNo});
  if (lineNo === -1) return; // At end of script.
  _selectLine({lineNo, selectedLineNo, setSelectedLineNo, setScrollLineNo, script, takeCaptureState});
}

function _onClickLine({
    lineNo, 
    selectedLineNo,
    setSelectedLineNo,
    setScrollLineNo,
    script, 
    takeCaptureState}) {
  _selectLine({lineNo, selectedLineNo, setSelectedLineNo, setScrollLineNo, script, takeCaptureState});
}

function _onEnd({navigate, takeCaptureState}) {
  const store = getStore();
  store.lineTakeMap = takeCaptureState.lineTakeMap;
  navigate('/viewScript');
}

function _onResume({selectedLineNo, setOpenDialog, takeCaptureState}) {
  setOpenDialog(null);
  if (!takeCaptureState) return; // Handling initial pause before audio is available.
  openTake({takeCaptureState, lineNo:selectedLineNo});
}

function _onPauseEnd({setOpenDialog, takeCaptureState}) {
  setOpenDialog(PauseSessionDialog.name);
  closeTake({takeCaptureState});
}

function _onPlayStateChange({isPlaying, setChirpPlaying}) {
  setChirpPlaying(isPlaying);
}

function RecordScriptScreen() {
  const [initVars, setInitVars] = useState(null);
  const [selectedLineNo, setSelectedLineNo] = useState(null);
  const [scrollLineNo, setScrollLineNo] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [isChirpPlaying, setChirpPlaying] = useState(false);
  const [takeCaptureState, setTakeCaptureState] = useState(null);
  const [hasSessionStarted, setSessionStarted] = useState(false);
  const [audioContextStatus, setAudioContextStatus] = useState({ has:false, retryCount:0, retryInterval:1 });
  const navigate = useNavigate();

  useEffect(() => { // Needs to happen *after* the render, so I have all the line refs giving me layout info.
    if (scrollLineNo !== null && scrollToLineNo({lineNo:scrollLineNo})) setScrollLineNo(null);
  }, [scrollLineNo]);

  useEffect(() => { // Start session after audio is available and other conditions.
    if (!initVars || openDialog || hasSessionStarted) return;
    if (!audioContextStatus.has) {
      const hasAudioContent = theAudioContext() !== null;
      if (!hasAudioContent) {
        setTimeout(() => { 
          setAudioContextStatus({has:false, retryCount:audioContextStatus.retryCount+1, retryInterval:audioContextStatus.retryInterval*2});
        }, audioContextStatus.retryInterval);
        return;
      }
      setAudioContextStatus({has:true});
    }
    const { selectedLineNo, script, activeCharacter } = initVars;
    const lineNo = findFirstLineNoForCharacter({script, character:activeCharacter});
    const nextTakeCaptureState = createTakeCaptureState();
    setTakeCaptureState(nextTakeCaptureState);
    _selectLine({lineNo, selectedLineNo, setSelectedLineNo, setScrollLineNo, script, takeCaptureState:nextTakeCaptureState});
    setSessionStarted(true);
    eventPlayer.playStartSession();
   }, [initVars, openDialog, selectedLineNo, hasSessionStarted, audioContextStatus, setAudioContextStatus]);
  
  if (!initVars) { // First mount.
    clearLineElements();
    eventPlayer.setOnPlayStateChange({onPlayStateChange:({isPlaying}) => _onPlayStateChange({isPlaying, setChirpPlaying})});
    // Handle case where user hasn't had a chance to make a UI gesture in the browser, enabling audio.
    if (!theAudioContext() && openDialog !== PauseSessionDialog.name) setOpenDialog(PauseSessionDialog.name);
    const store = getStore();
    let nextCharacter = store.activeCharacter;
    let nextScript = store.scripts.active;
    if (!nextCharacter) nextCharacter = nextScript.characters.length > 0 ? nextScript.characters[0] : null;
    setInitVars({
      script:nextScript, 
      activeCharacter:nextCharacter, 
      lastLineNoForCharacter:findLastLineNoForCharacter({script:nextScript, character:nextCharacter})
    });
    return null;
  }
  
  const { script, activeCharacter, lastLineNoForCharacter } = initVars;
  
  const options = [
    { text:'Retake Line', onClick:() => _onRetakeLine({takeCaptureState, lineNo:selectedLineNo}), icon:<Retake /> },
    { text:'Pause / End', onClick:() => _onPauseEnd({setOpenDialog, takeCaptureState}), icon:<Pause /> },
    { text:'Next Line', onClick:() => _onNextLine({activeCharacter, selectedLineNo, setSelectedLineNo, setScrollLineNo, script, takeCaptureState}), icon:<Down /> }
  ];
  options[2].isDisabled = (selectedLineNo === lastLineNoForCharacter);

  const floatBar = !openDialog ? <FloatBar options={options} isDisabled={isChirpPlaying} /> : null;
  const onResume = () => _onResume({selectedLineNo, setOpenDialog, takeCaptureState});
  const onEnd = () => _onEnd({navigate, takeCaptureState});
  const onClickLine = ({lineNo}) => _onClickLine({lineNo, script, selectedLineNo, setSelectedLineNo, setScrollLineNo, takeCaptureState});
  const selectedLineY = getLineY({lineNo:selectedLineNo});

  return (
    <React.Fragment>
        <PauseSessionDialog isOpen={openDialog===PauseSessionDialog.name} onResume={onResume} onEnd={onEnd} />
        <HintArrows selectedLineY={selectedLineY} />
        <div className={styles.scriptBackground}>
          <Script 
            activeCharacter={activeCharacter} 
            onClickLine={onClickLine}
            onReceiveLineRef={onReceiveLineRef}
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
