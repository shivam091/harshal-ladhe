// onCopy fires only after a successful write so parent feedback never celebrates a copy that failed.
export interface CopyButtonProps {
  code: string;
  onCopy: () => void;
}
