import fountain from '3rdParty/fountainJs';

import { htmlToPlainTextArray, stripHtml } from 'common/util/htmlFormatUtil';

function _normalizeCharacter({character}) {
  const leftParenthesesI = character.indexOf('('); // Remove "(Cont'd)", "(VO)", and similar qualifiers.
  if (leftParenthesesI === -1) return character.trim();
  return character.substring(0, leftParenthesesI).trim();
}

function _fountainTokensToScript({tokens}) {
  const script = {
    title: '',
    characters: [],
    lines: []
  };

  let lastNormalizedCharacter = null;
  let lastCharacter = null;
  let lastParenthetical = null;
  let lastAction = '';
  let lineNo = 1;
  for(let tokenI = 0; tokenI < tokens.length; ++tokenI) {
    const token = tokens[tokenI];
    switch(token.type) {
      case 'character': 
        lastCharacter = token.text;
        lastNormalizedCharacter = _normalizeCharacter({character:token.text});
        if (!script.characters.includes(lastNormalizedCharacter)) script.characters.push(lastNormalizedCharacter);
        break;

      case 'parenthetical':
        lastParenthetical = stripHtml({html:token.text});
        break;

      case 'action':
        lastAction += stripHtml({html:token.text});
        break;

      case 'dialogue':
        script.lines.push({
          lineNo,
          character:lastCharacter,
          normalizedCharacter:lastNormalizedCharacter,
          parenthetical:lastParenthetical,
          text:stripHtml({html:token.text}),
          action:lastAction
        });
        ++lineNo;
        lastAction = '';
        lastParenthetical = null;
          break;

      case 'title':
        script.title = htmlToPlainTextArray({html:token.text});
        break;

      default:
        break;
    }
  }

  return script;
}

export function loadScriptFromText({text}) {
  let script = {};
  fountain.parse(text, true, (output) => {
    script = _fountainTokensToScript({tokens:output.tokens});
  });
  return script;
}

export async function loadScriptFromUrl({url}) {
  const response = await fetch(url);
  const text = await response.text();
  return loadScriptFromText({ text });
}