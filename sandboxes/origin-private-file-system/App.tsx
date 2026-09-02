import { useState } from "react";
import { supportsOPFS, writeOPFSFile, readOPFSFile, deleteOPFSFile, listOPFSFiles } from "./opfs";
import type { LogLine } from "./opfs";
import "./styles.css";

const opfsAvailable = supportsOPFS();

export default function App() {
  const [filename, setFilename] = useState("notes.txt");
  const [contents, setContents] = useState("Saved directly to disk — no IndexedDB, no server.");
  const [loaded, setLoaded] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [lines, setLines] = useState<LogLine[]>([]);
  const [nextId, setNextId] = useState(1);

  function emit(text: string, kind: LogLine["kind"]) {
    setLines((prev) => [{ id: nextId, text, kind }, ...prev].slice(0, 6));
    setNextId((id) => id + 1);
  }

  async function refreshFileList() {
    setFiles(await listOPFSFiles());
  }

  async function handleSave() {
    await writeOPFSFile(filename, contents);
    emit(`saved "${filename}" (${contents.length} chars)`, "success");
    await refreshFileList();
  }

  async function handleLoad() {
    try {
      setLoaded(await readOPFSFile(filename));
      emit(`loaded "${filename}"`, "success");
    } catch {
      emit(`"${filename}" doesn't exist yet — save it first`, "error");
    }
  }

  async function handleDelete() {
    try {
      await deleteOPFSFile(filename);
      emit(`deleted "${filename}"`, "success");
      setLoaded(null);
      await refreshFileList();
    } catch {
      emit(`"${filename}" doesn't exist`, "error");
    }
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Writing Files with OPFS</h1>
        <p className="subtitle">Real file reads/writes at the origin-private root — reload the page and the file is still there.</p>

        {!opfsAvailable && <p className="unsupported">The Origin Private File System isn&apos;t available in this environment.</p>}

        <label className="field">
          Filename
          <input value={filename} onChange={(e) => setFilename(e.target.value)} disabled={!opfsAvailable} />
        </label>

        <label className="field">
          Contents
          <textarea value={contents} onChange={(e) => setContents(e.target.value)} rows={3} disabled={!opfsAvailable} />
        </label>

        <div className="button-row">
          <button className="run-btn" onClick={handleSave} disabled={!opfsAvailable}>
            Save
          </button>
          <button className="run-btn" onClick={handleLoad} disabled={!opfsAvailable}>
            Load
          </button>
          <button className="run-btn ghost" onClick={handleDelete} disabled={!opfsAvailable}>
            Delete
          </button>
          <button className="run-btn ghost" onClick={refreshFileList} disabled={!opfsAvailable}>
            List Files
          </button>
        </div>

        {loaded !== null && <p className="loaded-preview">Loaded: &quot;{loaded}&quot;</p>}

        {files.length > 0 && <p className="file-list">Root directory: {files.join(", ")}</p>}

        <ul className="log">
          {lines.map((line) => (
            <li key={line.id} className={`log-line ${line.kind}`}>
              {line.text}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
