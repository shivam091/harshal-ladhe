// Shape of a license object used by ContentCopyright and the copyright data constants.
export interface CopyrightLicense {
  // Display name shown in the copyright notice, e.g. "CC BY 4.0".
  name: string;
  // Link to the full license text. Omit for proprietary/all-rights-reserved licenses.
  url?: string;
}

/*
  Creative Commons license presets. Each constant can be passed directly as the
  `license` prop on ContentFooter / ContentCopyright, or used as the per-page
  frontmatter value. All CC licenses link to their canonical deed URL.
*/

// Attribution only — most permissive named CC license.
export const CC_BY_4: CopyrightLicense = {
  name: "CC BY 4.0",
  url: "https://creativecommons.org/licenses/by/4.0/"
};

// Attribution + ShareAlike — derivative works must use the same license.
export const CC_BY_SA_4: CopyrightLicense = {
  name: "CC BY-SA 4.0",
  url: "https://creativecommons.org/licenses/by-sa/4.0/"
};

// Attribution + NonCommercial — prohibits commercial use of derivatives.
export const CC_BY_NC_4: CopyrightLicense = {
  name: "CC BY-NC 4.0",
  url: "https://creativecommons.org/licenses/by-nc/4.0/"
};

// Attribution + NonCommercial + ShareAlike — most restrictive named CC license.
export const CC_BY_NC_SA_4: CopyrightLicense = {
  name: "CC BY-NC-SA 4.0",
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
};

// Public domain dedication — waives all copyright and related rights.
export const CC0: CopyrightLicense = {
  name: "CC0 1.0 (Public Domain)",
  url: "https://creativecommons.org/publicdomain/zero/1.0/"
};

// No license granted — all rights retained by the author; no URL needed.
export const ALL_RIGHTS_RESERVED: CopyrightLicense = {
  name: "All Rights Reserved"
};

// Default license applied site-wide unless a page overrides it.
export const defaultLicense = CC_BY_4;
