import { timeToSampleCount } from 'audio/sampleUtil';
import Action from 'script/Action';
import Character from 'script/Character';
import Dialogue from 'script/Dialogue';
import Parenthetical from 'script/Parenthetical';
import ReviewAudioWave from 'script/ReviewAudioWave';
import Takes from 'script/Takes';
import styles from './ReviewAudioLine.module.css';

import { useState } from 'react';

function _styleNameForSelectAndHover({isSelected, isHovering, isActiveCharacter, isLineSelectionDisabled}) {
  let styleName = isSelected ? 'selected' : 'unselected';
  if (isHovering && isActiveCharacter && !isLineSelectionDisabled) styleName += 'Hovering';
  return styleName;
}

const ReviewAudioLine = ({
    action, 
    character,
    excludedTakes,
    isActiveCharacter,
    isSelected,
    lineNo,
    onClickLine,
    onClickTake,
    onReceiveLineRef,
    parenthetical,
    playingTakeNo,
    playStartTime,
    rmsChunks,
    sampleRate,
    selectedTakeNo,
    takes, 
    text}) => {
  const [isHovering, setHovering] = useState(false);
  
  function _onLineRef({element, lineNo}) {
    if (!onReceiveLineRef || !element) return;
    onReceiveLineRef({element, lineNo});
  }

  const areLinesSelectable = onClickLine;
  const _onMouseEnter = areLinesSelectable ? () => setHovering(true) : null;
  const _onMouseLeave = areLinesSelectable ? () => setHovering(false) : null;
  const _onClick = areLinesSelectable ? () => onClickLine({lineNo}) : null;

  if (!areLinesSelectable && isHovering) setHovering(false);

  const selectAndHoverStyle = styles[_styleNameForSelectAndHover({isSelected, isHovering, isActiveCharacter})];

  const _onClickTake = onClickTake ? ({takeNo}) => onClickTake({lineNo, takeNo}) : null;

  const selectedTake = takes?.find(take => take.takeNo === selectedTakeNo);
  const isSelectedTakePlaying = selectedTake && selectedTakeNo === playingTakeNo;
  const reviewAudioWave = selectedTake 
    ? <ReviewAudioWave 
        isPlaying={isSelectedTakePlaying}
        playStartTime={isSelectedTakePlaying ? playStartTime : null}
        rmsChunks={rmsChunks} 
        startSampleNo={timeToSampleCount({time:selectedTake.time, sampleRate})} 
        sampleCount={timeToSampleCount({time:selectedTake.duration, sampleRate})} 
        sampleRate={sampleRate} 
      /> 
    : null;

  return(
      <div className={ styles.line } ref={element => _onLineRef({element, lineNo})}>
        <Action action={action} />
        <div className={selectAndHoverStyle} onMouseEnter={_onMouseEnter} onMouseLeave={_onMouseLeave} onClick={_onClick}>
          {reviewAudioWave}
          <Character character={character} isActive={isActiveCharacter} />
          <Parenthetical parenthetical={parenthetical} isActive={isActiveCharacter} />
          <Dialogue text={text} isActive={isActiveCharacter} />
          <Takes 
            excludedTakes={excludedTakes}
            onClickTake={_onClickTake}
            playingTakeNo={playingTakeNo}
            selectedTakeNo={selectedTakeNo}
            takes={takes}
          />
        </div>
      </div>
  );
}

export default ReviewAudioLine;