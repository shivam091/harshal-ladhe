import type { SvgOptimiserPresetMeta } from "@/components/SvgOptimiser/SvgOptimiser.types";

/*
  Sample parcels, each packed the way a particular tool packs them: an Inkscape save (namespaced
  cruft, RDF metadata, everything in style strings), an Illustrator export (prolog, doctype,
  generator comment, enable-background, rgb() colours), a Sketch export (nested groups, a
  "Created with Sketch." desc, long-decimal path data), a hand-plotted chart with absurd precision,
  a Figma export with an empty group and a clip-path, and a tampered parcel that exercises the
  preview sanitiser.
*/
export const svgOptimiserPresets: SvgOptimiserPresetMeta[] = [
  {
    slug: "inkscape-parcel",
    name: "Parcel",
    origin: "Inkscape save",
    fileName: "parcel.svg",
    source: `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   width="64"
   height="64"
   viewBox="0 0 64 64"
   version="1.1"
   id="svg8"
   inkscape:version="1.3.2 (091e20e, 2023-11-25)"
   sodipodi:docname="parcel.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:dc="http://purl.org/dc/elements/1.1/">
  <sodipodi:namedview
     id="namedview10"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:zoom="11.3137085"
     inkscape:cx="31.9822"
     inkscape:cy="32.0177"
     inkscape:window-width="1920"
     inkscape:window-height="1016"
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
        <dc:title>Parcel</dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     id="layer1">
    <g
       id="g842">
      <rect
         style="fill:#c8a165;fill-opacity:1;stroke:#5c4425;stroke-width:2.00000000;stroke-linejoin:round;stroke-opacity:1"
         id="rect835"
         width="44.000000"
         height="36.000000"
         x="10.000000"
         y="18.000000" />
      <path
         style="fill:none;stroke:#5c4425;stroke-width:2.00000000;stroke-opacity:1"
         d="M 32.000000,18.000000 L 32.000000,54.000000"
         id="path837" />
      <path
         style="fill:none;stroke:#5c4425;stroke-width:2.00000000;stroke-opacity:1"
         d="M 10.000000,30.000000 L 54.000000,30.000000"
         id="path839" />
      <path
         style="fill:#ffffff;fill-opacity:1;stroke:none"
         d="M 40.500000,36.000000 L 50.500000,36.000000 L 50.500000,46.000000 L 40.500000,46.000000 Z"
         id="path841" />
    </g>
  </g>
</svg>
`
  },
  {
    slug: "illustrator-stamp",
    name: "Postage stamp",
    origin: "Illustrator export",
    fileName: "postage-stamp.svg",
    source: `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 27.5.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="48px" height="48px" viewBox="0 0 48 48" enable-background="new 0 0 48 48" xml:space="preserve">
<g id="Stamp">
	<rect x="6" y="6" fill="rgb(220, 38, 38)" width="36" height="36"/>
	<rect x="10" y="10" fill="#FFFFFF" width="28" height="28"/>
	<g>
		<polygon fill="#DC2626" points="24,13.5 27.09,19.76 34,20.77 29,25.64 30.18,32.52 24,29.27 17.82,32.52 19,25.64 14,20.77
			20.91,19.76 "/>
	</g>
</g>
</svg>
`
  },
  {
    slug: "sketch-tag",
    name: "Luggage tag",
    origin: "Sketch export",
    fileName: "luggage-tag.svg",
    source: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
    <!-- Generator: Sketch 3.8.3 (29802) - http://www.bohemiancoding.com/sketch -->
    <title>icon/tag</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
        <g id="icon/tag" sketch:type="MSArtboardGroup" fill="#000000">
            <g id="Group" transform="translate(2.000000, 2.000000)">
                <path d="M9.17157288,0 L18,0 C19.1045695,0 20,0.8954305 20,2 L20,10.8284271 C20,11.3588602 19.7892863,11.8675677 19.4142136,12.2426407 L11.2426407,20.4142136 C10.4615921,21.1952621 9.19526215,21.1952621 8.41421356,20.4142136 L-0.414213562,11.5857864 C-1.19526215,10.8047379 -1.19526215,9.53840786 -0.414213562,8.75735931 L7.75735931,0.585786438 C8.13243205,0.210713681 8.64113952,0 9.17157288,0 Z M14.5,7 C15.3284271,7 16,6.32842712 16,5.5 C16,4.67157288 15.3284271,4 14.5,4 C13.6715729,4 13,4.67157288 13,5.5 C13,6.32842712 13.6715729,7 14.5,7 Z" id="Shape"></path>
            </g>
        </g>
    </g>
</svg>
`
  },
  {
    slug: "hand-plotted-wave",
    name: "Delivery route",
    origin: "Hand-plotted",
    fileName: "delivery-route.svg",
    source: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120.000 40.000">
  <path fill="none" stroke="#1d4ed8" stroke-width="3.000" stroke-linecap="round" d="M 4.000000 20.000000 C 14.123456 4.987654 24.876543 4.987654 34.999999 20.000000 C 45.123456 35.012346 55.876543 35.012346 65.999999 20.000000 C 76.123456 4.987654 86.876543 4.987654 96.999999 20.000000 L 116.000000 20.000000"/>
  <line x1="4" y1="36.5" x2="116" y2="36.5" stroke="rgb(148,163,184)" stroke-width="1" stroke-dasharray="4.000, 4.000"/>
  <circle cx="4.000000" cy="20.000000" r="3.500000" fill="#1D4ED8"/>
  <circle cx="116.000000" cy="20.000000" r="3.500000" fill="#1D4ED8"/>
</svg>
`
  },
  {
    slug: "figma-tick",
    name: "Signed for",
    origin: "Figma export",
    fileName: "signed-for.svg",
    source: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_12_34)">
<rect width="32" height="32" rx="8" fill="#0F766E"/>
<path d="M8 16L13.5 21.5L24 11" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<g opacity="1">
<g>
</g>
</g>
</g>
<defs>
<clipPath id="clip0_12_34">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>
`
  },
  {
    slug: "tampered-parcel",
    name: "Suspicious parcel",
    origin: "Untrusted paste",
    fileName: "suspicious-parcel.svg",
    source: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 40 40" onload="alert('Signed for!')">
  <script>alert("This parcel has been tampered with");</script>
  <a xlink:href="javascript:alert('Postage due')">
    <circle cx="20" cy="20" r="16" fill="#f59e0b" onclick="alert('Return to sender')"/>
  </a>
  <foreignObject x="0" y="0" width="40" height="40">
    <div xmlns="http://www.w3.org/1999/xhtml">Hidden contents</div>
  </foreignObject>
  <path d="M 12 20 H 28 M 20 12 V 28" stroke="#000000" stroke-width="3"/>
</svg>
`
  }
];
