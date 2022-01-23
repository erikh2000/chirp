import React from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import RecordScriptScreen from 'recordScript/RecordScriptScreen';
import ViewScriptScreen from 'viewScript/ViewScriptScreen';
import App from 'App';
import { schema } from 'store/chirpSchema';
import { initStore } from 'store/stickyStore';

initStore({schema, appName:'chirp'});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="recordScript" element={<RecordScriptScreen />} />
        <Route path="viewScript" element={<ViewScriptScreen />} />
      </Routes>
  </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);