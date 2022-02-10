import Action from 'script/Action';
import Character from 'script/Character';
import Dialogue from 'script/Dialogue';
import Parenthetical from 'script/Parenthetical';
import RecordingIcon from 'script/RecordingIcon';
import styles from './Line.module.css';
import Takes from 'script/Takes';

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

  return(
      <div className={ styles.line } ref={element => _onLineRef({element, lineNo})}>
        <Action action={action} />
        <div className={selectAndHoverStyle} onMouseEnter={_onMouseEnter} onMouseLeave={_onMouseLeave} onClick={_onClick}>
          <Character character={character} isActive={isActiveCharacter} />
          <Parenthetical parenthetical={parenthetical} isActive={isActiveCharacter} />
          <Dialogue text={text} isActive={isActiveCharacter} />
          <Takes excludedTakes={excludedTakes} playingTakeNo={playingTakeNo} takes={takes} selectedTakeNo={selectedTakeNo} onClickTake={_onClickTake}/>
        </div>
      </div>
  );
}

export default ReviewAudioLine;