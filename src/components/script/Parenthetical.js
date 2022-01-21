import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  active: { },
  inactive: { 
    color: 'lightgrey'
  }
});

const Parenthetical = ({isActive, parenthetical}) => {
  const styles = useStyles();

  if (!parenthetical) return null;
  
  return(
      <div className={ isActive ? styles.active : styles.inactive }>
        { parenthetical }
      </div>
  );
}

export default Parenthetical;