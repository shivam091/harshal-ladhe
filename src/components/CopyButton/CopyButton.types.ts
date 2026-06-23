// onCopy fires only after a successful write so parent feedback never celebrates a copy that failed.
export interface CopyButtonProps {
  code: string;
  // Reported with copy_code so the admin can see which languages readers take away; omitted means plain text.
  language?: string;
  onCopy: () => void;
}
