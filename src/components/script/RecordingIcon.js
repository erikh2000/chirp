import styles from './RecordingIcon.module.css';

const RecordingIcon = ({isActive}) => {
  if (!isActive) return null;
  
  return(
      <div className={ styles.icon } />
  );
}

export default RecordingIcon;