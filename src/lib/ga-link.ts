/*
  For links to other sites, which GA's own outbound click already counts with the link's classes. A fixed class lets
  those clicks be grouped from that one event, rather than sending a second one of the blog's own for each. Apart from
  lib/analytics, which pulls in every entry's data, since the header's client bundle needs these.
*/
export const GA_LINK_CLASS = {
  coreStack: "ga-core-stack",
  articleLink: "ga-article-link",
  social: "ga-social"
} as const;

// Only http(s) links to another host, as GA's outbound click ignores mailto: and links to the site itself.
export function isOutboundLink(href: string, siteHost: string): boolean {
  try {
    const url = new URL(href, `https://${siteHost}`);
    return /^https?:$/.test(url.protocol) && url.hostname !== siteHost;
  } catch {
    return false;
  }
}
