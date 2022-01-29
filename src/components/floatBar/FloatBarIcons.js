import { ReactComponent as BirdIcon } from 'images/icons/bird.svg';
import { ReactComponent as CloseIcon } from 'images/icons/window-close.svg';
import { ReactComponent as DownIcon } from 'images/icons/arrow-down-bold.svg';
import { ReactComponent as ExitIcon } from 'images/icons/exit-run.svg';
import { ReactComponent as MicrophoneIcon } from 'images/icons/microphone.svg';
import { ReactComponent as PauseIcon } from 'images/icons/pause.svg';
import { ReactComponent as RetakeIcon } from 'images/icons/arrow-u-right-bottom-bold.svg';
import styles from './FloatBarIcons.module.css'

const commonProps = {
  className:styles.icon,
  stroke:'white',
  fill:'white',
  alt:'icon'
};

export const Bird = () => <BirdIcon {...commonProps} />;
export const Close = () => <CloseIcon {...commonProps} />;
export const Down = () => <DownIcon {...commonProps} />;
export const Exit = () => <ExitIcon {...commonProps} />;
export const Microphone = () => <MicrophoneIcon {...commonProps} />;
export const Retake = () => <RetakeIcon {...commonProps} />;
export const Pause = () => <PauseIcon {...commonProps} />;