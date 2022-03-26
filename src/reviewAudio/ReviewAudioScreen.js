import { findStartSession } from 'audio/eventDecoder';
import { calcStartToneDuration } from 'audio/eventEncoder';
import { playAudioBufferRange, stopAll } from 'audio/playAudioUtil';
import { isAnythingPlaying } from 'audio/theAudioContext';
import {calcRmsChunksFromSamples, findRmsCeiling, findSilenceTrimmedRange} from 'audio/rmsUtil';
import { toAudioBuffer } from 'audio/UnpackedAudio';
import { clearLineElements, getLineY, scrollToLineNo, onReceiveLineRef } from 'common/scrollToLineBehavior';
import {textToSafeFilename} from "common/util/textFilterUtil";
import FloatBar from 'floatBar/FloatBar';
import { Down, ExcludeTake, EndReview, IncludeTake, PlayTake, Right, Stop } from 'floatBar/FloatBarIcons';
import EndReviewDialog from 'reviewAudio/EndReviewDialog';
import GenerateDeliveryProgressDialog from 'reviewAudio/GenerateDeliveryProgressDialog';
import HintArrows from 'script/HintArrows';
import ReviewAudioScript from 'script/ReviewAudioScript';
import { excludeTake, includeTake, isTakeExcluded } from 'script/util/exclusionUtil';
import { getStore } from 'store/stickyStore';
import {
  BEFORE_FIRST_LINE_NO,
  findCharactersInLineTakeMap,
  findFirstIncludedTake,
  findLastIncludedTakeNoForLine,
  findNextIncludedTake, 
  findTakeNearTime, 
  getIncludedTakesFromLineTakeMap,
  getTakeFromLineTakeMap,
  offsetLineTakeMap
} from 'takes/takeUtil';
import styles from './ReviewAudioScreen.module.css'

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function _stopPlayingTake({setPlayingStatus}) {
  stopAll();
  setPlayingStatus(null);
}

function _onIncludeTake({lineNo, takeNo, exclusions, setExclusions }) {
  setExclusions(includeTake({exclusions, lineNo, takeNo}));
}

function _onExcludeTake({lineNo, takeNo, exclusions, setExclusions, setPlayingStatus }) {
  _stopPlayingTake({setPlayingStatus});
  setExclusions(excludeTake({exclusions, lineNo, takeNo}));
}

