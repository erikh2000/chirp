// Reuse one AudioContext instance for browsers like Safari that cap how many instances can be created.
export function theAudioContext() {
  if (!window.__theAudioContext) {
    const AC = window.AudioContext // Default
          || window.webkitAudioContext // Safari and old versions of Chrome
          || false; 
    window.__theAudioContext = new AC();
  }
  return window.__theAudioContext;
}