import Action from './Action';
import Character from './Character';
import Dialogue from './Dialogue';
import Parenthetical from './Parenthetical';
import RecordingIcon from './RecordingIcon';

import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';

const useStyles = makeStyles({
  line: {
    position: 'relative',
    marginBottom: '2rem',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Courier, sans-serif',
    fontSize: '2rem'
  },
  selected: { 
    backgroundColor: '#FFFFAA',
    borderStyle: 'solid',
    borderWidth: '.1rem',
    borderColor: '#AAAA00'
  },
  selectedHovering: { 
    backgroundColor: '#FFFFAA',
    borderStyle: 'dashed',
    borderWidth: '.1rem',
    borderColor: '#AAAA00',
    cursor: 'pointer'
  },
  unselected: { 
    padding: '.1rem'
  },
  unselectedHovering: { 
    borderStyle: 'dashed',
    borderWidth: '.1rem',
    borderColor: '#AAAA00',
    cursor: 'pointer'
  }
});

function _styleNameForSelectAndHover({isSelected, isHovering, isActiveCharacter, isLineSelectionDisabled}) {
  let styleName = isSelected ? 'selected' : 'unselected';
  if (isHovering && isActiveCharacter && !isLineSelectionDisabled) styleName += 'Hovering';
  return styleName;
}

const Line = ({
    action, 
    character,
    isActiveCharacter,
    isLineSelectionDisabled,
    isRecording,
    isSelected,
    lineNo,
    onClickLine,
    onReceiveLineY,
    parenthetical, 
    text}) => {
  const [isHovering, setHovering] = useState(false);
  const styles = useStyles();
  
  function _onLineRef({element, lineNo}) {
    if (!onReceiveLineY || !element) return;
    const domRect = element.getBoundingClientRect();
    const { y } = domRect;
    onReceiveLineY({y, lineNo});
  }

  const areLinesSelectable = onClickLine && !isLineSelectionDisabled;
  const _onMouseEnter = areLinesSelectable ? () => setHovering(true) : null;
  const _onMouseLeave = areLinesSelectable ? () => setHovering(false) : null;
  const _onClick = areLinesSelectable ? () => onClickLine({lineNo}) : null;

  if (!areLinesSelectable && isHovering) setHovering(false);

  const selectAndHoverStyle = styles[_styleNameForSelectAndHover({isSelected, isHovering, isActiveCharacter, isLineSelectionDisabled})];

  return(
      <div className={ styles.line } ref={element => _onLineRef({element, lineNo})}>
        <Action action={action} />
        <div className={selectAndHoverStyle} onMouseEnter={_onMouseEnter} onMouseLeave={_onMouseLeave} onClick={_onClick}>
          <RecordingIcon isActive={isSelected && isRecording} />
          <Character character={character} isActive={isActiveCharacter} />
          <Parenthetical parenthetical={parenthetical} isActive={isActiveCharacter} />
          <Dialogue text={text} isActive={isActiveCharacter} />
        </div>
      </div>
  );
}

export default Line;