/*
The module needs to be used in a specific way. 

* Call from just one component being rendered, typically the top-level screen.
* clearLineElements() should be called when component mounts.
* Line components should call onReceiveLineRef() to populate the line elements.
* scrollToLineNo() should be called in a useEffect() hook so that all the line elements are populated from the completed render. Example:

  useEffect(() => { // Needs to happen *after* the render, so I have all the line refs giving me layout info.
    if (scrollLineNo !== null && scrollToLineNo({lineNo:scrollLineNo})) {
      setScrollLineNo(null);
    }
  }, [scrollLineNo]);

*/

let lineElements = {};

export function clearLineElements() {
  lineElements = {};
}

export function getLineY({lineNo}) {
  if (isNaN(lineNo)) return null;
  const lineElement = lineElements[lineNo];
  if (!lineElement) return null;
  return lineElement.offsetTop;
}

export function scrollToLineNo({lineNo}) {
  const lineY = getLineY({lineNo});
  if (lineY === null) return false;
  const positionRatio = .3; // 0% = put top of line at top of screen, 100% = put top of line at bottom of screen. Skew up from center for lines with preceding action to look good.
  const centerYOffset = -(window.innerHeight * positionRatio);
  const top = lineY + centerYOffset;
  window.scrollTo({top, behavior:'smooth'});
  return true;
}

export function onReceiveLineRef({lineNo, element}) {
  lineElements[lineNo] = element;
}