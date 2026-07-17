// id ties aria-controls on the header's search trigger to this dialog; onClose triggers the closing animation.
export interface SearchProps {
  // Dialog element id — matched by the header's search trigger's aria-controls for a11y.
  id: string;
  // Invoked to dismiss the dialog, e.g. on overlay click, Escape, or the close button.
  onClose: () => void;
}
