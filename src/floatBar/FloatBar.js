import { useState } from 'react';

import { Left, Right } from "floatBar/FloatBarIcons";
import FloatBarButton from 'floatBar/FloatBarButton';
import styles from './FloatBar.module.css';

const MAX_BUTTONS = 5;
const PREV_OPTION = 'Previous';
const NEXT_OPTION = 'Next';

function _findPreviousOptionNo({leftmostOptionNo}) {
  let optionNo = leftmostOptionNo - MAX_BUTTONS + 2;
  return (optionNo <= 1) ? 0 : optionNo;
}

function _findNextOptionNo({leftmostOptionNo, rightmostOptionNo, optionCount}) {
  let optionNo = rightmostOptionNo + 1;
  return (optionNo < optionCount) ? optionNo : leftmostOptionNo;
}

function _createButtonsForOptions({options, leftmostOptionNo, onClick}) {
  const buttons = [], optionCount = options.length;
  let rightmostOptionNo = leftmostOptionNo;
  if (leftmostOptionNo > 0) buttons.push({text:PREV_OPTION, onClick, icon:<Left />});
  for(let i = leftmostOptionNo; i < optionCount && buttons.length < MAX_BUTTONS; ++i) {
    if (buttons.length === MAX_BUTTONS - 1 && i !== options.length - 1) {
      buttons.push({text:NEXT_OPTION, onClick, icon:<Right />});
    } else {
      rightmostOptionNo = i;
      buttons.push({...options[i], optionNo:i})
    }
  }
  let previousOptionNo = _findPreviousOptionNo({leftmostOptionNo});
  let nextOptionNo = _findNextOptionNo({leftmostOptionNo, rightmostOptionNo, optionCount});

  return [buttons, previousOptionNo, nextOptionNo];
}

const FloatBar = ({onChoose, options, isDisabled, displayTall}) => {
  const [leftmostOptionNo, setLeftmostOptionNo] = useState(0);
  const [previousOptionNo, setPreviousOptionNo] = useState(0);
  const [nextOptionNo, setNextOptionNo] = useState(0);

  function _onClick({optionNo, optionText, onClick}) {
    if (optionText === PREV_OPTION) {
      setLeftmostOptionNo(previousOptionNo);
      return;
    }
    if (optionText === NEXT_OPTION) {
      setLeftmostOptionNo(nextOptionNo);
      return;
    }
    if (onChoose) onChoose({optionNo, optionText});
    if (onClick) onClick({optionNo, optionText});
  }

  const [buttons, _previousOptionNo, _nextOptionNo] = _createButtonsForOptions({options, leftmostOptionNo, onClick:_onClick});
  if (_previousOptionNo !== previousOptionNo) setPreviousOptionNo(_previousOptionNo);
  if (_nextOptionNo !== nextOptionNo) setNextOptionNo(_nextOptionNo);

  const buttonElements = buttons.map((button, buttonNo) => {
    return <FloatBarButton 
      key={buttonNo} 
      text={button.text} 
      onClick={() => _onClick({optionNo:button.optionNo, optionText:button.text, onClick:button.onClick})} 
      isDisabled={isDisabled || button.isDisabled} 
      icon={button.icon}
    />
  });
    
  return(
    <div className={displayTall ? styles.floatBarTall : styles.floatBar}>
        {buttonElements}
    </div>
  );
}

export default FloatBar;