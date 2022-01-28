import Line from 'components/script/Line';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  script: { 
    maxWidth: '60rem',
    paddingTop: '5rem',
    paddingBottom: '50%', // To allow last line to scroll to center of display.
    backgroundColor: '#eeeeee'
  },
  scriptRecording: {
    maxWidth: '60rem',
    paddingTop: '5rem',
    paddingBottom: '50%',
    backgroundColor: '#ffffff'
  }
});

const Script = ({activeCharacter, isLineSelectionDisabled, isRecording, onClickLine, onReceiveLineY, selectedLineNo, script}) => {
  const styles = useStyles();

  if (!script) return null;

  return(
      <Container className={ isRecording ? styles.scriptRecording : styles.script }>
        {script.lines.map((line) => (
          <Line 
            action={line.action}   
            character={line.character}
            key={line.lineNo} 
            isActiveCharacter={line.character === activeCharacter}
            isLineSelectionDisabled={isLineSelectionDisabled}
            isSelected={line.lineNo === selectedLineNo}
            isRecording={isRecording}
            lineNo={line.lineNo}  
            onClickLine={line.character === activeCharacter ? onClickLine : null}
            onReceiveLineY={onReceiveLineY}
            parenthetical={line.parenthetical} 
            text={line.text}
          />
        ))}
      </Container>
  );
}

export default Script;