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
  }
});

const Line = ({
    action, 
    character,
    isActiveCharacter,
    lineNo, 
    parenthetical, 
    text}) => {
  const styles = useStyles();
  return(
      <div className={ styles.line }>
        <Action action={action} />
        <Character character={character} isActive={isActiveCharacter} />
        <Parenthetical parenthetical={parenthetical} isActive={isActiveCharacter} />
        <Dialogue text={text} isActive={isActiveCharacter} />
      </div>
  );
}

export default Line;