function _onEndReview({setOpenDialog, setPlayingStatus}) {
  _stopPlayingTake({setPlayingStatus});
  setOpenDialog(EndReviewDialog.name);
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
  const { lineNo, takeNo, time, duration } = take;
  _stopPlayingTake({setPlayingStatus});
  setPlayingStatus({lineNo, takeNo, playStartTime:Date.now() / 1000});
  playAudioBufferRange({audioBuffer, time, duration, onEnded:() => {
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

function _onClickTake({audioBuffer, lineTakeMap, lineNo, takeNo, selection, setSelection, playingStatus, setPlayingStatus}) {
  _stopPlayingTake({setPlayingStatus});
  if (lineNo === selection.lineNo && takeNo === selection.takeNo && playingStatus) return; // Clicking on the take that is already playing should stop it.
  const take = getTakeFromLineTakeMap({lineTakeMap, lineNo, takeNo});
  if (!take) return;
  _playTake({audioBuffer, take, setPlayingStatus});
  _selectTakeWithoutScrolling({lineNo, takeNo, setSelection});
}

function _onStopPlaying({setPlayingStatus}) {
  _stopPlayingTake({setPlayingStatus});
}

function _onEndReviewCancel({setOpenDialog}) {
  setOpenDialog(null);
}

function _onSkipDelivery({navigate}) {
  navigate('viewScript');
}

function _onGenerateDelivery({setOpenDialog}) {
  setOpenDialog(GenerateDeliveryProgressDialog.name);
}

function _onGenerateDeliveryComplete({setOpenDialog, navigate}) {
  setOpenDialog(null);
  navigate('/viewScript'); // TODO some UI to indicate successful completion.
}

function _trimStartTone({lineTakeMap, sessionStartTime}) {
  const take = findTakeNearTime({lineTakeMap, time:sessionStartTime, toleranceTime:.01});
  if (!take) return;
  const startToneDuration = calcStartToneDuration();
  take.time += startToneDuration;
  take.duration -= startToneDuration;
}

function _trimSilence({lineTakeMap, rmsChunks, exclusions}) {
  const SILENCE_RATIO = .015;
  const MARGIN_DURATION = .1;
  const rmsCeiling = findRmsCeiling({chunks:rmsChunks});
  const rmsSignalThreshold = rmsCeiling * SILENCE_RATIO;
  const takes = getIncludedTakesFromLineTakeMap({lineTakeMap, exclusions});
  takes.forEach(take => {
    const { time, duration } = take;
    const [trimmedTime, trimmedDuration] = findSilenceTrimmedRange({time, duration, rmsSignalThreshold, marginDuration:MARGIN_DURATION, chunks:rmsChunks});
    take.time = trimmedTime;
    take.duration = trimmedDuration;
  });
}

function _scriptTitleToName({title}) {
  return textToSafeFilename({text:title.join('-')});
}

function _createInitVars() {
  const exclusions = {};
  const store = getStore();
  const script = store.scripts.active;
  const lineTakeMap = store.lineTakeMap;
  const unpackedAudio = store.attachedAudio.unpacked;
  const audioBuffer = toAudioBuffer({unpackedAudio});
  const activeCharacters = findCharactersInLineTakeMap({lineTakeMap, script});
  const rmsChunks = calcRmsChunksFromSamples({samples:unpackedAudio.channelSamples[0], sampleRate:unpackedAudio.sampleRate});
  const sessionStartTime = findStartSession({audioBuffer});
  const scriptName = _scriptTitleToName({title:script.title});
  if (sessionStartTime !== null) {
    offsetLineTakeMap({lineTakeMap, offset: sessionStartTime});
    _trimStartTone({lineTakeMap, sessionStartTime});
    _trimSilence({lineTakeMap, rmsChunks, exclusions});
  }
  return { activeCharacters, audioBuffer, rmsChunks, lineTakeMap, script, scriptName };
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
    if (scrollLineNo !== null && scrollToLineNo({lineNo:scrollLineNo})) {
      setScrollLineNo(null);
    }
  }, [scrollLineNo]);

  useEffect(() => { // Mount
    const nextInitVars = _createInitVars();
    setInitVars(nextInitVars);
    _selectFirstTake({
      lineTakeMap: nextInitVars.lineTakeMap, exclusions:{}, previousLineNo: BEFORE_FIRST_LINE_NO, setSelection, setScrollLineNo
    });
  }, []);
  
  if (!initVars) {
    clearLineElements();
    return null;
  }

  const { scriptName, lineTakeMap, audioBuffer, activeCharacters, rmsChunks, script } = initVars;
  const { lineNo, takeNo } = selection;

  const isCurrentTakeExcluded = isTakeExcluded({exclusions, lineNo, takeNo});
  const showNextLine = _shouldNextButtonGoToNextLine({lineTakeMap, exclusions, lineNo, takeNo});
  const onNextTake = () => _onNextTake({audioBuffer, lineTakeMap, lineNo, takeNo, exclusions, setSelection, setScrollLineNo, setPlayingStatus});
  const options = [ 
    playingStatus
      ? { text:'Stop', icon:<Stop />, onClick: () => _onStopPlaying({setPlayingStatus}) }
      : { text:'Play Take', icon:<PlayTake />, onClick: () => _onPlayTake({audioBuffer, lineTakeMap, lineNo, takeNo, setPlayingStatus}) },
    isCurrentTakeExcluded 
      ? { text:'Include Take', onClick:() => _onIncludeTake({lineNo, takeNo, exclusions, setExclusions }), icon:<IncludeTake />}
      : { text:'Exclude Take', onClick:() => _onExcludeTake({lineNo, takeNo, exclusions, setExclusions, setPlayingStatus }), icon:<ExcludeTake />},
    { text:'End Review', onClick:() => _onEndReview({setOpenDialog, setPlayingStatus}), icon:<EndReview /> },
    showNextLine
      ? { text:'Next Line', icon:<Down />, onClick:onNextTake }
      : { text:'Next Take', icon:<Right />, onClick:onNextTake }
  ];
  const onClickTake = ({lineNo, takeNo}) => _onClickTake({audioBuffer, lineTakeMap, lineNo, takeNo, playingStatus, selection, setSelection, setPlayingStatus});
  const selectedLineY = getLineY({lineNo});
  const floatBar = !openDialog ? <FloatBar options={options} /> : null;
  const playingLineNo = playingStatus?.lineNo, playingTakeNo = playingStatus?.takeNo;
  const playStartTime = playingStatus ? playingStatus.playStartTime : null;
  
  return (
    <React.Fragment>
        <EndReviewDialog 
          isOpen={openDialog === EndReviewDialog.name} 
          onCancel={() => _onEndReviewCancel({setOpenDialog})} 
          onGenerate={() => _onGenerateDelivery({setOpenDialog})}
          onSkip={() => _onSkipDelivery({navigate})}
        />
        <GenerateDeliveryProgressDialog
          audioBuffer={audioBuffer}
          exclusions={exclusions}
          isOpen={openDialog === GenerateDeliveryProgressDialog.name} 
          lineTakeMap={lineTakeMap}
          onCancel={() => _onEndReviewCancel({setOpenDialog})} 
          onComplete={() => _onGenerateDeliveryComplete({setOpenDialog, navigate})}
          scriptName={scriptName}
        />
        <HintArrows selectedLineY={selectedLineY} />
        <div className={styles.scriptBackground}>
          <ReviewAudioScript 
            activeCharacters={activeCharacters} 
            exclusions={exclusions}
            lineTakeMap={lineTakeMap}
            onReceiveLineRef={onReceiveLineRef}
            onClickTake={onClickTake}
            playingLineNo={playingLineNo}
            playingTakeNo={playingTakeNo}
            playStartTime={playStartTime}
            rmsChunks={rmsChunks}
            sampleRate={audioBuffer.sampleRate}
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
