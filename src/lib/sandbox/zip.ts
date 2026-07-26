import JSZip from "jszip";

// Shape of useSandpack()'s own `sandpack.files` — just the slice this needs.
type ZippableFiles = Record<string, { code: string }>;

// Includes unsaved edits, and is shared so every download path produces the same archive.
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
