// Kept to a name and optional link so custom licenses can be declared as easily as the presets.
export interface CopyrightLicense {
  // Written the way the license is commonly cited, e.g. "CC BY 4.0", so readers recognise it.
  name: string;
  // Optional because proprietary/all-rights-reserved licenses have no deed to link to.
  url?: string;
}

// Presets so pages pick a license by name instead of retyping names and deed URLs.

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

// No license granted — all rights retained by the author.
export const ALL_RIGHTS_RESERVED: CopyrightLicense = {
  name: "All Rights Reserved"
};

// One site-wide default so pages only declare a license when theirs differs.
export const defaultLicense = CC_BY_4;
