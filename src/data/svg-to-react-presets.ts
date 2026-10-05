import type { SvgToReactPresetMeta } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

/*
  Original artwork, each wrapped in the particular cruft its editor leaves behind: an Inkscape
  save (sodipodi/inkscape namespaces, RDF metadata, ids on everything, style strings), an
  Illustrator export (prolog, generator comment, a <style> sheet of .st0 classes), a multi-colour
  logo (gradient + mask, so currentColor's "single" mode visibly declines), a sprite-style icon
  built from <symbol> + <use xlink:href>, a design-tool export with a static <title>, and an
  untrusted paste that exercises the sanitiser.
*/
export const svgToReactPresets: SvgToReactPresetMeta[] = [
  {
    slug: "inkscape-bookmark",
    name: "Bookmark",
    origin: "Inkscape save",
    fileName: "bookmark-star.svg",
    source: `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->
<svg
   width="24"
   height="24"
   viewBox="0 0 24 24"
   version="1.1"
   id="svg5"
   inkscape:version="1.3 (0e150ed6c4, 2023-07-21)"
   sodipodi:docname="bookmark-star.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:dc="http://purl.org/dc/elements/1.1/">
  <sodipodi:namedview
     id="namedview7"
     pagecolor="#ffffff"
     bordercolor="#666666"
     inkscape:pageshadow="2"
     inkscape:zoom="22.627417"
     inkscape:cx="11.977"
     inkscape:cy="12.044"
     inkscape:current-layer="layer1" />
  <defs
     id="defs2" />
  <metadata
     id="metadata5">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     id="layer1">
    <path
       style="fill:none;stroke:#1f2937;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"
       d="M 6,3 H 18 A 1,1 0 0 1 19,4 V 21 L 12,17 5,21 V 4 A 1,1 0 0 1 6,3 Z"
       id="path846"
       sodipodi:nodetypes="ccccccccc" />
    <path
       style="fill:#1f2937;stroke:none"
       d="m 12,6.5 1.18,2.4 2.62,0.38 -1.9,1.85 0.45,2.62 L 12,12.5 9.65,13.75 10.1,11.13 8.2,9.28 10.82,8.9 Z"
       id="path848"
       inkscape:connector-curvature="0" />
  </g>
</svg>`
  },
  {
    slug: "illustrator-cloud",
    name: "Cloud Upload",
    origin: "Illustrator export",
    fileName: "cloud_upload.svg",
    source: `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 28.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve" data-name="Layer 1">
<style type="text/css">
	.st0{fill:none;stroke:#0F766E;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
	.st1{fill:#0F766E;}
</style>
<g id="Cloud">
	<path class="st0" d="M7,18H6.5C4,18,2,16,2,13.5S4,9,6.5,9c0.3,0,0.6,0,0.9,0.1C8.3,6.7,10.5,5,13,5c3.3,0,6,2.7,6,6v0.1
		c1.7,0.4,3,2,3,3.9c0,2.2-1.8,4-4,4h-1"/>
	<polyline class="st0" points="9,15 12,12 15,15 	"/>
	<line class="st0" x1="12" y1="12" x2="12" y2="21"/>
	<circle class="st1" cx="12" cy="21" r="0.75"/>
</g>
</svg>`
  },
  {
    slug: "multi-colour-logo",
    name: "Sunleaf Logo",
    origin: "Multi-colour logo",
    fileName: "sunleaf-logo.svg",
    source: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
  <!-- Brand mark: sun behind a leaf -->
  <defs>
    <linearGradient id="sunleaf-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FDE68A"/>
      <stop offset="1" stop-color="#F59E0B"/>
    </linearGradient>
    <mask id="sunleaf-cut">
      <rect width="96" height="96" fill="white"/>
      <circle cx="58" cy="54" r="26" fill="black"/>
    </mask>
  </defs>
  <circle cx="40" cy="40" r="28" fill="url(#sunleaf-sky)" mask="url(#sunleaf-cut)"/>
  <path d="M30 82C30 56 50 36 82 32C80 62 62 82 30 82Z" fill="#16A34A"/>
  <path d="M34 78L70 42" stroke="#14532D" stroke-width="3" stroke-linecap="round"/>
  <circle cx="22" cy="78" r="5" fill="#0EA5E9"/>
</svg>`
  },
  {
    slug: "sprite-use",
    name: "Sparkle Trio",
    origin: "<symbol> + xlink:href",
    fileName: "sparkle-trio.svg",
    source: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" version="1.1">
  <defs>
    <symbol id="sparkle" viewBox="0 0 10 10">
      <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" fill="#7C3AED"/>
    </symbol>
  </defs>
  <use xlink:href="#sparkle" x="1" y="1" width="12" height="12"/>
  <use xlink:href="#sparkle" x="13" y="5" width="8" height="8"/>
  <use xlink:href="#sparkle" x="7" y="15" width="7" height="7"/>
</svg>`
  },
  {
    slug: "design-tool-bell",
    name: "Notification Bell",
    origin: "Design-tool export",
    fileName: "icon_bell-24.svg",
    source: `<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
    <title>icon/bell</title>
    <desc>Created with a design tool.</desc>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
        <g id="icon/bell" sketch:type="MSArtboardGroup" fill="#334155" data-name="bell">
            <path d="M12,2 C8.7,2 6,4.7 6,8 L6,13 L4,16 L4,17 L20,17 L20,16 L18,13 L18,8 C18,4.7 15.3,2 12,2 Z M10,19 C10,20.1 10.9,21 12,21 C13.1,21 14,20.1 14,19 L10,19 Z" id="Shape" sketch:type="MSShapeGroup"></path>
        </g>
    </g>
</svg>`
  },
  {
    slug: "untrusted-paste",
    name: "Untrusted Paste",
    origin: "Sanitiser demo",
    fileName: "shield-check.svg",
    source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onload="alert('svg onload')">
  <script>alert("inline script")</script>
  <a href="javascript:alert('link')">
    <path d="M12 2L4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3z" fill="#2563EB" onclick="alert('click')"/>
  </a>
  <path d="M8.5 12.5l2.5 2.5 5-5" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <foreignObject width="24" height="24"><div xmlns="http://www.w3.org/1999/xhtml">HTML smuggled in</div></foreignObject>
</svg>`
  }
];
