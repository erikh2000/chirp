// Reuse one AudioContext instance for browsers like Safari that cap how many instances can be created.
export function theAudioContext() {
  if (!window.__theAudioContext) {
    const AC = window.AudioContext // Default
          || window.webkitAudioContext // Safari and old versions of Chrome
          || null; 
    window.__theAudioContext = new AC();
    
    // If the AudioContext isn't running that almost certainly means that the browser is waiting for 
    // a user gesture. Return null in this case to make error more noticable.
    if (window.__theAudioContext.state !== 'running') window.__theAudioContext = null;
  }
  return window.__theAudioContext;
}

export function createOfflineAudioContext(channelCount, sampleCount, sampleRate) {
  const AC = window.OfflineAudioContext // Default
      || window.webkitOfflineAudioContext // Safari and old versions of Chrome
      || null; 
  return new AC(channelCount, sampleCount, sampleRate);
}