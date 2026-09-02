// One line of the live demo's activity log.
export interface LogLine {
  id: number;
  text: string;
  kind: "info" | "success" | "error";
}

// True only when the OPFS entry point actually exists — feature-detected once, checked before every operation below.
export function supportsOPFS(): boolean {
  return typeof navigator !== "undefined" && "storage" in navigator && "getDirectory" in navigator.storage;
}

// Writes `contents` to `filename` at the OPFS root, creating the file if it doesn't exist yet — no IndexedDB transaction, no object store, no schema.
export async function writeOPFSFile(filename: string, contents: string): Promise<void> {
  const root = await navigator.storage.getDirectory();
  const fileHandle = await root.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}

// Reads `filename` back from the OPFS root as text.
export async function readOPFSFile(filename: string): Promise<string> {
  const root = await navigator.storage.getDirectory();
  const fileHandle = await root.getFileHandle(filename);
  const file = await fileHandle.getFile();
  return file.text();
}

// Permanently removes `filename` from the OPFS root.
export async function deleteOPFSFile(filename: string): Promise<void> {
  const root = await navigator.storage.getDirectory();
  await root.removeEntry(filename);
}

// Lists every file currently sitting at the OPFS root — async iteration over the directory handle, same shape as iterating a Map.
export async function listOPFSFiles(): Promise<string[]> {
  const root = await navigator.storage.getDirectory();
  const names: string[] = [];
  for await (const name of root.keys()) {
    names.push(name);
  }
  return names;
}
