import React from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ViewScriptScreen from 'viewScript/ViewScriptScreen';

ReactDOM.render(
  <React.StrictMode>
    <ViewScriptScreen />
  </React.StrictMode>,
  document.getElementById('root')
);