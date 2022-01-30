import { useScreenWidth, SM, MD, LG, XL } from 'common/util/responsiveLayout';
import React from 'react';

function Hidden({down, mdDown, lgDown, smDown, xlDown, xsUp, smUp, mdUp, lgUp, up, children}) {
  const size = useScreenWidth();
  console.log('MD=' + MD + ' size=' + size);
  const hide = 
    (down && size < down) ||
    (up && size > up) ||
    (smDown && size < SM) ||
    (mdDown && size < MD) ||
    (lgDown && size < LG) ||
    (xlDown && size < XL) ||
    (xsUp && size >= SM) ||
    (smUp && size >= MD) ||
    (mdUp && size >= LG) ||
    (lgUp && size >= XL);
    
  if (hide) return null;

  return <React.Fragment>{children}</React.Fragment>;
}

export default Hidden;