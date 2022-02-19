import ProgressBar from 'common/ProgressBar';
import FloatBar from 'floatBar/FloatBar';
import { Close } from 'floatBar/FloatBarIcons';
import styles from './ProgressDialog.module.css';

import { Fragment, useState, useEffect } from 'react';

const DEFAULT_MIN_COMPLETE_DURATION = 2000;
const FRAME_INTERVAL = 1000 / 30;
const NEGLIGIBLE = .0001;
const PRACTICALLY_COMPLETE = 1 - NEGLIGIBLE;

// Putting state here means you can only use one progress dialog on-screen (isOpen set) at a time.
let thePositionPercent = 0;

function isComplete({percent}) {
  return percent >= PRACTICALLY_COMPLETE;
}

function _findTargetPercent({taskStartTime, minimumCompleteDuration, percent}) {
  const elapsed = (Date.now() - taskStartTime);
  if (elapsed < 0) return 0;
  if (isComplete({percent})) return elapsed >= minimumCompleteDuration ? 1 : .99;
  return percent;
}

function _updateTarget({target, positionPercent, setTarget, targetPercent}) {
  if (target != null && Math.abs(target.targetPercent - targetPercent) < NEGLIGIBLE) return; // Target has not changed.
  const nextTarget = {
    startPercent:positionPercent,
    targetPercent:targetPercent,
    startTime:Date.now()
  };
  setTarget(nextTarget);
}

function _calcPositionToTarget({target}) {
  const MOVE_POSITION_DURATION = 500;
  if (target === null) return;
  const elapsedSinceTarget = Date.now() - target.startTime;
  if (elapsedSinceTarget >= MOVE_POSITION_DURATION) {
    return target.targetPercent;
  }
  const completeMoveRatio = elapsedSinceTarget / MOVE_POSITION_DURATION;
  const nextPosition = target.startPercent + (target.targetPercent - target.startPercent) * completeMoveRatio;
  return nextPosition;
}

function _doNothing(event) { event.stopPropagation(); }

function ProgressDialog({
  description, // Short description of what task is currently in progress. Can be used to show subtasks.
  isOpen,
  minimumCompleteDuration = DEFAULT_MIN_COMPLETE_DURATION, // Specified in milliseconds
  onCancel, // Called if user cancels.
  onComplete, // Called after percent set to 1 (100%) and the minimum amount of time has elapsed to animate progress.
  percent // This and all "percent" values are float between 0 and 1.
}) {
  const [frameNo, setFrameNo] = useState(0);
  const [taskStartTime, setTaskStartTime] = useState(null);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    if (onComplete && isComplete({percent:thePositionPercent})) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setFrameNo(frameNo+1), FRAME_INTERVAL);
    return () => clearTimeout(timer);
  }, [frameNo, onComplete]);

  if (!isOpen) {
    thePositionPercent = 0;
    if (taskStartTime !== null) setTaskStartTime(null);
    return null;
  }
  if (taskStartTime === null) {
    thePositionPercent = 0;
    setTaskStartTime(Date.now());
  }

  const options = !onCancel ? null : [{text:'Cancel', onClick:onCancel, icon:<Close /> }];
  const floatBar = !onCancel ? null : <FloatBar options={options} displayTall={true}/>;

  const targetPercent = _findTargetPercent({taskStartTime, minimumCompleteDuration, percent});
  _updateTarget({target, setTarget, targetPercent, positionPercent:thePositionPercent});
  if (target) thePositionPercent = _calcPositionToTarget({target});

  return <Fragment>
    <div className={`${styles.fullscreenOverlay} ${onCancel ? styles.clickable : ''}`} onClick={onCancel}>
      <div className={styles.dialog} onClick={_doNothing}>
        <div className={styles.description}>{description}</div>
        <ProgressBar percentComplete={thePositionPercent} />
      </div>
      {floatBar}
    </div>
  </Fragment>;
}

export default ProgressDialog;