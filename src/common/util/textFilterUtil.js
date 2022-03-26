const LOWER_ALPHA = 'abcdefghijklmnopqrstuvwxyz'.split('');
const UPPER_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMERIC = '0123456789'.split('');
const ALPHA = [...LOWER_ALPHA, ...UPPER_ALPHA];
const ALPHANUMERIC = [...ALPHA, ...NUMERIC];

export function textToFiltered({text, safeChars}) {
  const concat = [];
  for(let i = 0; i < text.length; ++i) {
    const c = text[i];
    if (safeChars.indexOf(c) !== -1) concat.push(c);
  }
  return concat.join('');
}

export function textToSafeFilename({text}) {
  const safeChars = [...ALPHANUMERIC, '.', '-'];
  return textToFiltered({text, safeChars});
}