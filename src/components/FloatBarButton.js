import React from 'react';
import styles from 'components/FloatBarButton.module.css';

function FloatBarButton({isEnabled, text, onClick}) {
  return <React.Fragment>
    <button 
      onClick={onClick = isEnabled ? onClick : null} 
      className={isEnabled ? styles.ripple : styles.disabled}
    >{text}</button>
  </React.Fragment>;
}

export default FloatBarButton;
