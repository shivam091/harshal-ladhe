// Copies text to the clipboard using the modern async Clipboard API when it's available and permitted, falling back to the legacy execCommand technique otherwise.
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // permission denied, insecure context, or unsupported — fall through to the legacy path below
    }
  }

  return legacyCopy(text);
}

// The pre-Clipboard-API technique: a temporary, off-screen textarea gets selected and copied via the deprecated but still broadly supported execCommand("copy").
function legacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch {
    succeeded = false;
  }

  document.body.removeChild(textarea);
  return succeeded;
}
