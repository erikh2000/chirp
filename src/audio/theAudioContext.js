let sourceId = 0;

// Reuse one AudioContext instance for browsers like Safari that cap how many instances can be created.
export function theAudioContext() {
  if (!window.__theAudioContext) {
    const AC = window.AudioContext // Default
          || window.webkitAudioContext // Safari and old versions of Chrome
          || null; 
    window.__theAudioContext = new AC();
  }
  // If the AudioContext isn't running that almost certainly means that the browser is waiting for 
  // a user gesture.
  if (window.__theAudioContext.state !== 'running') {
    window.__theAudioContext.resume();
  }

  return window.__theAudioContext.state === 'running' ? window.__theAudioContext : null;
}

export function createOfflineAudioContext(channelCount, sampleCount, sampleRate) {
  const AC = window.OfflineAudioContext // Default
      || window.webkitOfflineAudioContext // Safari and old versions of Chrome
      || null; 
  return new AC(channelCount, sampleCount, sampleRate);
}

export function getSources() {
  const ac = theAudioContext();
  if (!ac) return;
  if (!ac.sources) ac.sources = [];
  return ac.sources;
}

export function attachSource({source}) {
  source.id = ++sourceId;
  const sources = getSources();
  sources?.push(source);
  return sourceId;
}

export function releaseSource({source}) {
  const ac = theAudioContext();
  if (!ac) return;
  if (!ac.sources) ac.sources = [];
  ac.sources = ac.sources.filter(attachedSource => attachedSource !== source);
}

export function clearSources() {
  const ac = theAudioContext();
  if (!ac) return;
  ac.sources = [];
}

export function isAnythingPlaying() {
  const sources = getSources();
  return sources && sources.length;
}