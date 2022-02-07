export function excludeTake({exclusions, lineNo, takeNo}) {
  const matchLineNo = '' + lineNo;
  const nextExclusions = {};
  if (!exclusions[lineNo]) nextExclusions[lineNo] = [takeNo];
  Object.keys(exclusions).forEach(key => {
    const lineExclusions = [...exclusions[key]];
    if (key === matchLineNo && !lineExclusions.includes(takeNo)) lineExclusions.push(takeNo);
    nextExclusions[key] = lineExclusions.sort();
  });
  return nextExclusions;
}

export function includeTake({exclusions, lineNo, takeNo}) {
  const matchLineNo = '' + lineNo;
  const nextExclusions = {};
  Object.keys(exclusions).forEach(key => {
    if (key === matchLineNo) {
      const lineExclusions = exclusions[key].filter(excludeTakeNo => excludeTakeNo !== takeNo);
      if (lineExclusions.length) nextExclusions[key] = lineExclusions;
    } else {
      nextExclusions[key] = [...exclusions[key]];
    }
  });
  return nextExclusions;
}

export function isTakeExcluded({exclusions, lineNo, takeNo}) {
  const lineExclusions = exclusions[lineNo];
  return lineExclusions ? lineExclusions.includes(takeNo) : false;
}