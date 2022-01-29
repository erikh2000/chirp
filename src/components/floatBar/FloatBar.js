import AppBar from '@material-ui/core/AppBar';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';

import FloatBarButton from 'components/floatBar/FloatBarButton';

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

const FloatBar = ({buttons, isEnabled}) => {
  const classes = useStyles();

  const buttonElements = !buttons ? [] : buttons.map((button, buttonNo) => {
    return <FloatBarButton key={buttonNo} text={button.text} onClick={button.onClick} isEnabled={isEnabled && button.isEnabled} icon={button.icon}/>
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