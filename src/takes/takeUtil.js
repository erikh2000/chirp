import { isTakeExcluded } from 'script/util/exclusionUtil';
import Take from "takes/Take";

export function createTakeCaptureState() {
  return {
    lineTakeMap: {},
    sessionStartTime: Date.now() / 1000,
    openLineNo: null,
    openTakeNo: null,
    isTakeOpen: false
  }; 
}

function _sessionNow({sessionStartTime}) {
  return (Date.now() / 1000) - sessionStartTime;
}

export function closeTake({takeCaptureState}) {
  if (!takeCaptureState.isTakeOpen) return;
  const { openLineNo, openTakeNo, lineTakeMap, sessionStartTime } = takeCaptureState;
  const line = lineTakeMap[openLineNo];
  line.forEach(take => {
    if (take.takeNo === openTakeNo) {
      take.duration = _sessionNow({sessionStartTime}) - take.time;
    }
  });
  takeCaptureState.openLineNo = takeCaptureState.openTakeNo = null;
  takeCaptureState.isTakeOpen = false;
}

export function openTake({takeCaptureState, lineNo}) {
  if (takeCaptureState.isTakeOpen) closeTake({takeCaptureState});

  const { lineTakeMap, sessionStartTime } = takeCaptureState;
  const time = _sessionNow({sessionStartTime});
  let line = lineTakeMap[lineNo];
  if (!line) {
    line = [];
    lineTakeMap[lineNo] = line;
  }
  const takeNo = line.length;
  const take = new Take({lineNo, takeNo, time, duration:null});
  line.push(take);
  takeCaptureState.openLineNo = lineNo;
  takeCaptureState.openTakeNo = takeNo;
  takeCaptureState.isTakeOpen = true;
}


function _getOrderedLineNos({lineTakeMap}) {
  const unorderedLineNos = Object.keys(lineTakeMap).map(lineNoText => parseInt(lineNoText, 10));
  return unorderedLineNos.sort((lineA, lineB) => {
    return lineA === lineB
      ? 0
      : lineA < lineB ? -1 : 1;
  });
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

export function getIncludedTakesFromLineMap({lineTakeMap, exclusions}) {
  const takes = [];
  const lineNos = Object.keys(lineTakeMap);
  lineNos.forEach(lineNo => {
    const lineTakes = lineTakeMap[lineNo];
    lineTakes.forEach(take => {
      if (!isTakeExcluded({exclusions, lineNo, takeNo:take.takeNo})) takes.push(take);
    });
  });
  return takes;
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
  const lineNos = _getOrderedLineNos({lineTakeMap});
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

export function offsetLineTakeMap({lineTakeMap, offset}) {
  const lineNos = Object.keys(lineTakeMap);
  lineNos.forEach(lineNo => {
    const lineTakes = lineTakeMap[lineNo];
    lineTakes.forEach(take => {
      take.time += offset;
    });
  });
}

export function findTakeNearTime({lineTakeMap, time, toleranceTime}) {
  const lineNos = _getOrderedLineNos({lineTakeMap});
  for(let i = 0; i < lineNos.length; ++i) {
    const lineTakes = lineTakeMap[lineNos[i]];
    for(let takeI = 0; takeI < lineTakes.length; ++takeI) {
      const delta = Math.abs(lineTakes[takeI].time - time);
      if (delta <= toleranceTime) return lineTakes[takeI];
    }
  }
  return null;
}

export function getTakesFromLineTakeMap({lineTakeMap}) {
  const takes = [];
  const lineNos = _getOrderedLineNos({lineTakeMap});
  lineNos.forEach(lineNo => {
    const lineTakes = lineTakeMap[lineNo];
    lineTakes.forEach(take => takes.push(take));
  })
  return takes;
}