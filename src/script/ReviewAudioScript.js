import Line from 'script/Line';
import styles from './Script.module.css';

const ReviewScript = ({
    activeCharacters,
    exclusions, 
    isLineSelectionDisabled, 
    lineTakeMap, 
    onClickLine, 
    onClickTake, 
    onReceiveLineRef,
    playingLineNo,
    playingTakeNo, 
    script,
    selectedLineNo,
    selectedTakeNo
  }) => {
  if (!script || !lineTakeMap) return null;

  return(
      <div className={ styles.script }>
        {script.lines.map((line) => {
          const isActiveCharacter = activeCharacters.includes(line.normalizedCharacter);
          const isSelectedLine = line.lineNo === selectedLineNo;
          const excludedTakes = exclusions[line.lineNo];
          return <Line 
            action={line.action}   
            character={line.character}
            excludedTakes={excludedTakes}
            isActiveCharacter={isActiveCharacter}
            isLineSelectionDisabled={isLineSelectionDisabled}
            isSelected={isSelectedLine}
            key={line.lineNo} 
            lineNo={line.lineNo}  
            onClickLine={isActiveCharacter ? onClickLine : null}
            onClickTake={isActiveCharacter ? onClickTake : null}
            onReceiveLineRef={onReceiveLineRef}
            parenthetical={line.parenthetical} 
            playingTakeNo={line.lineNo === playingLineNo ? playingTakeNo : null}
            selectedTakeNo={isSelectedLine ? selectedTakeNo : null}
            takes={lineTakeMap[line.lineNo]}
            text={line.text}
          />;
        })}
      </div>
  );
}

export default ReviewScript;