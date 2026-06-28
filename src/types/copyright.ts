// Shape of a license object used by ContentCopyright and the copyright data constants.
export interface CopyrightLicense {
  // Display name shown in the copyright notice, e.g. "CC BY 4.0".
  name: string;
  // Link to the full license text. Omit for proprietary/all-rights-reserved licenses.
  url?: string;
}
