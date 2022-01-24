import FloatBar from 'components/FloatBar';
import Script from 'components/script/Script';
import Summary from 'components/script/Summary';

import { isCharacterInScript } from 'scripts/scriptAnalysisUtil';
import { loadScriptFromUrl } from 'scripts/scriptLoader';
import { getQueryVariable } from 'util/urlParseUtil';
import { getStore } from 'store/stickyStore';

import Hidden from '@material-ui/core/Hidden';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function _parseQueryString() {
  const scriptName = getQueryVariable({variable:'script'});
  const url = scriptName ? '/scripts/' + scriptName : null;
  return {
    url,
    character: getQueryVariable({variable:'character'})
  };
}

function ViewScriptScreen() {
  const [script, setScript] = useState(null);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const navigate = useNavigate();
  const store = getStore();

  const buttons = [
    { text:'Start Session', onClick:() => navigate('/recordScript') }
  ];

  function _SetScriptAndCharacter({nextScript, nextCharacter}) {
    if (!nextCharacter || !isCharacterInScript({script:nextScript, character:nextCharacter})) nextCharacter = nextScript.characters.length > 0 ? nextScript.characters[0] : null;
    store.scripts.active = nextScript;
    store.activeCharacter = nextCharacter;
    setScript(nextScript);
    setActiveCharacter(nextCharacter);
  }

  if (!script) {
    let {url, character:nextCharacter} = _parseQueryString();
    if (!url) {
      const nextScript = store.scripts.active;
      _SetScriptAndCharacter({nextScript, nextCharacter});
    } else {
      loadScriptFromUrl({url}).then(nextScript => _SetScriptAndCharacter({nextScript, nextCharacter}));
    }
  }

  return (
    <React.Fragment>
        <Hidden mdDown>
          <Summary script={script} activeCharacter={activeCharacter} />
        </Hidden>
        <Script script={script} activeCharacter={activeCharacter} />
        <FloatBar buttons={buttons} />
    </React.Fragment>
  );
}

export default ViewScriptScreen;
