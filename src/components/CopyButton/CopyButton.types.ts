// code is the string written to clipboard; onCopy fires after a successful write so the parent can react.
export interface CopyButtonProps {
  code: string;
  onCopy: () => void;
}
