import React from 'react';

import FloatBar from 'floatBar/FloatBar';
import styles from './FloatBarDialog.module.css';

function FloatBarDialog({
  descriptionLines,
  image, 
  isOpen,
  onCancel,
  onChoose,
  options,
  title
}) {
  if (!isOpen) return null;

  function _doNothing(event) { event.stopPropagation(); }

  return <React.Fragment>
    <div className={`${styles.fullscreenOverlay} ${onCancel ? styles.clickable : ''}`} onClick={onCancel}>
      <div className={styles.dialog} onClick={_doNothing}>
        <h1 className={styles.title}>{title}</h1>
        <img className={styles.image} src={image} alt="" />
        <div className={styles.description}>
          {descriptionLines.map((line, lineI) => (
            <p key={lineI}>{line}</p>
          ))}
        </div>
      </div>
      <FloatBar options={options} onChoose={onChoose} displayTall={true}/>
    </div>
  </React.Fragment>;
}

export default FloatBarDialog;