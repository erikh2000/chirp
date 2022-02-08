import RippleButton from 'common/RippleButton';
import React from 'react';
import { ReactComponent as ExcludeIcon } from 'floatBar/images/window-close.svg';
import { ReactComponent as PauseIcon } from 'floatBar/images/pause.svg';
import styles from './Take.module.css';

function _getIconForState({isExcluded, isPlaying}) {
  const commonProps = { 
    fill: 'white',
    stroke: 'white'
  };
  let icon = isPlaying && <PauseIcon {...commonProps} />;
  if (!icon) icon = isExcluded ? <ExcludeIcon {...commonProps} /> : null;
  return icon;
}

const Take = ({isExcluded, isSelected, isPlaying, takeNo, onClick}) => {

  const _onClick = onClick ? () => onClick({takeNo}) : null;

  const style = isExcluded ? styles.excludedTake : styles.take;
  const icon = _getIconForState({isExcluded, isPlaying});
  const text = icon ? '' : takeNo;

  return(
      <React.Fragment>
        <RippleButton classes={style} icon={icon} isSelected={isSelected} onClick={_onClick} text={text}/>
      </React.Fragment>
  );
}

export default Take;