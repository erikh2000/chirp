import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    marginLeft: 15,
    width: 200,
  },
});

const ZoomSlider = ({value, onValueChange}) => {
  const classes = useStyles();

  const handleValueChange = (event, newValue) => {
    if (onValueChange) onValueChange({value:newValue});
  };
    
  return(
      <div className={classes.root}>
          <Typography gutterBottom>Zoom:</Typography>
          <Slider value={value} onChange={handleValueChange} />
      </div>
  );
}

export default ZoomSlider;