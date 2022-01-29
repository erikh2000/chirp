import React from 'react';

import styles from './FloatBarButton.module.css';

function FloatBarButton({isDisabled, text, onClick, icon}) {
  function _delayOnClick() {
    const SHOW_ANIMATION_DELAY = 100;
    window.setTimeout(event => {
      onClick(event);
    }, SHOW_ANIMATION_DELAY);
  }

  return <React.Fragment>
    <button 
      onClick={isDisabled ? null : _delayOnClick} 
      className={isDisabled ? styles.disabled : styles.ripple}
    >{icon}{text}</button>
  </React.Fragment>;
}

export default FloatBarButton;
