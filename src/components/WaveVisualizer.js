import { MarkerType } from 'audio/markerTypes';

import React from 'react';
import Canvas from './Canvas';

const WaveVisualizer = ({samples, beginSampleNo, endSampleNo, markers, width, height}) => {
  const BG_STYLE = 'rgb(220, 220, 220)';
  const ZERO_LINE_STYLE = 'rgb(200, 200, 200)';
  const BORDER_LINE_STYLE = 'rgb(200, 200, 200)';
  const BORDER_WIDTH = 4;
  const SAMPLE_STYLE = 'rgb(0, 40, 0)';
  const PRIMARY_MARKER_STYLE = 'rgb(160, 80, 80)';
  const SECONDARY_MARKER_STYLE = 'rgb(255, 180, 180)';
  const DESCRIPTION_LEFT_MARGIN = 3, DESCRIPTION_TOP_MARGIN = 10;
  
  const _drawBackground = ({context}) => {
    context.fillStyle = BG_STYLE;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.strokeStyle = ZERO_LINE_STYLE;
    context.beginPath();
    context.moveTo(0, context.canvas.height / 2);
    context.lineTo(context.canvas.width, context.canvas.height / 2);
    context.stroke();
    context.strokeStyle = BORDER_LINE_STYLE;
    context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
  }

  const _drawSamples = ({context, samples, beginSampleNo, endSampleNo}) => {
    const middleY = context.canvas.height / 2;
    const innerHeight = context.canvas.height - (BORDER_WIDTH * 2);
    const innerHeightHalf = innerHeight / 2;
    const innerWidth = context.canvas.width - (BORDER_WIDTH * 2);
    const includedSampleCount = endSampleNo - beginSampleNo;
    context.strokeStyle = SAMPLE_STYLE;
    context.beginPath();
    context.moveTo(BORDER_WIDTH, middleY);
    for(let i = beginSampleNo; i < endSampleNo; ++i) {
      const sample = samples[i];
      const completeRatio = (i - beginSampleNo) / includedSampleCount;
      const x = BORDER_WIDTH + (completeRatio * innerWidth);
      const y = middleY + (-sample * innerHeightHalf);
      context.lineTo(x, y);
    }
    context.stroke();
  }

  const _drawMarkersOfType = ({context, markers, beginSampleNo, endSampleNo, markerType}) => {
    const RANGE_SERIF_HEIGHT = 10;
    const topY = BORDER_WIDTH, bottomY = context.canvas.height - BORDER_WIDTH;
    const innerWidth = context.canvas.width - (BORDER_WIDTH * 2);
    context.strokeStyle = markerType === MarkerType.Primary ? PRIMARY_MARKER_STYLE : SECONDARY_MARKER_STYLE;
    context.font = '15px san-serif';
    context.fillStyle = 'rgb(0,0,0)';
    const includedSampleCount = endSampleNo - beginSampleNo;

    const sampleNoToX = (sampleNo) => BORDER_WIDTH + ((sampleNo - beginSampleNo) / includedSampleCount) * innerWidth;

    markers.forEach(marker => {
      if (marker.markerType === markerType && marker.sampleNo >= beginSampleNo && marker.sampleNo < endSampleNo) { 
        const x = sampleNoToX(marker.sampleNo);
        context.beginPath();
        context.moveTo(x, bottomY);
        context.lineTo(x, topY);
        if (marker.toSampleNo) {
          const rangeEndX = sampleNoToX(marker.toSampleNo);
          context.lineTo(rangeEndX, topY);
          context.lineTo(rangeEndX, topY + RANGE_SERIF_HEIGHT);
        }
        context.stroke();
        if (marker.description) context.fillText(marker.description, x+DESCRIPTION_LEFT_MARGIN, topY+DESCRIPTION_TOP_MARGIN);
      }
    });
    
  }

  const _drawMarkers = ({context, markers, beginSampleNo, endSampleNo, sampleCount}) => {
    _drawMarkersOfType({context, markers, beginSampleNo, endSampleNo, sampleCount, markerType:MarkerType.Secondary});
    _drawMarkersOfType({context, markers, beginSampleNo, endSampleNo, sampleCount, markerType:MarkerType.Primary});
  }

  const _onDraw = ({context}) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    _drawBackground({context});
    if (samples) _drawSamples({context, samples, beginSampleNo, endSampleNo});
    if (markers) _drawMarkers({context, markers, beginSampleNo, endSampleNo});
  }
  
  return <Canvas onDraw={_onDraw} width={width} height={height} />;
}

export default WaveVisualizer;