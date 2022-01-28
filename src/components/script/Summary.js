import { countLinesForCharacter } from 'scripts/scriptAnalysisUtil';
import styles from './Summary.module.css';

const Summary = ({script, activeCharacter}) => {
  if (!script || !activeCharacter) return null;

  const title = script.title.map((titleLine, titleLineI) => {
    return (titleLineI === 0) 
      ? (<span key={titleLineI}>{ titleLine }</span>)
      : (<span key={titleLineI}><br />{ titleLine }</span>);
  });

  const linesForCharacter = countLinesForCharacter({script, character:activeCharacter});
  
  return(
    <div className={ styles.summary }>
      {title}<br/>
      {linesForCharacter} lines for {activeCharacter}
    </div>
  );
}

export default Summary;