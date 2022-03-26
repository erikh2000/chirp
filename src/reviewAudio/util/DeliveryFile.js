import {audioBufferToWaveFile} from "audio/waveFile";
import {lineTakeMapToAudacityLabelCsv} from "takes/audacityLabels";
import {lineTakeMapToAuditionMarkerCsv} from "takes/auditionMarkers";
import {lineTakeMapToReaperMarkerCsv} from "takes/reaperMarkers";

import JSZip from 'jszip';

function _selectionsAudioBufferToBlob({selectionsAudioBuffer}) {
  return audioBufferToWaveFile({audioBuffer:selectionsAudioBuffer});
}

function _lineTakeMapToAuditionMarkersBlob({lineTakeMap, exclusions}) {
  const csv = lineTakeMapToAuditionMarkerCsv({lineTakeMap, exclusions});
  return new Blob([csv], {type: 'text/csv;charset=utf-8'})
}

function _lineTakeMapToReaperMarkersBlob({lineTakeMap, exclusions}) {
  const csv = lineTakeMapToReaperMarkerCsv({lineTakeMap, exclusions});
  return new Blob([csv], {type: 'text/csv;charset=utf-8'})
}

function _lineTakeMapToAudacityLabelsBlob({lineTakeMap, exclusions}) {
  const csv = lineTakeMapToAudacityLabelCsv({lineTakeMap, exclusions});
  return new Blob([csv], {type: 'text/csv;charset=utf-8'})
}

export async function createDeliveryFile({scriptName, selectionsAudioBuffer, lineTakeMap, exclusions}) {
  const zip = new JSZip();
  zip.file(`${scriptName}.wav`, _selectionsAudioBufferToBlob({selectionsAudioBuffer}), {binary: true});
  zip.file('auditionMarkers.csv', _lineTakeMapToAuditionMarkersBlob({lineTakeMap, exclusions}), {binary: true});
  zip.file('reaperMarkers.csv', _lineTakeMapToReaperMarkersBlob({lineTakeMap, exclusions}), {binary: true});
  zip.file('audacityLabels.txt', _lineTakeMapToAudacityLabelsBlob({lineTakeMap, exclusions}), {binary: true});
  return zip.generateAsync({type:'blob'});
}
