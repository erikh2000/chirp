import { combineAudioBuffers, createAudioBufferForRange } from "audio/audioBufferUtil";
import { audioBufferToWaveFile } from "audio/waveFile";
import ProgressDialog from "floatBar/ProgressDialog";
import { getIncludedTakesFromLineTakeMap } from "takes/takeUtil";

import FileSaver from 'file-saver';
import { Fragment, useState } from 'react';
import {lineTakeMapToAuditionMarkerCsv} from "../takes/auditionMarkers";
import {lineTakeMapToReaperMarkerCsv} from "../takes/reaperMarkers";
import {lineTakeMapToAudacityLabelCsv} from "../takes/audacityLabels";

function _calcPercentage({startPercent, percentRange, valueRange, value}) {
  const valueRatio = value / valueRange;
  return startPercent + percentRange * valueRatio;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForCancel({cancelState}) {
  await delay(1);
  return cancelState.isCanceled;
}

function _getTakesForDelivery({lineTakeMap, exclusions}) {
  return getIncludedTakesFromLineTakeMap({lineTakeMap, exclusions});
}

function _onCancel({cancelState, progressState, onCancel}) {
  // Signal to generateDelivery() that we are done. It should call onCancel().
  cancelState.isCanceled = true; // Avoiding use of a setter function to allow signalling on the same instance passed to generateDelivery.

  // But in case where generateDelivery() already exited, just call onCancel() here.
  if (progressState.percent === 1) onCancel();
}

function _onComplete({onComplete}) {
  onComplete();
}

function _downloadAudioBufferAsWaveFile({audioBuffer}) {
  const blob = audioBufferToWaveFile({audioBuffer});
  FileSaver.saveAs(blob, 'deliveryFile.wav');
}

function _downloadLineTakeMapAsAuditionMarkers({lineTakeMap, exclusions}) {
  const csv = lineTakeMapToAuditionMarkerCsv({lineTakeMap, exclusions});
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'})
  FileSaver.saveAs(blob, 'auditionMarkers.csv');
}

function _downloadLineTakeMapAsReaperMarkers({lineTakeMap, exclusions}) {
  const csv = lineTakeMapToReaperMarkerCsv({lineTakeMap, exclusions});
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'})
  FileSaver.saveAs(blob, 'reaperMarkers.csv');
}

function _downloadLineTakeMapAsAudacityLabels({lineTakeMap, exclusions}) {
  const csv = lineTakeMapToAudacityLabelCsv({lineTakeMap, exclusions});
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'})
  FileSaver.saveAs(blob, 'audacityLabels.csv');
}

function _combineTakeAudio({takes}) {
  const audioBuffers = [];
  for(let takeI = 0; takeI < takes.length; ++takeI) {
    const take = takes[takeI];
    audioBuffers.push(take.performanceAudioBuffer);
  }
  return combineAudioBuffers({audioBuffers});
}

async function generateDelivery({audioBuffer, lineTakeMap, exclusions, setProgressState, cancelState, onCancel}) {
  try {
    setProgressState({percent:.1, description:'Enumerating takes...'});
    if (await waitForCancel({cancelState})) { onCancel(); return; }
    const takes = _getTakesForDelivery({lineTakeMap, exclusions});

    const takeCount = takes.length;
    let deliveryDuration = 0;
    for(let takeI = 0; takeI < takes.length; ++takeI) {
      setProgressState({
        percent:_calcPercentage({startPercent:.2, percentRange:.48, valueRange:takes.length, value:takeI}), 
        description:`Selecting take ${takeI+1} of ${takeCount}...`
      });
      const take = takes[takeI];
      if (await waitForCancel({cancelState})) { onCancel(); return; }
      take.performanceAudioBuffer = createAudioBufferForRange({audioBuffer, time:take.time, duration:take.duration});
      take.deliveryTime = deliveryDuration;
      deliveryDuration += take.duration;
      if (await waitForCancel({cancelState})) { onCancel(); return; }
    }

    setProgressState({percent: .5, description:'Combining takes into one wave...'});
    if (await waitForCancel({cancelState})) { onCancel(); return; }
    const deliveryAudioBuffer = _combineTakeAudio({takes});

    setProgressState({percent: .8, description:'Generating WAV file for download...'});
    if (await waitForCancel({cancelState})) { onCancel(); return; }
    _downloadAudioBufferAsWaveFile({audioBuffer:deliveryAudioBuffer});

    setProgressState({percent: .95, description:'Generating Audition marker file for download...'});
    if (await waitForCancel({cancelState})) { onCancel(); return; }
    _downloadLineTakeMapAsAuditionMarkers({lineTakeMap, exclusions});

    setProgressState({percent: .97, description:'Generating Reaper marker file for download...'});
    if (await waitForCancel({cancelState})) { onCancel(); return; }
    _downloadLineTakeMapAsReaperMarkers({lineTakeMap, exclusions});

    setProgressState({percent: .99, description:'Generating Audacity label file for download...'});
    if (await waitForCancel({cancelState})) { onCancel(); return; }
    _downloadLineTakeMapAsAudacityLabels({lineTakeMap, exclusions});
    
    setProgressState({percent: 1, description:'Delivery file complete!'});
  } catch(exception) {
    console.error(exception);
    onCancel();
  }
}

let isInitialized; // I tried isInitialized with useState(), but two renders occur before the setter changes the value.
function GenerateDeliveryProgressDialog({audioBuffer, exclusions, lineTakeMap, isOpen, onCancel, onComplete}) {
  const [progressState, setProgressState] = useState({percent:0, description:'Initializing...'});
  const [cancelState] = useState({isCanceled:false});

  if (isOpen) {
    if (!isInitialized) {
      isInitialized = true;
      generateDelivery({audioBuffer, lineTakeMap, exclusions, setProgressState, cancelState, onCancel})
    } 
  } else {
    if (isInitialized) isInitialized = false; // Reset so that next time dialog is opened, init happens again.
    return null;
  }

  return <Fragment>
    <ProgressDialog
      isOpen={true} 
      onCancel={() => _onCancel({cancelState, progressState, onCancel})}
      onComplete={() => _onComplete({onComplete})}
      description={progressState.description}
      percent={progressState.percent}
    />
  </Fragment>;
}

export default GenerateDeliveryProgressDialog;