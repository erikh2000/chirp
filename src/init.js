import smoothscroll from 'smoothscroll-polyfill';

import { schema } from 'store/chirpSchema';
import { initStore } from 'store/stickyStore';

// Top-level initialization for the app that occurs once before the first render.
export async function init() {
  smoothscroll.polyfill();
  await initStore({schema, appName:'chirp'});  
}