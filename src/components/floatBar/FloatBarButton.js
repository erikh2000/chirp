import React from 'react';

import styles from './FloatBarButton.module.css';

function FloatBarButton({isEnabled, text, onClick, icon}) {
  function _delayOnClick() {
    const SHOW_ANIMATION_DELAY = 100;
    window.setTimeout(event => {
      onClick(event);
    }, SHOW_ANIMATION_DELAY);
  }

  return <React.Fragment>
    <button 
      onClick={isEnabled ? _delayOnClick : null} 
      className={isEnabled ? styles.ripple : styles.disabled}
    >{icon}{text}</button>
  </React.Fragment>;
}

export default FloatBarButton;
