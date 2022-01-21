import React from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ViewScriptScreen from 'viewScript/ViewScriptScreen';
import App from 'App';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="viewScript" element={<ViewScriptScreen />} />
      </Routes>
  </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);