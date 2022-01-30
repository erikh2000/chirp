import FloatBar from 'floatBar/FloatBar';
import Script from 'script/Script';
import Summary from 'script/Summary';
import ChangeScriptDialog from 'viewScript/ChangeScriptDialog';
import ChooseCharacterDialog from 'viewScript/ChooseCharacterDialog';
import StartSessionDialog from 'viewScript/StartSessionDialog';
import { Bird, Character, Script as ScriptIcon } from 'floatBar/FloatBarIcons';

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

  const options = [
    { text:'Change Script', onClick:() => setOpenDialog(ChangeScriptDialog.name), icon:<ScriptIcon /> },
    { text:'Change Character', onClick:() => setOpenDialog(ChooseCharacterDialog.name), icon:<Character /> },
    { text:'Start Session', onClick:() => setOpenDialog(StartSessionDialog.name), icon:<Bird /> }
  ];

  function _setScriptAndCharacter({nextScript, nextCharacter}) {
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

  function _onChooseCharacter({character}) {
    setOpenDialog(null);
    store.activeCharacter = character;
    setActiveCharacter(character);
  }

  function _onScriptLoaded({loadedScript}) {
    setOpenDialog(null);
    _setScriptAndCharacter({nextScript:loadedScript, nextCharacter:activeCharacter});
  }

  if (!script) {
    let {url, character:nextCharacter} = _parseQueryString();
    if (!url) {
      const nextScript = store.scripts.active;
      _setScriptAndCharacter({nextScript, nextCharacter});
    } else {
      loadScriptFromUrl({url}).then(nextScript => _setScriptAndCharacter({nextScript, nextCharacter}));
    }
  }

  const floatBar = !openDialog ? <FloatBar options={options} /> : null;

  return (
    <React.Fragment>
        <StartSessionDialog isOpen={openDialog===StartSessionDialog.name} onCancel={_onDialogCancel} onContinue={_onStartSessionContinue} />
        <ChooseCharacterDialog isOpen={openDialog===ChooseCharacterDialog.name} onChooseCharacter={_onChooseCharacter} script={script} />
        <ChangeScriptDialog isOpen={openDialog===ChangeScriptDialog.name} onScriptLoaded={_onScriptLoaded} onCancel={_onDialogCancel} />
        <Hidden mdDown>
          <Summary script={script} activeCharacter={activeCharacter} />
        </Hidden>
        <Script script={script} activeCharacter={activeCharacter} isRecording={false}/>
        {floatBar}
    </React.Fragment>
  );
}

export default ViewScriptScreen;
