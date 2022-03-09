import { isTakeExcluded } from 'script/util/exclusionUtil';

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