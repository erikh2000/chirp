import styles from './Character.module.css';

const Character = ({character, isActive}) => {
  if (!character) return null;

  const style = isActive ? null : styles.inactive;
  
  return(
      <div className={ style }>
        { character.toUpperCase() }
      </div>
  );
}

export default Character;