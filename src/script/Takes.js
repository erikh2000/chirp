import Take from 'script/Take';
import styles from './Takes.module.css';

const Takes = ({
    excludedTakes, 
    onClickTake,
    playingTakeNo,
    selectedTakeNo, 
    takes
  }) => {
  if (!takes) return null;
  
  const takeComponents = takes.map(take => (
    <Take 
      isExcluded={excludedTakes?.includes(take.takeNo)} 
      isPlaying={take.takeNo === playingTakeNo}
      isSelected={take.takeNo === selectedTakeNo} 
      key={take.takeNo} 
      onClick={onClickTake}
      takeNo={take.takeNo} 
    />
  ));
  return(
      <div className={ styles.takes }>
        { takeComponents }
      </div>
  );
}

export default Takes;