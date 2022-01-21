import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  action: { 
    textAlign: 'left',
    marginBottom: '2rem'
  }
});

const Action = ({action}) => {
  const styles = useStyles();

  if (!action) return null;
  
  return(
      <div className={ styles.action }>
        { action }
      </div>
  );
}

export default Action;