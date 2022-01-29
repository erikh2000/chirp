import FloatBar from 'floatBar/FloatBar';
import Script from 'script/Script';
import Summary from 'script/Summary';
import StartSessionDialog from 'viewScript/StartSessionDialog';
import { Bird } from 'floatBar/FloatBarIcons';

import { isCharacterInScript } from 'script/util/scriptAnalysisUtil';
import { loadScriptFromUrl } from 'script/util/scriptLoader';
import { getQueryVariable } from 'common/util/urlParseUtil';
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
  const [openDialog, setOpenDialog] = useState(null);
  const [script, setScript] = useState(null);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const navigate = useNavigate();
  const store = getStore();

  const buttons = [
    { text:'Start Session', onClick:() => setOpenDialog(StartSessionDialog.name), icon:<Bird /> }
  ];

  function _SetScriptAndCharacter({nextScript, nextCharacter}) {
    if (!nextCharacter || !isCharacterInScript({script:nextScript, character:nextCharacter})) nextCharacter = nextScript.characters.length > 0 ? nextScript.characters[0] : null;
    store.scripts.active = nextScript;
    store.activeCharacter = nextCharacter;
    setScript(nextScript);
    setActiveCharacter(nextCharacter);
  }

  function _onStartSessionContinue() {
    navigate('/recordScript');
  }

  function _onDialogCancel() {
    setOpenDialog(null);
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

  const floatBar = !openDialog ? <FloatBar buttons={buttons} isEnabled={true}/> : null;

  return (
    <React.Fragment>
        <StartSessionDialog isOpen={openDialog===StartSessionDialog.name} onCancel={_onDialogCancel} onContinue={_onStartSessionContinue} />
        <Hidden mdDown>
          <Summary script={script} activeCharacter={activeCharacter} />
        </Hidden>
        <Script script={script} activeCharacter={activeCharacter} isRecording={false}/>
        {floatBar}
    </React.Fragment>
  );
}

export default ViewScriptScreen;
