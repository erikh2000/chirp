import AppBar from '@material-ui/core/AppBar';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    top: 'auto',
    bottom: 0,
    backgroundColor: '#000000'
  },
  button: {
    margin: '.5rem',
    width: '100%',
    height: '6rem',
    fontSize: '1.5rem'
  }
});

const FloatBar = ({buttons, onReceiveButtonRef}) => {
  const classes = useStyles();

  const buttonElements = !buttons ? [] : buttons.map((button, buttonNo) => {
    return <Button 
        className={classes.button} 
        key={ buttonNo } 
        onClick={ button.onClick }
        ref={ (element) => { if (onReceiveButtonRef) onReceiveButtonRef({element, buttonNo}); } }
        variant='contained'>
      {button.text}
    </Button>;
  });
    
  return(
    <AppBar position='fixed' className={classes.root}>
      <ButtonGroup size='large' color='primary'>
        {buttonElements}
      </ButtonGroup>
    </AppBar>
  );
}

export default FloatBar;