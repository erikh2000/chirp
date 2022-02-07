import React from 'react';

import styles from './RippleButton.module.css';

function RippleButton({classes, isSelected, isDisabled, text, onClick, icon}) {
  const style = isDisabled 
    ? styles.disabled 
    : isSelected 
      ? styles.selected
      : styles.ripple;

  return <React.Fragment>
    <button 
      onClick={isDisabled ? null : onClick} 
      className={`${style} ${classes}`}
    >{icon}{text}</button>
  </React.Fragment>;
}

export default RippleButton;
