import FloatBar from 'components/FloatBar';
import Script from 'components/script/Script';
import Summary from 'components/script/Summary';
import { loadScriptFromUrl } from 'scripts/scriptLoader';
import { getQueryVariable } from 'util/urlParseUtil';

import Hidden from '@material-ui/core/Hidden';
import { useState } from "react";

const buttons = [
  { text:'Start Session', onClick:_onStartSession }
];

function _onStartSession() {
  
}

function _parseQueryString() {
  return {
    url: '/scripts/' + getQueryVariable({variable:'script'}),
    character: getQueryVariable({variable:'character'})
  };
}

function ViewScriptScreen() {
  const [script, setScript] = useState(null);
  const [activeCharacter, setActiveCharacter] = useState(null);

  if (!script) {
    let {url, character:nextCharacter} = _parseQueryString();
    loadScriptFromUrl({url}).then(nextScript => {
      if (!nextCharacter) nextCharacter = nextScript.characters.length > 0 ? nextScript.characters[0] : null;
      setActiveCharacter(nextCharacter);
      setScript(nextScript);
    });
  }

  return (
    <div className='ViewScriptScreen'>
        <Hidden mdDown>
          <Summary script={script} activeCharacter={activeCharacter} />
        </Hidden>
        <Script script={script} activeCharacter={activeCharacter} />
        <FloatBar buttons={buttons} />
    </div>
  );
}

export default ViewScriptScreen;
