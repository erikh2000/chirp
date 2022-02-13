import React from 'react';
import ReactDOM from 'react-dom';
import 'the-new-css-reset/css/reset.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { init } from 'init/init';
import AppRoutes from 'init/AppRoutes';

init().then(() => { // If initStore() starts taking a noticable amount of time, create a loading view.
  ReactDOM.render(
    <React.StrictMode>
      <AppRoutes />
    </React.StrictMode>,
    document.getElementById('root')
  );
});