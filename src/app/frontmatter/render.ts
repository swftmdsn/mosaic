import { FILE_PROPERTY_TYPES } from '../constants'
import { renderIcon } from '../render/icons'
import { state } from '../state'
import type { FileProperty, FilePropertyType } from '../../core/mindmap'
import type { FrontmatterMode } from '../types'
import { MOSAIC_FILE_EXTENSION } from '../utils/file-names'
import { escapeAttribute, escapeHtml } from '../utils/html'

export function renderFrontmatterEditor(getFrontmatterText: () => string): string {
  if (!state.frontmatterEnabled) {
    return `
      <section class="frontmatter-card empty" aria-label="File properties">
        <button class="frontmatter-add" data-action="enable-frontmatter" type="button" aria-label="Add file properties">
          <span aria-hidden="true">+</span>
          <span class="tooltip-label">Add file properties</span>
        </button>
      </section>
    `
  }

  return `
    <section class="frontmatter-card${state.frontmatterOpen ? ' open' : ''}" aria-label="File properties">
      <div class="frontmatter-header">
        <button class="frontmatter-label" data-action="toggle-frontmatter" type="button" aria-expanded="${String(state.frontmatterOpen)}">
          <span class="chevron${state.frontmatterOpen ? '' : ' collapsed'}" aria-hidden="true"></span>
          <span>File properties</span>
        </button>
        <div class="frontmatter-header-actions">
          <code>${MOSAIC_FILE_EXTENSION}</code>
          <div class="frontmatter-mode-toggle" role="group" aria-label="File properties mode">
            ${renderFrontmatterModeButton('preview', 'Preview')}
            ${renderFrontmatterModeButton('yaml', 'YAML')}
          </div>
        </div>
      </div>
      ${
        state.frontmatterOpen
          ? state.frontmatterMode === 'yaml'
            ? `<textarea
                id="frontmatter-input"
                class="frontmatter-input"
                spellcheck="false"
                rows="8"
                aria-label="File properties YAML"
              >${escapeHtml(getFrontmatterText())}</textarea>`
            : renderFrontmatterPreview()
          : ''
      }
    </section>
  `
}

function renderFrontmatterModeButton(mode: FrontmatterMode, label: string): string {
  const active = state.frontmatterMode === mode

  return `
    <button
      class="frontmatter-mode-button${active ? ' active' : ''}"
      data-action="set-frontmatter-mode"
      data-frontmatter-mode="${mode}"
      type="button"
      aria-pressed="${String(active)}"
    >
      ${escapeHtml(label)}
    </button>
  `
}

function renderFrontmatterPreview(): string {
  const properties = state.document.fileProperties ?? []

  return `
    <div class="frontmatter-preview">
      ${
        properties.length
          ? properties.map((property, index) => renderFilePropertyRow(property, index, properties.length)).join('')
          : '<div class="frontmatter-preview-empty">No file properties</div>'
      }
      <button class="frontmatter-property-add" data-action="add-file-property" type="button">
        <span aria-hidden="true">+</span>
        <span>Add property</span>
      </button>
    </div>
  `
}

function renderFilePropertyRow(property: FileProperty, index: number, count: number): string {
  const key = property.key || 'Untitled'

  return `
    <div class="frontmatter-property type-${property.type}" data-file-property-id="${escapeAttribute(property.id)}">
      <div class="frontmatter-property-order" aria-label="Property order">
        <button
          data-action="move-file-property"
          data-property-id="${escapeAttribute(property.id)}"
          data-direction="-1"
          type="button"
          aria-label="Move ${escapeAttribute(key)} up"
          ${index === 0 ? 'disabled' : ''}
        >${renderIcon('arrowUp')}</button>
        <button
          data-action="move-file-property"
          data-property-id="${escapeAttribute(property.id)}"
          data-direction="1"
          type="button"
          aria-label="Move ${escapeAttribute(key)} down"
          ${index === count - 1 ? 'disabled' : ''}
        >${renderIcon('arrowDown')}</button>
      </div>
      <div class="frontmatter-property-key">
        <span class="frontmatter-type-dot" aria-hidden="true"></span>
        <input
          class="frontmatter-property-key-input"
          data-frontmatter-property-key
          data-property-id="${escapeAttribute(property.id)}"
          value="${escapeAttribute(property.key)}"
          aria-label="Property name"
        />
      </div>
      <div class="frontmatter-property-value">
        ${renderFilePropertyValueControl(property)}
      </div>
      <button
        class="frontmatter-property-remove"
        data-action="remove-file-property"
        data-property-id="${escapeAttribute(property.id)}"
        type="button"
        aria-label="Remove ${escapeAttribute(key)}"
      >
        ${renderIcon('x')}
      </button>
      <div class="frontmatter-property-type">
        <select
          data-frontmatter-property-type
          data-property-id="${escapeAttribute(property.id)}"
          aria-label="${escapeAttribute(key)} type"
        >
          ${renderFilePropertyTypeOptions(property.type)}
        </select>
      </div>
    </div>
  `
}

function renderFilePropertyTypeOptions(activeType: FilePropertyType): string {
  return FILE_PROPERTY_TYPES.map(({ type, label }) => `
    <option value="${type}"${activeType === type ? ' selected' : ''}>${escapeHtml(label)}</option>
  `).join('')
}

function renderFilePropertyValueControl(property: FileProperty): string {
  if (property.type === 'boolean') {
    return `
      <select
        class="frontmatter-property-value-input"
        data-frontmatter-property-value
        data-property-id="${escapeAttribute(property.id)}"
        aria-label="${escapeAttribute(property.key || 'Property')} value"
      >
        <option value="true"${property.value === 'true' ? ' selected' : ''}>True</option>
        <option value="false"${property.value === 'false' ? ' selected' : ''}>False</option>
      </select>
    `
  }

  if (property.type === 'object') {
    return `
      <textarea
        class="frontmatter-property-value-input object"
        data-frontmatter-property-value
        data-property-id="${escapeAttribute(property.id)}"
        rows="2"
        aria-label="${escapeAttribute(property.key || 'Property')} value"
      >${escapeHtml(property.value)}</textarea>
    `
  }

  const inputType =
    property.type === 'number'
      ? 'number'
      : property.type === 'date'
        ? 'date'
        : property.type === 'url'
          ? 'url'
          : 'text'
  const placeholder =
    property.type === 'list'
      ? 'item, item'
      : property.type === 'date'
        ? 'YYYY-MM-DD'
        : ''

  return `
    <input
      class="frontmatter-property-value-input"
      data-frontmatter-property-value
      data-property-id="${escapeAttribute(property.id)}"
      type="${inputType}"
      value="${escapeAttribute(property.value)}"
      placeholder="${escapeAttribute(placeholder)}"
      aria-label="${escapeAttribute(property.key || 'Property')} value"
    />
  `
}
