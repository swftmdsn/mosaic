import { stripMarkdown } from '../../core/mindmap'
import type { CommandToast, DocumentTab, MarkdownLinkPrompt } from '../types'
import { getDisplayFileName } from '../utils/file-names'
import { escapeAttribute, escapeHtml, formatLinkPromptLabel } from '../utils/html'
import { renderIcon } from './icons'

export function renderLinkHint(sourceMarkdown: string | undefined): string {
  return `
    <div class="link-hint">
      <span>Linking from ${escapeHtml(stripMarkdown(sourceMarkdown ?? 'node'))}</span>
      <button data-action="cancel-link" type="button">Cancel</button>
    </div>
  `
}

export function renderCommandToast(commandToast: CommandToast | null, commandToastEnabled: boolean): string {
  if (!commandToast || !commandToastEnabled) {
    return ''
  }

  return `
    <div class="command-toast" role="status" aria-live="polite">
      ${escapeHtml(commandToast.message)}
    </div>
  `
}

export function renderCloseTabDialog(tabs: DocumentTab[], pendingCloseTabId: string | null): string {
  const tab = tabs.find((candidate) => candidate.id === pendingCloseTabId)

  if (!tab) {
    return ''
  }

  const displayName = getDisplayFileName(tab.fileName)

  return `
    <div class="tab-close-backdrop" role="presentation">
      <section class="tab-close-dialog" role="dialog" aria-modal="true" aria-labelledby="close-tab-title">
        <div>
          <h2 id="close-tab-title">Close unsaved tab?</h2>
          <p>${escapeHtml(displayName)} has unsaved changes.</p>
        </div>
        <div class="tab-close-dialog-actions">
          <button class="dialog-secondary" data-action="cancel-close-tab" type="button">Cancel</button>
          <button class="dialog-danger" data-action="confirm-close-tab" data-tab-id="${escapeAttribute(tab.id)}" type="button">
            Close without saving
          </button>
        </div>
      </section>
    </div>
  `
}

export function renderMarkdownLinkPrompt(link: MarkdownLinkPrompt | null): string {
  if (!link) {
    return ''
  }

  return `
    <section
      class="markdown-link-popover"
      role="dialog"
      aria-label="Detected link"
      style="left: ${link.x}px; top: ${link.y}px;"
    >
      <span class="markdown-link-title">Detected link</span>
      <span class="markdown-link-url" title="${escapeAttribute(link.url)}">${escapeHtml(formatLinkPromptLabel(link.label, link.url))}</span>
      <button data-action="open-markdown-link" type="button">Open</button>
      <button class="markdown-link-close" data-action="close-markdown-link" type="button" aria-label="Close link prompt">${renderIcon('x')}</button>
    </section>
  `
}
