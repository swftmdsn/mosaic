import { MOSAIC_FILE_EXTENSION } from '../utils/file-names'

export function renderExportMenu(): string {
  return `
    <div class="popup-menu export-menu" role="menu" aria-label="Export">
      <div class="popup-title">Share and export</div>
      <button data-action="copy-full" type="button" role="menuitem">
        <span>Copy full Markdown</span>
        <code>Copy</code>
      </button>
      <button data-action="export-mosaic" type="button" role="menuitem">
        <span>Export Mosaic file</span>
        <code>${MOSAIC_FILE_EXTENSION}</code>
      </button>
      <button data-action="export-readable-markdown" type="button" role="menuitem">
        <span>Export readable Markdown</span>
        <code>.md</code>
      </button>
      <button data-action="export-json" type="button" role="menuitem">
        <span>Export JSON</span>
        <code>.json</code>
      </button>
    </div>
  `
}
