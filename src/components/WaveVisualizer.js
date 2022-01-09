import React from 'react';
import Canvas from './Canvas';

const WaveVisualizer = ({samples, width, height}) => {
  const BG_STYLE = 'rgb(220, 220, 220)';
  const ZERO_LINE_STYLE = 'rgb(200, 200, 200)';
  const BORDER_LINE_STYLE = 'rgb(200, 200, 200)';
  const BORDER_WIDTH = 4;
  const SAMPLE_STYLE = 'rgb(0, 40, 0)';
  
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

  const _drawSamples = ({context, samples}) => {
    const middleY = context.canvas.height / 2;
    const innerHeight = context.canvas.height - (BORDER_WIDTH * 2);
    const innerHeightHalf = innerHeight / 2;
    const innerWidth = context.canvas.width - (BORDER_WIDTH * 2);
    context.strokeStyle = SAMPLE_STYLE;
    context.beginPath();
    context.moveTo(BORDER_WIDTH, middleY);
    for(let i = 0; i < samples.length; ++i) {
      const sample = samples[i];
      const completeRatio = i / samples.length;
      const x = BORDER_WIDTH + (completeRatio * innerWidth);
      const y = middleY + (sample * innerHeightHalf);
      context.lineTo(x, y);
    }
    context.stroke();
  }

  const onDraw = ({context}) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    _drawBackground({context});
    if (samples) _drawSamples({context, samples});
  }
  
  return <Canvas onDraw={onDraw} width={width} height={height} />;
}

export default WaveVisualizer;