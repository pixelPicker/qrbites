interface SpacingDivProps {
  measure:
    | "h-1"
    | "h-2"
    | "h-4"
    | "h-8"
    | "h-12"
    | "h-16"
    | "h-28"
    | "h-32"
    | "w-1"
    | "w-2"
    | "w-4"
    | "w-8"
    | "w-12"
    | "w-16"
    | "w-28"
    | "w-32";
}

function SpacingDiv({ measure }: SpacingDivProps) {
  return <div className={`${measure}`}></div>;
}

export default SpacingDiv;
