import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  active: { },
  inactive: { 
    color: 'lightgrey'
  }
});

const Dialogue = ({isActive, text}) => {
  const styles = useStyles();

  if (!text) return null;
  return(
      <div className={ isActive ? styles.active : styles.inactive }>
        { text }
      </div>
  );
}

export default Dialogue;