import React from 'react';

import FloatBar from 'floatBar/FloatBar';
import styles from './FloatBarDialog.module.css';

function FloatBarDialog({
  descriptionLines,
  image, 
  isOpen,
  onChoose,
  options,
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
      <FloatBar options={options} onChoose={onChoose} displayTall={true}/>
    </div>
  </React.Fragment>;
}

export default FloatBarDialog;