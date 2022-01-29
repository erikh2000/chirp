// To defend against irregularly-formatted HTML, this function checks for nested tags.
export function stripHtml({html}) {
  let stripped = '';
  let insideTagLevel = 0; 
  for(let i = 0; i < html.length; ++i) {
    const char = html.charAt(i);
    if (char === '<') {
      ++insideTagLevel;
    } else if (char === '>') {
      --insideTagLevel;
    } else if (insideTagLevel === 0) {
      stripped += char;
    }
  }
  return stripped;
}

// Coupled to specific expected format of Fountain tokens. But you can generalize it beyond that if you want to.
export function htmlToPlainTextArray({html}) {
  const lines = html.split('<br />'); // This is the part you'd need to generalize, e.g. use a regex to split.
  return lines.map(line => stripHtml({html:line}));
}