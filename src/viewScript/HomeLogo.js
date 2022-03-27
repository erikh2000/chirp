import { ReactComponent as PlundyIcon } from 'viewScript/images/plundy.svg';
import styles from './HomeLogo.module.css';

function HomeLogo() {
  return (
    <div className={styles.container}>
      <PlundyIcon className={styles.icon} fill='red' stroke='red' />
      <div className={styles.logoText}>chirp</div>
      <div className={styles.versionText}>version 1.0</div>
    </div>
  );
}

export default HomeLogo;