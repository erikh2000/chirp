import Line from 'script/Line';
import styles from './Script.module.css';


const Script = ({activeCharacter, isLineSelectionDisabled, isRecording, onClickLine, onReceiveLineY, selectedLineNo, script}) => {
  if (!script) return null;

  return(
      <div className={ styles.script }>
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
      </div>
  );
}

export default Script;