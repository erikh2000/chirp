import fountain from '3rdParty/fountainJs';

import { htmlToPlainTextArray } from 'common/util/htmlFormatUtil';

function _fountainTokensToScript({tokens}) {
  const script = {
    title: '',
    characters: [],
    lines: []
  };

  let lastCharacter = null;
  let lastParenthetical = null;
  let lastAction = '';
  let lineNo = 1;
  for(let tokenI = 0; tokenI < tokens.length; ++tokenI) {
    const token = tokens[tokenI];
    switch(token.type) {
      case 'character': 
        lastCharacter = token.text;
        if (!script.characters.includes(lastCharacter)) script.characters.push(lastCharacter);
        break;

      case 'parenthetical':
        lastParenthetical = token.text;
        break;

      case 'action':
        lastAction += token.text;
        break;

      case 'dialogue':
        script.lines.push({
          lineNo,
          character:lastCharacter,
          parenthetical:lastParenthetical,
          text:token.text,
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