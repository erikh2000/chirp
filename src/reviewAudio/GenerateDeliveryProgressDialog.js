import EventEncoder from "audio/eventEncoder";
import { getIncludedTakesFromLineMap } from "audio/takeUtil";
import ProgressDialog from "floatBar/ProgressDialog";

import { Fragment, useState } from 'react';
import { useEffect } from "react/cjs/react.development";

function _calcPercentage({startPercent, percentRange, valueRange, value}) {
  const valueRatio = value / valueRange;
  return startPercent + percentRange * valueRatio;
}

async function _createAudioBufferForRange({audioBuffer, sampleNo, sampleCount}) {
  return null; // TODO
}

async function _createAudioBufferForTakeMarker({eventEncoder, take, lastLineNo}) {
  const { lineNo } = take;
  if (lineNo === lastLineNo) return eventEncoder.encodeRetakeLine();
  return eventEncoder.encodeStartLine({lineNo});
}

async function _getTakesForDelivery({lineTakeMap, exclusions}) {
  return getIncludedTakesFromLineMap({lineTakeMap, exclusions});
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

async function generateDelivery({audioBuffer, lineTakeMap, eventEncoder, exclusions, setProgressState, cancelState, onCancel}) {
  setProgressState({percent:.1, description:'Enumerating takes...'});

  const takes = await _getTakesForDelivery({lineTakeMap, exclusions});
  if (cancelState.isCanceled) { onCancel(); return; }
  const takeCount = takes.length;
  let lastLineNo = null;
  for(let takeI = 0; takeI < takes.length; ++takeI) {
    setProgressState({
      percent:_calcPercentage({startPercent:.2, percentRange:.48, valueRange:takes.length, value:takeI}), 
      description:`Selecting take ${takeI+1} of ${takeCount}...`
    });
    const take = takes[takeI];
    take.markerAudioBuffer = await _createAudioBufferForTakeMarker({eventEncoder, take, lastLineNo});
    if (cancelState.isCanceled) { onCancel(); return; }
    take.performanceAudioBuffer = await _createAudioBufferForRange({audioBuffer, sampleNo:take.sampleNo, sampleCount:take.sampleCount});
    if (cancelState.isCanceled) { onCancel(); return; }
    lastLineNo = take.lineNo;
  }

  setProgressState({percent: .5, description:'Combining takes into one wave...'});
  // TODO
  if (cancelState.isCanceled) { onCancel(); return; }

  setProgressState({percent: .8, description:'Generating WAV file for download...'});
  // TODO
  if (cancelState.isCanceled) { onCancel(); return; }
  
  setProgressState({percent: 1, description:'Delivery file complete!'});
}

function GenerateDeliveryProgressDialog({audioBuffer, exclusions, lineTakeMap, isOpen, onCancel, onComplete}) {
  const [progressState, setProgressState] = useState({percent:0, description:'Initializing...'});
  const [cancelState] = useState({isCanceled:false});

  useEffect(() => {
    const eventEncoder = new EventEncoder();
    generateDelivery({audioBuffer, lineTakeMap, exclusions, eventEncoder, setProgressState, cancelState, onCancel})
  }, []);

  if (!isOpen) return null;

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