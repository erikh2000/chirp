import RippleButton from 'common/RippleButton';
import React from 'react';
import { ReactComponent as ExcludeIcon } from 'floatBar/images/window-close.svg';
import styles from './Take.module.css';

const Take = ({isExcluded, isSelected, takeNo, onClick}) => {

  const _onClick = onClick ? () => onClick({takeNo}) : null;

  const style = isExcluded ? styles.excludedTake : styles.take;
  const icon = isExcluded ? <ExcludeIcon stroke='white' fill='white' /> : null;
  const text = isExcluded ? '' : takeNo;

  return(
      <React.Fragment>
        <RippleButton classes={style} icon={icon} isSelected={isSelected} onClick={_onClick} text={text}/>
      </React.Fragment>
  );
}

export default Take;