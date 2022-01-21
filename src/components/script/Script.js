import Line from 'components/script/Line';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  script: { 
    maxWidth: '60rem',
    paddingTop: '5rem',
    paddingBottom: '50%' // To allow last line to scroll to center of display.
  }
});

const Script = ({script, activeCharacter}) => {
  const styles = useStyles();

  if (!script) return null;

  return(
      <Container className={ styles.script }>
        {script.lines.map((line) => (
          <Line 
            key={line.lineNo} 
            lineNo={line.lineNo} 
            character={line.character} 
            parenthetical={line.parenthetical} 
            action={line.action} 
            text={line.text}
            isActiveCharacter={line.character === activeCharacter}
          />
        ))}
      </Container>
  );
}

export default Script;