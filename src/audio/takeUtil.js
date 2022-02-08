import { findEvents } from 'audio/eventDecoder';
import { EventType } from 'audio/eventTypes';
import { isTakeExcluded } from 'script/util/exclusionUtil';
import Take from './Take';

// Events must be ordered by .sampleNo.
export function generateTakesFromEvents({events}) {
  const takes = [];
  const lineTakeCounts = {};
  let currentTake = null;
  let lastLineNo;

  const _endCurrentTake = ({endSampleNo}) => {
    if (!currentTake) return;
    currentTake.sampleCount = endSampleNo - currentTake.sampleNo;
    if (currentTake.sampleNo < 0) console.error('generateTakesFromEvents() - events are not ordered by .sample!');
    takes.push(currentTake);
    currentTake = null;
  }

  const _startNewTake = ({lineNo, sampleNo}) => {
    lastLineNo = lineNo;
    if (!lineTakeCounts[lineNo]) lineTakeCounts[lineNo] = 0;
    const takeNo = lineTakeCounts[lineNo]++;
    currentTake = new Take({lineNo, takeNo, sampleNo});
  }

  events.forEach(event => {
    switch(event.eventType) {
      case EventType.StartLine:
          const lineNo = event.lineNo;
          _endCurrentTake({endSampleNo:event.sampleNo});
          _startNewTake({lineNo, sampleNo:event.sampleNo});
        break;

      case EventType.EndLine:
        _endCurrentTake({endSampleNo:event.sampleNo});
        break;

      case EventType.RetakeLine:
        const endSampleNo = event.sampleNo;
        _endCurrentTake({endSampleNo});
        _startNewTake({lineNo:lastLineNo, sampleNo:endSampleNo});
        break;

      default:
        console.warn(`Unexpected event type (${ event.eventType }).`);
    }
  });

  return takes;
}

export function generateLineTakeMapFromTakes({takes}) {
  const map = {};
  takes.forEach(take => {
    let line = map[take.lineNo];
    if (!line) {
      line = [];
      map[take.lineNo] = line;
    }
    line.push(take);
  });
  return map;
}

export function generateLineTakeMapFromAudio({audioBuffer}) {
  const events = findEvents({audioBuffer});
  const takes = generateTakesFromEvents({events});
  return generateLineTakeMapFromTakes({takes});
}

export function findCharactersInLineTakeMap({lineTakeMap, script}) {
  const characters = [];
  script.lines.forEach(line => {
    if (lineTakeMap[line.lineNo] && !characters.includes(line.normalizedCharacter)) characters.push(line.normalizedCharacter);
  });
  return characters.sort();
}

export function getTakeFromLineTakeMap({lineTakeMap, lineNo, takeNo}) {
  const takes = lineTakeMap[lineNo];
  if (!takes) return null;
  for(let takeI = 0; takeI < takes.length; ++takeI) {
    if (takes[takeI].takeNo === takeNo) return takes[takeI];
  }
  return null;
}

export function findFirstIncludedTakeNoForLine({lineTakeMap, lineNo, exclusions}) {
  const takes = lineTakeMap[lineNo];
  if (!takes) return null;
  for(let takeI = 0; takeI < takes.length; ++takeI) {
    if (!isTakeExcluded({exclusions, lineNo, takeNo:takes[takeI].takeNo})) return takes[takeI].takeNo;
  }
  return null;
}

export function findLastIncludedTakeNoForLine({lineTakeMap, lineNo, exclusions}) {
  const takes = lineTakeMap[lineNo];
  if (!takes) return null;
  for(let takeI = takes.length - 1; takeI >= 0; --takeI) {
    if (!isTakeExcluded({exclusions, lineNo, takeNo:takes[takeI].takeNo})) return takes[takeI].takeNo;
  }
  return null;
}

export function findNextIncludedTake({lineTakeMap, lineNo, takeNo, exclusions}) {
  const lineNos = Object.keys(lineTakeMap).map(stringValue => parseInt(stringValue, 10)).sort();
  for(let lineI = 0; lineI < lineNos.length; ++lineI) {
    const seekLineNo = lineNos[lineI];
    if (seekLineNo < lineNo) continue;

    const isCurrentLine = seekLineNo === lineNo;
    const takes = lineTakeMap[seekLineNo];
    for(let takeI = 0; takeI < takes.length; ++takeI) {
      const seekTakeNo = takes[takeI].takeNo;
      if (isCurrentLine && seekTakeNo <= takeNo) continue;

      if (!isTakeExcluded({exclusions, lineNo:seekLineNo, takeNo:seekTakeNo})) return takes[takeI];
    }
  }
  return null;
}

export const BEFORE_FIRST_LINE_NO = -1;
export function findFirstIncludedTake({lineTakeMap, exclusions}) {
  return findNextIncludedTake({lineTakeMap, lineNo:BEFORE_FIRST_LINE_NO, takeNo:0, exclusions});
}