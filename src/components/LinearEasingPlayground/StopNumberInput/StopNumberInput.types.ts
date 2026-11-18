// Bounds are passed in rather than fixed, since a pinned position is limited by its neighbouring stops.
export interface StopNumberInputProps {
  value: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  // Accessible name, since the visible label text sits outside the input.
  label: string;
  onValueChange: (value: number) => void;
}
