import { useState, useEffect } from 'react';

export const XS = 0, SM = 600, MD = 900, LG = 1200, XL = 1536;

const screenSizes = [XS, SM, MD, LG, XL];

function _findScreenSizeForWidth({width}) {
  for(let i = screenSizes.length - 1; i > 0; --i) {
    if (width >= screenSizes[i]) return screenSizes[i];
  }
  return XS;
}

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState(undefined);
  useEffect(() => {
    function handleResize() {
      setScreenSize(_findScreenSizeForWidth({width:window.innerWidth}));
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return screenSize;
}

export function useScreenWidth() {
  const [screenWidth, setScreenWidth] = useState(undefined);
  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return screenWidth;
}