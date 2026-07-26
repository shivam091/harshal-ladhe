import JSZip from "jszip";

// Shape of useSandpack()'s own `sandpack.files` — just the slice this needs.
type ZippableFiles = Record<string, { code: string }>;

/*
  Zips every current sandbox file (including unsaved edits — callers pass sandpack.files, not the
  original template) and downloads it via a throwaway object URL — shared by DownloadZipButton and
  the command palette's own "Download as .zip" action so both stay in sync.
*/
export async function downloadSandboxZip(files: ZippableFiles, filename = "sandbox.zip"): Promise<void> {
  const zip = new JSZip();
  for (const [path, file] of Object.entries(files)) {
    // JSZip paths are relative — Sandpack's own keys are absolute ("/App.tsx"), so strip the leading slash.
    zip.file(path.replace(/^\//, ""), file.code);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
