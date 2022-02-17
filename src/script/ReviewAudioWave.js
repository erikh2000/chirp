import { rmsValueForSampleNo, findRmsCeiling } from 'audio/rmsUtil';
import { quantizeToNearestStep } from 'common/util/bucketUtil';
import styles from './ReviewAudioWave.module.css';

import { useEffect, useState } from 'react';
import { sampleCountToTime } from 'audio/sampleUtil';

const UPDATE_NEEDLE_INTERVAL = 1000/30; // 30fps

function _calcWavePolygonPoint({rmsChunks, startSampleNo, sampleCount, sampleRate}) {
  const POINT_COUNT = 200, POINT_INTERVAL = 100 / POINT_COUNT;
  let points = '0,100';

  const rmsCeiling = findRmsCeiling({chunks:rmsChunks});

  let lastPointX = 0, lastPointY = 0;
  for(let pointX = 0; pointX < 100; pointX += POINT_INTERVAL) {
    const barSampleNo = startSampleNo + Math.round(pointX / 100 * sampleCount);
    const rms = rmsValueForSampleNo({sampleNo:barSampleNo, sampleRate, chunks:rmsChunks});
    const value = 100 - (rms / rmsCeiling * 100);
    const pointY = quantizeToNearestStep({value, stepInterval:5});
    if (pointY !== lastPointY) {
      points += ` ${lastPointX},${pointY}`;
    }
    points += ` ${pointX},${pointY}`;
    lastPointX = pointX; 
    lastPointY = pointY;
  }
  points += ` ${lastPointX},100 100,100 0,100`;
  return points;
}

function _calcNeedlePosition({playStartTime, waveDuration}) {
  const elapsedSecs = (Date.now() / 1000) - playStartTime;
  return elapsedSecs / waveDuration * 100;
}

function ReviewAudioWave({rmsChunks, startSampleNo, sampleCount, sampleRate, isPlaying, playStartTime}) {
  const [wavePolygonPoints, setWavePolygonPoints] = useState(null);
  const [lastStartSampleNo, setLastStartSampleNo] = useState(null);
  const [waveDuration, setWaveDuration] = useState(null);
  const [frameNo, setFrameNo] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => setFrameNo(frameNo+1), UPDATE_NEEDLE_INTERVAL);
      return () => clearTimeout(timer);
    }
  }, [frameNo, isPlaying]);

  if (lastStartSampleNo != startSampleNo) {
    setLastStartSampleNo(startSampleNo);
    setWavePolygonPoints(_calcWavePolygonPoint({rmsChunks, startSampleNo, sampleCount, sampleRate}));
    const nextWaveDuration = sampleCountToTime({sampleCount, sampleRate});
    setWaveDuration(nextWaveDuration);
    return null;
  }

  const needlePosition = isPlaying && _calcNeedlePosition({playStartTime, waveDuration});
  const playNeedle = !isPlaying ? null :
    <line x1={needlePosition} y1='0' x2={needlePosition} y2='100' stroke='#DABC6D' strokeWidth='.5' />;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="<http://www.w3.org/2000/svg>" className={styles.container}>
      <polygon points={wavePolygonPoints} fill="#FCDF8F" />
      {playNeedle}
    </svg>
  );
}

export default ReviewAudioWave;