import { findCharactersInLineTakeMap, findFirstIncludedTakeNoForLine, findNextTake, getTakeFromLineTakeMap } from 'audio/takeUtil';
import { toAudioBuffer } from 'audio/UnpackedAudio';
import FloatBar from 'floatBar/FloatBar';
import { Down, ExcludeTake, EndReview, IncludeTake, PlayTake, Right } from 'floatBar/FloatBarIcons';
import { playAudioBufferRange } from 'audio/playAudioUtil';
import { findLastIncludedTakeNoForLine } from 'audio/takeUtil';
import { getStore } from 'store/stickyStore';
import ReviewAudioScript from 'script/ReviewAudioScript';
import { excludeTake, includeTake, isTakeExcluded } from 'script/util/exclusionUtil';
import { findFirstLineNoForCharacters } from 'script/util/scriptAnalysisUtil';
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

function _onIncludeTake({lineNo, takeNo, exclusions, setExclusions }) {
  setExclusions(includeTake({exclusions, lineNo, takeNo}));
}

function _onExcludeTake({lineNo, takeNo, exclusions, setExclusions }) {
  setExclusions(excludeTake({exclusions, lineNo, takeNo}));
}

function _onEndReview({navigate}) {
  navigate('/viewScript');
}

function _onNextTake({lineTakeMap, lineNo, takeNo, exclusions, setSelection}) {
  const take = findNextTake({lineTakeMap, lineNo, takeNo, exclusions});
  if (!take) return;
  setSelection({lineNo:take.lineNo, takeNo:take.takeNo});
}

/* Note that any excluded take coming after the last included take on a line
   will return true. */
function _shouldNextButtonGoToNextLine({lineTakeMap, lineNo, takeNo, exclusions}) {
  const takes = lineTakeMap[lineNo];
  if (!takes) return false;
  const lastIncludedTakeNo = findLastIncludedTakeNoForLine({lineTakeMap, lineNo, exclusions});
  return takeNo >= lastIncludedTakeNo;
}

function ReviewAudioScreen() {
  const [initVars, setInitVars] = useState(null);
  const [selection, setSelection] = useState({lineNo:null, takeNo:null});
  const [scrollLineNo, setScrollLineNo] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [exclusions, setExclusions] = useState({});
  const navigate = useNavigate();

  useEffect(() => { // Needs to happen *after* the render, so I have all the line refs giving me layout info.
    if (scrollLineNo !== null && _scrollToLineNo({lineNo:scrollLineNo})) {
      setScrollLineNo(null);
    }
  }, [scrollLineNo]);

  if (!initVars) {
    lineElements = {};
    const store = getStore();
    const nextInitVars = {
      activeCharacters: findCharactersInLineTakeMap({lineTakeMap:store.lineTakeMap, script:store.scripts.active}),
      audioBuffer: toAudioBuffer({unpackedAudio:store.attachedAudio.unpacked}),
      lineTakeMap: store.lineTakeMap,
      script: store.scripts.active
    };
    setInitVars(nextInitVars);
    const nextLineNo = findFirstLineNoForCharacters({script:nextInitVars.script, characters:nextInitVars.activeCharacters});
    const nextTakeNo = findFirstIncludedTakeNoForLine({lineTakeMap:nextInitVars.lineTakeMap, lineNo:nextLineNo, exclusions});
    setSelection({lineNo:nextLineNo, takeNo:nextTakeNo});
    return null; // Render after state vars are updated.
  }

  const { lineTakeMap, audioBuffer, activeCharacters, script } = initVars;
  const { lineNo, takeNo } = selection;

  const isCurrentTakeExcluded = isTakeExcluded({exclusions, lineNo, takeNo});
  const showNextLine = _shouldNextButtonGoToNextLine({lineTakeMap, exclusions, lineNo, takeNo});
  const options = [
    { text:'Play Take', icon:<PlayTake /> },
    isCurrentTakeExcluded 
      ? { text:'Include Take', onClick:() => _onIncludeTake({lineNo, takeNo, exclusions, setExclusions }), icon:<IncludeTake />}
      : { text:'Exclude Take', onClick:() => _onExcludeTake({lineNo, takeNo, exclusions, setExclusions }), icon:<ExcludeTake />},
    { text:'End Review', onClick:() => _onEndReview({navigate}), icon:<EndReview /> },
    showNextLine
      ? { text:'Next Line', icon:<Down />, onClick:() => _onNextTake({lineTakeMap, lineNo, takeNo, exclusions, setSelection}) }
      : { text:'Next Take', icon:<Right />, onClick:() => _onNextTake({lineTakeMap, lineNo, takeNo, exclusions, setSelection}) }
  ];

  function _onClickTake({lineNo, takeNo}) {
    const take = getTakeFromLineTakeMap({ lineTakeMap, lineNo, takeNo });
    if (!take) return;
    playAudioBufferRange({audioBuffer, sampleNo:take.sampleNo, sampleCount:take.sampleCount});
  }

  const floatBar = !openDialog ? <FloatBar options={options} /> : null;
  
  return (
    <React.Fragment>
        <div className={styles.scriptBackground}>
          <ReviewAudioScript 
            activeCharacters={activeCharacters} 
            exclusions={exclusions}
            lineTakeMap={lineTakeMap}
            onReceiveLineRef={_onReceiveLineRef}
            onClickTake={_onClickTake}
            script={script} 
            selectedLineNo={selection.lineNo}
            selectedTakeNo={selection.takeNo}
          />
        </div>
        {floatBar}
    </React.Fragment>
  );
}

export default ReviewAudioScreen;
