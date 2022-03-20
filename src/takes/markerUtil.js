export function getTakeName({take}) {
  return `Line ${take.lineNo} Take ${take.takeNo+1}`;
}

const MSECS_IN_SECOND = 1000;
const MSECS_IN_MINUTE = MSECS_IN_SECOND * 60;
const MSECS_IN_HOUR = MSECS_IN_MINUTE * 60;

export function getTimeParts({time}) {
  let msecs = Math.floor(time * MSECS_IN_SECOND);
  const hours = Math.floor(msecs / MSECS_IN_HOUR);
  msecs -= (hours * MSECS_IN_HOUR);
  const minutes = Math.floor(msecs / MSECS_IN_MINUTE);
  msecs -= (minutes * MSECS_IN_MINUTE);
  const seconds = Math.floor(msecs / MSECS_IN_SECOND);
  msecs -= (seconds * MSECS_IN_SECOND);
  return {hours, minutes, seconds, msecs};
}

function _pad(value, minDigits) {
  value = value.toString();
  while (value.length < minDigits) value = '0' + value;
  return value;
}

export function pad3Digit(value) {
  return _pad(value, 3);
}

export function pad2Digit(value) {
  return _pad(value, 2);
}

export function formatHMSMTime({time}) {
  const {hours, minutes, seconds, msecs} = getTimeParts({time});

  let concat = '';
  if (hours > 0) concat += hours + ':';
  concat += hours ? pad2Digit(minutes) : minutes;
  concat += ':';
  concat += pad2Digit(seconds) + '.';
  concat += pad3Digit(msecs);

  return concat;
}