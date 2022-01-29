import React from 'react';

import FloatBar from 'components/floatBar/FloatBar';
import styles from './FloatBarDialog.module.css';

function FloatBarDialog({
  buttons,
  descriptionLines,
  image, 
  isOpen,
  title
}) {
  if (!isOpen) return null;

  return <React.Fragment>
    <div className={styles.fullscreenOverlay}>
      <div className={styles.dialog}>
        <h1 className={styles.title}>{title}</h1>
        <img className={styles.image} src={image} alt="" />
        <div className={styles.description}>
          {descriptionLines.map((line, lineI) => (
            <p key={lineI}>{line}</p>
          ))}
        </div>
      </div>
      <FloatBar buttons={buttons} />
    </div>
  </React.Fragment>;
}

export default FloatBarDialog;