import styles from './Dialogue.module.css';

const Dialogue = ({isActive, text}) => {
  if (!text) return null;
  const style = isActive ? styles.active : styles.inactive;
  return(
      <div className={ style }>
        { text }
      </div>
  );
}

export default Dialogue;