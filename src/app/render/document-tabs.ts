import type { DocumentTab } from '../types'
import { getDisplayFileName } from '../utils/file-names'
import { escapeAttribute, escapeHtml } from '../utils/html'
import { renderIcon } from './icons'

export function renderDocumentTabs(tabs: DocumentTab[], activeTabId: string, editingTabId: string | null): string {
  return `
    <nav class="document-tabs" aria-label="Open documents">
      ${tabs
        .map((tab) => {
          const active = tab.id === activeTabId
          const editing = tab.id === editingTabId
          const displayName = getDisplayFileName(tab.fileName)
          const closeButton = `<button class="tab-close" data-action="close-tab" data-tab-id="${escapeAttribute(tab.id)}" type="button" aria-label="Close ${escapeAttribute(displayName)}">
            ${renderIcon('x')}
          </button>`

          return `
            <div class="document-tab-item${active ? ' active' : ''}">
              ${
                editing
                  ? `<input
                      class="document-tab-rename"
                      data-tab-rename
                      data-tab-id="${escapeAttribute(tab.id)}"
                      value="${escapeAttribute(displayName)}"
                      aria-label="Rename ${escapeAttribute(displayName)}"
                    />`
                  : `<button
                      class="document-tab"
                      data-action="select-tab"
                      data-tab-id="${escapeAttribute(tab.id)}"
                      type="button"
                      title="${escapeAttribute(tab.fileName)}"
                      ${active ? 'aria-current="page"' : ''}
                    >
                      <span class="document-tab-title">${escapeHtml(displayName)}</span>
                    </button>`
              }
              ${closeButton}
            </div>
          `
        })
        .join('')}
    </nav>
  `
}
