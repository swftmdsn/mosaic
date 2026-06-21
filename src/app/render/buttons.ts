import type { IconName } from '../types'
import { escapeAttribute, escapeHtml } from '../utils/html'
import { renderIcon } from './icons'

export function renderIconButton(action: string, label: string, iconName: IconName, variant = ''): string {
  return `
    <button
      class="icon-button${variant ? ` ${variant}` : ''}"
      data-action="${action}"
      type="button"
      aria-label="${escapeAttribute(label)}"
    >
      ${renderIcon(iconName)}
      <span class="tooltip-label">${escapeHtml(label)}</span>
    </button>
  `
}

export function renderToolbarActionButton(action: string, label: string, iconName: IconName, tooltip = label, variant = ''): string {
  return `
    <button
      class="toolbar-action${variant ? ` ${variant}` : ''}"
      data-action="${action}"
      type="button"
      aria-label="${escapeAttribute(label)}"
    >
      ${renderIcon(iconName)}
      <span>${escapeHtml(label)}</span>
      <span class="tooltip-label">${escapeHtml(tooltip)}</span>
    </button>
  `
}
