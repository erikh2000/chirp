import { 
  BEFORE_FIRST_LINE_NO, 
  findCharactersInLineTakeMap, 
  findFirstIncludedTake, 
  findNextIncludedTake, 
  getTakeFromLineTakeMap 
} from 'audio/takeUtil';
import { playAudioBufferRange, stopAll } from 'audio/playAudioUtil';
import { isAnythingPlaying } from 'audio/theAudioContext';
import { calcRmsChunksFromSamples } from 'audio/rmsUtil';
import { findLastIncludedTakeNoForLine } from 'audio/takeUtil';
import { toAudioBuffer } from 'audio/UnpackedAudio';
import { clearLineElements, getLineY, scrollToLineNo, onReceiveLineRef } from 'common/scrollToLineBehavior';
import FloatBar from 'floatBar/FloatBar';
import { Down, ExcludeTake, EndReview, IncludeTake, PlayTake, Right, Stop } from 'floatBar/FloatBarIcons';
import GenerateDeliveryProgressDialog from './GenerateDeliveryProgressDialog';
import EndReviewDialog from 'reviewAudio/EndReviewDialog';
import { getStore } from 'store/stickyStore';
import HintArrows from 'script/HintArrows';
import ReviewAudioScript from 'script/ReviewAudioScript';
import { excludeTake, includeTake, isTakeExcluded } from 'script/util/exclusionUtil';
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
  const { lineNo, takeNo, sampleNo, sampleCount } = take;
  _stopPlayingTake({setPlayingStatus});
  setPlayingStatus({lineNo, takeNo, playStartTime:Date.now() / 1000});
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

  if (!initVars) {
    clearLineElements();
    const store = getStore();
    const unpackedAudio = store.attachedAudio.unpacked;
    const nextInitVars = {
      activeCharacters: findCharactersInLineTakeMap({lineTakeMap:store.lineTakeMap, script:store.scripts.active}),
      audioBuffer: toAudioBuffer({unpackedAudio}),
      rmsChunks: calcRmsChunksFromSamples({samples:unpackedAudio.channelSamples[0], sampleRate:unpackedAudio.sampleRate}),
      lineTakeMap: store.lineTakeMap,
      script: store.scripts.active
    };
    setInitVars(nextInitVars);
    _selectFirstTake({lineTakeMap:nextInitVars.lineTakeMap, exclusions, previousLineNo:BEFORE_FIRST_LINE_NO, setSelection, setScrollLineNo});
    return null; // Render after state vars are updated.
  }

  const { lineTakeMap, audioBuffer, activeCharacters, rmsChunks, script } = initVars;
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
