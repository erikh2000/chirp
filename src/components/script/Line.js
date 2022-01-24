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

function _styleNameForSelectAndHover({isSelected, isHovering, isActiveCharacter}) {
  let styleName = isSelected ? 'selected' : 'unselected';
  if (isHovering && isActiveCharacter) styleName += 'Hovering';
  return styleName;
}

const Line = ({
    action, 
    character,
    isActiveCharacter,
    isSelected,
    lineNo,
    onClickLine,
    onReceiveLineY,
    parenthetical, 
    text}) => {
  const [isHovering, setIsHovering] = useState(false);
  const styles = useStyles();
  
  function _onLineRef({element, lineNo}) {
    if (!onReceiveLineY || !element) return;
    const domRect = element.getBoundingClientRect();
    const { y } = domRect;
    onReceiveLineY({y, lineNo});
  }

  const areLinesSelectable = onClickLine;
  const _onMouseEnter = areLinesSelectable ? () => setIsHovering(true) : null;
  const _onMouseLeave = areLinesSelectable ? () => setIsHovering(false) : null;
  const _onClick = areLinesSelectable ? () => onClickLine({lineNo}) : null; 

  const selectAndHoverStyle = styles[_styleNameForSelectAndHover({isSelected, isHovering, isActiveCharacter})];

  return(
      <div className={ styles.line } ref={element => _onLineRef({element, lineNo})}>
        <Action action={action} />
        <div className={selectAndHoverStyle} onMouseEnter={_onMouseEnter} onMouseLeave={_onMouseLeave} onClick={_onClick}>
          <RecordingIcon isActive={isSelected} />
          <Character character={character} isActive={isActiveCharacter} />
          <Parenthetical parenthetical={parenthetical} isActive={isActiveCharacter} />
          <Dialogue text={text} isActive={isActiveCharacter} />
        </div>
      </div>
  );
}

export default Line;