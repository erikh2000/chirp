import styles from './HintArrows.module.css';

import UpArrow from '@mui/icons-material/ArrowUpwardRounded';
import DownArrow from '@mui/icons-material/ArrowDownwardRounded';
import React, { useState, useEffect } from 'react';

const ONSCREEN = 0, UP = 1, DOWN = 2;

function _findLineDirection({selectedLineY, scrollPosition}) {
  const SELECTED_LINE_HEIGHT = 30;
  const viewTopY = scrollPosition;
  const viewBottomY = viewTopY + window.innerHeight;
  if (selectedLineY + SELECTED_LINE_HEIGHT <= viewTopY) return UP;
  if (selectedLineY >= viewBottomY) return DOWN;
  return ONSCREEN;
}

function HintArrows({selectedLineY}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const lineDirection = _findLineDirection({selectedLineY, scrollPosition});
  if (lineDirection === ONSCREEN) return null;

  const upArrow = lineDirection !== UP ? null : <div className={styles.upArrow}><UpArrow /></div>;
  const downArrow = lineDirection !== DOWN ? null : <div className={styles.downArrow}><DownArrow /></div>;

  return (
    <React.Fragment>
      {upArrow}
      {downArrow}
    </React.Fragment>);
}

export default HintArrows;