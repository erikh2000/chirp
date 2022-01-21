export function countLinesForCharacter({script, character}) {
  let count = 0;
  script.lines.forEach(line => {
    if (line.character === character) ++count;
  });
  return count;
}