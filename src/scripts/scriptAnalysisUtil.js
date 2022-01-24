export function countLinesForCharacter({script, character}) {
  let count = 0;
  script.lines.forEach(line => {
    if (line.character === character) ++count;
  });
  return count;
}

export function findNextLineNoForCharacter({script, character, afterLineNo}) {
  for(let lineI = 0; lineI < script.lines.length; ++lineI) {
    const line = script.lines[lineI];
    if (line.character !== character) continue;
    const lineNo = line.lineNo;
    if (lineNo > afterLineNo) return lineNo;
  }
  return -1;
}

export function findFirstLineNoForCharacter({script, character}) {
  return findNextLineNoForCharacter({script, character, afterLineNo:-1});
}

export function isCharacterInScript({script, character}) {
  const characters = script.characters;
  for(let i = 0; i < characters.length; ++i) {
    if (character === characters[i]) return true;
  }
  return false;
}