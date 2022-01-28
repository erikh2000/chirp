import styles from './Parenthetical.module.css';

const Parenthetical = ({isActive, parenthetical}) => {
  if (!parenthetical) return null;

  const style = isActive ? null : styles.inactive;
  
  return(
      <div className={ style }>
        { parenthetical }
      </div>
  );
}

export default Parenthetical;