import { countLinesForCharacter } from 'scripts/scriptAnalysisUtil';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: { 
    position: 'fixed',
    
  }
});

const Summary = ({script, activeCharacter}) => {
  const styles = useStyles();

  if (!script || !activeCharacter) return null;

  const title = script.title.map((titleLine, titleLineI) => {
    return (titleLineI === 0) 
      ? (<span key={titleLineI}>{ titleLine }</span>)
      : (<span key={titleLineI}><br />{ titleLine }</span>);
  });

  const linesForCharacter = countLinesForCharacter({script, character:activeCharacter});
  
  return(
      <div className={ styles.root }>
        <Typography variant="subtitle1">
          {title}<br/>
          {linesForCharacter} lines for {activeCharacter}
        </Typography>
      </div>
  );
}

export default Summary;