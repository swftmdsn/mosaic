import { state } from '../state'
import type { MindmapTemplate, TemplateMenuAnchor, TemplateSource } from '../types'
import { renderIcon } from '../render/icons'
import { escapeAttribute, escapeHtml } from '../utils/html'

export function renderTemplatesMenu(): string {
  const templates = getTemplateMenuItems()

  return `
    <div class="popup-menu templates-menu" role="menu" aria-label="Templates">
      <div class="popup-title">Templates</div>
      <div class="template-create-action">
        <span>Save current structure</span>
        <button class="template-plus" data-action="open-template-save" type="button" role="menuitem" aria-label="Save current structure">+</button>
      </div>
      ${state.templateSaveOpen ? renderTemplateSaveForm() : ''}
      <div class="template-section">
        <span class="template-section-title">All templates</span>
        ${
          templates.length > 0
            ? templates.map(({ template, source }) => renderTemplateRow(template, source)).join('')
            : '<p class="template-empty">No templates yet</p>'
        }
      </div>
    </div>
  `
}

export function isTemplatesMenuOpen(anchor: TemplateMenuAnchor): boolean {
  return state.templateMenuAnchor === anchor
}

export function toggleTemplatesMenu(anchor: TemplateMenuAnchor): void {
  if (state.templateMenuAnchor === anchor) {
    closeTemplatesMenu()
    return
  }

  state.templateMenuAnchor = anchor
  state.templateSaveOpen = false
  state.templateSaveDraft = ''
  state.editingTemplateId = null
  state.editingTemplateSource = null
  state.templateRenameDraft = ''
  state.focusTemplateSaveAfterRender = false
  state.focusTemplateRenameAfterRender = null
}

export function closeTemplatesMenu(): void {
  state.templateMenuAnchor = null
  state.templateSaveOpen = false
  state.templateSaveDraft = ''
  state.editingTemplateId = null
  state.editingTemplateSource = null
  state.templateRenameDraft = ''
  state.focusTemplateSaveAfterRender = false
  state.focusTemplateRenameAfterRender = null
}

export function isTemplateMenuAnchor(value: string | undefined): value is TemplateMenuAnchor {
  return value === 'header' || value === 'starter'
}

function getTemplateMenuItems(): { template: MindmapTemplate; source: TemplateSource }[] {
  return [
    ...state.customTemplates.map((template) => ({ template, source: 'custom' as const })),
    ...state.builtInTemplates.map((template) => ({ template, source: 'builtin' as const })),
  ]
}

function renderTemplateSaveForm(): string {
  return `
    <form class="template-save-form" data-template-save-form>
      <input
        data-template-save-input
        type="text"
        value="${escapeAttribute(state.templateSaveDraft)}"
        placeholder="Template name"
        aria-label="Template name"
      />
      <button data-action="save-template" type="button">Save</button>
      <button data-action="cancel-template-save" type="button" aria-label="Cancel template save">${renderIcon('x')}</button>
    </form>
  `
}

function renderTemplateRow(template: MindmapTemplate, source: TemplateSource): string {
  const isEditing = state.editingTemplateId === template.id && state.editingTemplateSource === source
  const templateId = escapeAttribute(template.id)
  const templateSource = escapeAttribute(source)
  const templateLabel = escapeHtml(template.label)
  const escapedLabel = escapeAttribute(template.label)

  return `
    <div class="template-row ${source}">
      ${
        isEditing
          ? `<div class="template-row-main editing">
              <input
                class="template-rename-input"
                data-template-rename
                data-template-id="${templateId}"
                data-template-source="${templateSource}"
                value="${escapeAttribute(state.templateRenameDraft)}"
                aria-label="Rename ${escapedLabel}"
              />
            </div>`
          : `<button
              class="template-row-main"
              data-action="apply-template"
              data-template-id="${templateId}"
              data-template-source="${templateSource}"
              data-template-target="current"
              type="button"
              role="menuitem"
              aria-label="Use ${escapedLabel} in this tab"
            >
              <span class="template-name">${templateLabel}</span>
            </button>`
      }
      <div class="template-row-actions">
        ${
          isEditing
            ? `<button
                data-action="commit-template-rename"
                data-template-id="${templateId}"
                data-template-source="${templateSource}"
                type="button"
                role="menuitem"
              >Save</button>
              <button
                data-action="cancel-template-rename"
                type="button"
                role="menuitem"
              >Cancel</button>`
            : `<div class="template-use-options" aria-label="Use ${escapedLabel}">
                <span>Use</span>
                <button
                  data-action="apply-template"
                  data-template-id="${templateId}"
                  data-template-source="${templateSource}"
                  data-template-target="current"
                  type="button"
                  role="menuitem"
                >In this tab</button>
                <button
                  data-action="apply-template"
                  data-template-id="${templateId}"
                  data-template-source="${templateSource}"
                  data-template-target="newTab"
                  type="button"
                  role="menuitem"
                >In a new tab</button>
              </div>
              <button
                class="template-rename"
                data-action="start-template-rename"
                data-template-id="${templateId}"
                data-template-source="${templateSource}"
                type="button"
                role="menuitem"
              >Rename</button>
              <button
                class="template-remove"
                data-action="remove-template"
                data-template-id="${templateId}"
                data-template-source="${templateSource}"
                type="button"
                aria-label="Delete ${escapedLabel}"
              >${renderIcon('x')}</button>`
        }
      </div>
    </div>
  `
}
