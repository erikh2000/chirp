import ReviewAudioLine from 'script/ReviewAudioLine';
import styles from './Script.module.css';

const ReviewScript = ({
    activeCharacters,
    exclusions, 
    lineTakeMap, 
    onClickLine, 
    onClickTake, 
    onReceiveLineRef,
    playingLineNo,
    playingTakeNo,
    playStartTime,
    rmsChunks,
    sampleRate,
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
          const isPlayingLine = line.lineNo === playingLineNo;
          const excludedTakes = exclusions[line.lineNo];
          return <ReviewAudioLine 
            action={line.action}   
            character={line.character}
            excludedTakes={excludedTakes}
            isActiveCharacter={isActiveCharacter}
            isSelected={isSelectedLine}
            key={line.lineNo} 
            lineNo={line.lineNo}  
            onClickLine={isActiveCharacter ? onClickLine : null}
            onClickTake={isActiveCharacter ? onClickTake : null}
            onReceiveLineRef={onReceiveLineRef}
            parenthetical={line.parenthetical} 
            playingTakeNo={isPlayingLine ? playingTakeNo : null}
            playStartTime={isPlayingLine ? playStartTime : null}
            rmsChunks={rmsChunks}
            sampleRate={sampleRate}
            selectedTakeNo={isSelectedLine ? selectedTakeNo : null}
            takes={lineTakeMap[line.lineNo]}
            text={line.text}
          />;
        })}
      </div>
  );
}

export default ReviewScript;