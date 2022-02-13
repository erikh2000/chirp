import { ReactComponent as BirdIcon } from 'floatBar/images/bird.svg';
import { ReactComponent as CharacterIcon } from 'floatBar/images/emoticon-happy.svg';
import { ReactComponent as CloseIcon } from 'floatBar/images/window-close.svg';
import { ReactComponent as DownIcon } from 'floatBar/images/arrow-down-bold.svg';
import { ReactComponent as EndReviewIcon } from 'floatBar/images/check-outline.svg';
import { ReactComponent as ExcludeTakeIcon } from 'floatBar/images/movie-open-remove.svg';
import { ReactComponent as ExitIcon } from 'floatBar/images/exit-run.svg';
import { ReactComponent as IncludeTakeIcon } from 'floatBar/images/movie-open-plus.svg';
import { ReactComponent as LeftIcon } from 'floatBar/images/arrow-left-bold.svg';
import { ReactComponent as MicrophoneIcon } from 'floatBar/images/microphone.svg';
import { ReactComponent as PauseIcon } from 'floatBar/images/pause.svg';
import { ReactComponent as PlayIcon } from 'floatBar/images/play.svg';
import { ReactComponent as PlayTakeIcon } from 'floatBar/images/movie-open-play.svg';
import { ReactComponent as RetakeIcon } from 'floatBar/images/arrow-u-right-bottom-bold.svg';
import { ReactComponent as ReviewIcon } from 'floatBar/images/message-draw.svg';
import { ReactComponent as RightIcon } from 'floatBar/images/arrow-right-bold.svg';
import { ReactComponent as ScriptIcon } from 'floatBar/images/script.svg';
import { ReactComponent as StopIcon } from 'floatBar/images/stop.svg';
import styles from './FloatBarIcons.module.css'

const commonProps = {
  className:styles.icon,
  stroke:'white',
  fill:'white',
  alt:''
};

export const Bird = () => <BirdIcon {...commonProps} />;
export const Character = () => <CharacterIcon {...commonProps} />;
export const Close = () => <CloseIcon {...commonProps} />;
export const Down = () => <DownIcon {...commonProps} />;
export const EndReview = () => <EndReviewIcon {...commonProps} />;
export const ExcludeTake = () => <ExcludeTakeIcon {...commonProps} />;
export const Exit = () => <ExitIcon {...commonProps} />;
export const IncludeTake = () => <IncludeTakeIcon {...commonProps} />;
export const Left = () => <LeftIcon {...commonProps} />;
export const Microphone = () => <MicrophoneIcon {...commonProps} />;
export const Pause = () => <PauseIcon {...commonProps} />;
export const Play = () => <PlayIcon {...commonProps} />;
export const PlayTake = () => <PlayTakeIcon {...commonProps} />;
export const Retake = () => <RetakeIcon {...commonProps} />;
export const Review = () => <ReviewIcon {...commonProps} />;
export const Right = () => <RightIcon {...commonProps} />;
export const Script = () => <ScriptIcon {...commonProps} />;
export const Stop = () => <StopIcon {...commonProps} />;