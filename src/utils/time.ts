// Sub-second as "842ms", else "1.3s" — used by PreviewPanel's "Ready in …"/"Updated in …" metrics.
export function formatDuration(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
}
