import React from "react";

interface SpacingDivProps {
  height: string
}

function SpacingDiv({height}: SpacingDivProps) {
  return (
    <div className={`${height}`}></div>
  );
}

export default SpacingDiv;
