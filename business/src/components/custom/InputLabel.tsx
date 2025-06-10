import { RequiredRedAsterisk } from "./RequiredAsterisk";

interface InputLabelProps {
  for: string;
  hasAsterisk: boolean;
  text: string;
}

export function InputLabel(payload: InputLabelProps) {
  return (
    <label htmlFor={payload.for} className="w-full text-left text-gray-800 inline-block">
      {payload.text}
      {payload.hasAsterisk && <RequiredRedAsterisk />}
    </label>
  );
}