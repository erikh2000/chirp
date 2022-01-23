import Action from './Action';
import Character from './Character';
import Parenthetical from './Parenthetical';
import Dialogue from './Dialogue';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  line: { 
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
  unselected: { 
    padding: '.1rem'
  }
});

const Line = ({
    action, 
    character,
    isActiveCharacter,
    isSelected,
    parenthetical, 
    text}) => {
  const styles = useStyles();
  return(
      <div className={ styles.line }>
        <Action action={action} />
        <div className={ isSelected ? styles.selected : styles.unselected }>
          <Character character={character} isActive={isActiveCharacter} />
          <Parenthetical parenthetical={parenthetical} isActive={isActiveCharacter} />
          <Dialogue text={text} isActive={isActiveCharacter} />
        </div>
      </div>
  );
}

export default Line;