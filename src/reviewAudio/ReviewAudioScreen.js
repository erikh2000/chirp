import { 
  BEFORE_FIRST_LINE_NO, 
  findCharactersInLineTakeMap, 
  findFirstIncludedTake, 
  findNextIncludedTake, 
  getTakeFromLineTakeMap 
} from 'audio/takeUtil';
import { toAudioBuffer } from 'audio/UnpackedAudio';
import FloatBar from 'floatBar/FloatBar';
import { Down, ExcludeTake, EndReview, IncludeTake, PlayTake, Right } from 'floatBar/FloatBarIcons';
import { playAudioBufferRange, stopAll } from 'audio/playAudioUtil';
import { findLastIncludedTakeNoForLine } from 'audio/takeUtil';
import { getStore } from 'store/stickyStore';
import HintArrows from 'script/HintArrows';
import ReviewAudioScript from 'script/ReviewAudioScript';
import { excludeTake, includeTake, isTakeExcluded } from 'script/util/exclusionUtil';
import styles from './ReviewAudioScreen.module.css'

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAnythingPlaying } from 'audio/theAudioContext';

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
  stopAll();
  setExclusions(excludeTake({exclusions, lineNo, takeNo}));
}

function _onEndReview({navigate}) {
  navigate('/viewScript');
}

function _selectTake({previousLineNo, lineNo, takeNo, setSelection, setScrollLineNo}) {
  if (previousLineNo !== lineNo) setScrollLineNo(lineNo);
  setSelection({lineNo, takeNo});
}

function _selectTakeWithoutScrolling({lineNo, takeNo, setSelection}) {
  setSelection({lineNo, takeNo});
}

function _selectFirstTake({lineTakeMap, exclusions, previousLineNo, setSelection, setScrollLineNo}) {
  const firstTake = findFirstIncludedTake({lineTakeMap, exclusions});
  if (!firstTake) return;
  _selectTake({previousLineNo, lineNo:firstTake.lineNo, takeNo:firstTake.takeNo, setSelection, setScrollLineNo});
}

function _playTake({audioBuffer, take, setPlayingStatus}) {
  const { lineNo, takeNo, sampleNo, sampleCount } = take;
  stopAll();
  setPlayingStatus({lineNo, takeNo});
  playAudioBufferRange({audioBuffer, sampleNo, sampleCount, onEnded:() => {
    if (!isAnythingPlaying()) setPlayingStatus(null); // Handle case of the stopAll() above stopping a different source from playing.
  }});
}

function _onPlayTake({audioBuffer, lineTakeMap, lineNo, takeNo, setPlayingStatus}) {
  const take = getTakeFromLineTakeMap({lineTakeMap, lineNo, takeNo});
  if (!take) return;
  _playTake({audioBuffer, take, setPlayingStatus});
}

function _onNextTake({audioBuffer, lineTakeMap, lineNo, takeNo, exclusions, setSelection, setScrollLineNo, setPlayingStatus}) {
  let take = findNextIncludedTake({lineTakeMap, lineNo, takeNo, exclusions});
  if (!take) {
    take = findFirstIncludedTake({lineTakeMap, exclusions});
    if (!take) return;
  }
  _playTake({audioBuffer, take, setPlayingStatus});
  _selectTake({previousLineNo:lineNo, lineNo:take.lineNo, takeNo:take.takeNo, setSelection, setScrollLineNo});
}

/* Note that any excluded take coming after the last included take on a line
   will return true. */
function _shouldNextButtonGoToNextLine({lineTakeMap, lineNo, takeNo, exclusions}) {
  const takes = lineTakeMap[lineNo];
  if (!takes) return false;
  const lastIncludedTakeNo = findLastIncludedTakeNoForLine({lineTakeMap, lineNo, exclusions});
  return takeNo >= lastIncludedTakeNo;
}

function _onClickTake({audioBuffer, lineTakeMap, lineNo, takeNo, setSelection, setPlayingStatus}) {
  const take = getTakeFromLineTakeMap({lineTakeMap, lineNo, takeNo});
  if (!take) return;
  _playTake({audioBuffer, take, setPlayingStatus});
  _selectTakeWithoutScrolling({lineNo, takeNo, setSelection});
}

function ReviewAudioScreen() {
  const [initVars, setInitVars] = useState(null);
  const [selection, setSelection] = useState({lineNo:null, takeNo:null});
  const [scrollLineNo, setScrollLineNo] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [exclusions, setExclusions] = useState({});
  const [playingStatus, setPlayingStatus] = useState(null);
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
      script: store.scripts.active,
    };
    setInitVars(nextInitVars);
    _selectFirstTake({lineTakeMap:nextInitVars.lineTakeMap, exclusions, previousLineNo:BEFORE_FIRST_LINE_NO, setSelection, setScrollLineNo});
    return null; // Render after state vars are updated.
  }

  const { lineTakeMap, audioBuffer, activeCharacters, script } = initVars;
  const { lineNo, takeNo } = selection;

  const isCurrentTakeExcluded = isTakeExcluded({exclusions, lineNo, takeNo});
  const showNextLine = _shouldNextButtonGoToNextLine({lineTakeMap, exclusions, lineNo, takeNo});
  const onNextTake = () => _onNextTake({audioBuffer, lineTakeMap, lineNo, takeNo, exclusions, setSelection, setScrollLineNo, setPlayingStatus});
  const options = [
    { text:'Play Take', icon:<PlayTake />, onClick: () => _onPlayTake({audioBuffer, lineTakeMap, lineNo, takeNo, setPlayingStatus}) },
    isCurrentTakeExcluded 
      ? { text:'Include Take', onClick:() => _onIncludeTake({lineNo, takeNo, exclusions, setExclusions }), icon:<IncludeTake />}
      : { text:'Exclude Take', onClick:() => _onExcludeTake({lineNo, takeNo, exclusions, setExclusions }), icon:<ExcludeTake />},
    { text:'End Review', onClick:() => _onEndReview({navigate}), icon:<EndReview /> },
    showNextLine
      ? { text:'Next Line', icon:<Down />, onClick:onNextTake }
      : { text:'Next Take', icon:<Right />, onClick:onNextTake }
  ];
  const onClickTake = ({lineNo, takeNo}) => _onClickTake({audioBuffer, lineTakeMap, lineNo, takeNo, setSelection, setPlayingStatus});
  const selectedLineY = _getLineY({lineNo});
  const floatBar = !openDialog ? <FloatBar options={options} /> : null;
  const playingLineNo = playingStatus?.lineNo, playingTakeNo = playingStatus?.takeNo;
  
  return (
    <React.Fragment>
        <HintArrows selectedLineY={selectedLineY} />
        <div className={styles.scriptBackground}>
          <ReviewAudioScript 
            activeCharacters={activeCharacters} 
            exclusions={exclusions}
            lineTakeMap={lineTakeMap}
            onReceiveLineRef={_onReceiveLineRef}
            onClickTake={onClickTake}
            playingLineNo={playingLineNo}
            playingTakeNo={playingTakeNo}
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
