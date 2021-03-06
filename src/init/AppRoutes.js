import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import React from 'react';

import RecordScriptScreen from 'recordScript/RecordScriptScreen';
import ReviewAudioScreen from 'reviewAudio/ReviewAudioScreen';
import ViewScriptScreen from 'viewScript/ViewScriptScreen';
import DebugWaveScreen from "../debugWave/DebugWaveScreen";

function AppRoutes() {
  return (
    <BrowserRouter basename="/chirp">
      <Routes>
        <Route path="recordScript" element={<RecordScriptScreen />} />
        <Route path="reviewAudio" element={<ReviewAudioScreen />} />
        <Route path="viewScript" element={<ViewScriptScreen />} />
        <Route path="debugWave" element={<DebugWaveScreen />} />
        <Route path="*" element={<Navigate to="/viewScript" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;