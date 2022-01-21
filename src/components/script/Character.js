import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  active: { },
  inactive: { 
    color: 'lightgrey'
  }
});

const Character = ({character, isActive}) => {
  const styles = useStyles();

  if (!character) return null;
  
  return(
      <div className={ isActive ? styles.active : styles.inactive }>
        { character.toUpperCase() }
      </div>
  );
}

export default Character;