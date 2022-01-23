import FloatBar from 'components/FloatBar';
import Script from 'components/script/Script';
import Summary from 'components/script/Summary';
import { loadScriptFromUrl } from 'scripts/scriptLoader';
import { getQueryVariable } from 'util/urlParseUtil';
import { getStore } from 'store/stickyStore';

import Hidden from '@material-ui/core/Hidden';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function _parseQueryString() {
  return {
    url: '/scripts/' + getQueryVariable({variable:'script'}),
    character: getQueryVariable({variable:'character'})
  };
}

function ViewScriptScreen() {
  const [script, setScript] = useState(null);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const navigate = useNavigate();

  const buttons = [
    { text:'Start Session', onClick:() => navigate('/recordScript') }
  ];

  if (!script) {
    let {url, character:nextCharacter} = _parseQueryString();
    loadScriptFromUrl({url}).then(nextScript => {
      if (!nextCharacter) nextCharacter = nextScript.characters.length > 0 ? nextScript.characters[0] : null;
      const store = getStore();
      store.scripts.active = nextScript;
      store.activeCharacter = nextCharacter;
      setScript(nextScript);
      setActiveCharacter(nextCharacter);
    });
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
