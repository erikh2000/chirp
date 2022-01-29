import { ReactComponent as BirdIcon } from 'floatBar/images/bird.svg';
import { ReactComponent as CloseIcon } from 'floatBar/images/window-close.svg';
import { ReactComponent as DownIcon } from 'floatBar/images/arrow-down-bold.svg';
import { ReactComponent as ExitIcon } from 'floatBar/images/exit-run.svg';
import { ReactComponent as MicrophoneIcon } from 'floatBar/images/microphone.svg';
import { ReactComponent as PauseIcon } from 'floatBar/images/pause.svg';
import { ReactComponent as RetakeIcon } from 'floatBar/images/arrow-u-right-bottom-bold.svg';
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