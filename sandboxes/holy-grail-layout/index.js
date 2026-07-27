// Parcel (this sandbox's bundler) always runs /index.js as its entry point, regardless of
// whether index.html references it via <script> — so styles.css still needs a JS import to be
// discovered and bundled. This markup itself is fully static, declared directly in index.html;
// this file's only job is to pull the stylesheet in.
import "./styles.css";
