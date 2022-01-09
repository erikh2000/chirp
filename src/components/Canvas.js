import React, { useRef, useEffect } from 'react'

const Canvas = props => {
  
  const { onDraw, isAnimated, width, height, ...rest } = props;
  const canvasRef = useRef(null);
  
  useEffect(() => {
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let frameCount = 0;
    let animationFrameId;
    
    const render = () => {
      frameCount++;
      onDraw({context, frameCount});
      if (isAnimated) animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    
    return () => {
      if (isAnimated) window.cancelAnimationFrame(animationFrameId);
    }
  }, [onDraw, isAnimated]);
  
  return <canvas className='Canvas' width={width} height={height} ref={canvasRef} {...rest}/>;
}

export default Canvas;