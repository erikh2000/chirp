import styles from './Action.module.css';

const Action = ({action}) => {
  if (!action) return null;
  
  return(
      <div className={ styles.action }>
        { action }
      </div>
  );
}

export default Action;