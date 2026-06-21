import {
  addNodeLink,
  cloneDocument,
  computeMindmapLayout,
  createNewMindmap,
  createSampleMindmap,
  detachNodeAsRoot,
  deleteNode,
  deleteNodes,
  deleteNodesPreservingChildren,
  getDepth,
  getNodeColors,
  getVisibleNodeIds,
  indentNode,
  insertChild,
  insertRootNode,
  insertSiblingAfter,
  moveNode,
  moveNodes,
  moveNodesToOutlinePosition,
  outdentNode,
  parseFilePropertiesYaml,
  parseMindmapJson,
  parseMindmapMarkdown,
  serializeCleanMarkdown,
  serializeFilePropertiesYaml,
  serializeMindmapJson,
  serializeMindmapMarkdown,
  setCollapsedToDepth,
  setDefaultView,
  setNodeLinkColor,
  setNodeLinkArrows,
  setNodeLinkLabel,
  setNodePositions,
  setNodeSubtreeColor,
  setTreeEdgeColor,
  setTreeEdgeArrows,
  setTreeEdgeLabel,
  stripMarkdown,
  toggleNodeCollapsed,
  updateNodeMarkdown,
  type MindmapLayoutNode,
  type MindmapDocument,
  type NodeColor,
  type CanvasItem,
  type CanvasLinkItem,
  type EdgeArrowMode,
  type FileProperty,
  type FilePropertyType,
  type ViewMode,
} from './core/mindmap'
import {
  cssEscape,
  escapeAttribute,
  escapeHtml,
  normalizeLinkUrl,
} from './app/utils/html'
import {
  isHexColorInput,
  normalizeHexColor,
} from './app/utils/color'
import {
  IMAGE_FILE_ACCEPT,
  isImageTransferItem,
  isSupportedImageFile,
  readFileAsDataUrl,
} from './app/utils/images'
import {
  getDisplayFileName,
  getJsonFileName,
  getMosaicFileName,
  getReadableMarkdownFileName,
  isJsonFileName,
  isMarkdownFileName,
  isMosaicFileName,
  MOSAIC_FILE_EXTENSION,
  renameFileNamePreservingExtension,
} from './app/utils/file-names'
import {
  extractMarkdownImages,
  getBulletLineParts,
  getEditableMarkdown,
  getEditableMarkdownFromElement,
  getEditableRawTextFromElement,
  getMarkdownLineRange,
  normalizeEditableMarkdown,
  removeImageMarkdown,
  renderRichMarkdown,
  replaceImageWidth,
  shouldRenderTypedRichMarkdown,
  toggleBulletLines,
  updateNodeTextMarkdown,
} from './app/utils/markdown'
import {
  collapseTextInputSelection,
  getCaretClientRect,
  getEditorSelectionRange,
  hasTextSelectionInside,
  moveEditableCaretToEnd,
} from './app/utils/dom-selection'
import {
  createCanvasLinkPreview,
  extractFirstLinkUrl,
  formatCanvasLinkHost,
  getDroppedLinkUrl,
} from './app/utils/canvas-links'
import { getSettingsSource, isRecord } from './app/utils/guards'
import {
  BUILT_IN_TEMPLATES_STORAGE_KEY,
  CANVAS_IMAGE_DEFAULT_WIDTH,
  CANVAS_IMAGE_MAX_WIDTH,
  CANVAS_IMAGE_MIN_WIDTH,
  CANVAS_LINK_DEFAULT_HEIGHT,
  CANVAS_LINK_DEFAULT_WIDTH,
  CANVAS_LINK_MAX_HEIGHT,
  CANVAS_LINK_MAX_WIDTH,
  CANVAS_LINK_MIN_HEIGHT,
  CANVAS_LINK_MIN_WIDTH,
  CANVAS_LINK_THUMBNAIL_HEIGHT,
  CUSTOM_TEMPLATES_STORAGE_KEY,
  DEFAULT_FRONTMATTER_MODE,
  DEFAULT_SHORTCUTS,
  EDGE_ARROW_MODES,
  EDGE_COLOR_POPOVER_OFFSET_Y,
  EDGE_COLOR_PRESETS,
  IMAGE_WIDTH_MARKS,
  MAP_AREA_SELECTION_THRESHOLD,
  MAP_CLICK_HIT_SLOP,
  MAP_EDGE_CLICK_HIT_SLOP,
  MAP_KEYBOARD_NUDGE,
  MAP_ZOOM_BASE,
  MAP_ZOOM_DISPLAY_STEP,
  OUTLINE_WIDTH_MARKS,
  SHORTCUT_DEFINITIONS,
  SHORTCUT_TOOLTIP_DELAY_MS,
  STARTER_DISMISSED_STORAGE_KEY,
  TRACKPAD_BASE_PAN_SCALE,
  TRACKPAD_BASE_ZOOM_SCALE,
  TRACKPAD_SPEED_DEFAULT,
  TRACKPAD_SPEED_MARKS,
  TRACKPAD_SPEED_MAX,
  TRACKPAD_SPEED_MIN,
} from './app/constants'
import {
  createTemplateNode,
  parseTemplates,
} from './app/templates/model'
import {
  closeTemplatesMenu,
  isTemplateMenuAnchor,
  isTemplatesMenuOpen,
  renderTemplatesMenu,
  toggleTemplatesMenu,
} from './app/templates/menu'
import { createMosaicPackageBlob, parseMosaicFile } from './app/files/mosaic-package'
import { copyToClipboard, downloadBlob, downloadText, writeHandle } from './app/files/browser-io'
import {
  getNormalizedFilePropertyValue,
  isFilePropertyType,
  slugifyFilePropertyKey,
} from './app/frontmatter/model'
import { renderFrontmatterEditor } from './app/frontmatter/render'
import { renderIcon } from './app/render/icons'
import { renderIconButton, renderToolbarActionButton } from './app/render/buttons'
import { formatSpeedValue } from './app/render/range'
import { renderExportMenu } from './app/render/export-menu'
import { renderThemeSelector } from './app/render/theme-menu'
import { renderDocumentTabs } from './app/render/document-tabs'
import { renderSettingsMenu } from './app/render/settings-menu'
import {
  renderCloseTabDialog,
  renderCommandToast,
  renderLinkHint,
  renderMarkdownLinkPrompt,
} from './app/render/overlays'
import { getAppTheme, getThemeNodeColor, getThemeTone, isLightTheme, isThemeMode } from './app/theme'
import {
  formatShortcutLabel,
  getShortcutConflict,
  getShortcutDefinition,
  isShortcutId,
  normalizeKeyboardEvent,
  normalizePointerEvent,
  normalizeShortcutCombo,
} from './app/shortcuts'
import {
  isExportFormat,
  isFrontmatterMode,
  isImagePlacement,
  isSettingsTab,
  snapToMarks,
} from './app/preferences'
import { createTabId, state } from './app/state'
import {
  clampNumber,
  clampZoom,
  getCubicBezierPoint,
  getCurvedEdgeRoute,
  getDefaultMapPan,
  getDisplayZoomPercent,
  getDistanceToEdge,
  getStraightEdgeRoute,
  getViewportRect,
  roundCanvasValue,
} from './app/mindmap/geometry'
import {
  getInheritedTreeEdgeColor,
  getMindNodeBackgroundStyle,
  getOutlineBranchStyle,
  getRelativeDepth,
} from './app/appearance'
import type {
  CommandItem,
  CommandSelection,
  DocumentTab,
  EdgeKind,
  ExportFormat,
  FileFormat,
  FilePickerWindow,
  HistorySnapshot,
  ImagePlacement,
  LocalFileHandle,
  MapEdgeRender,
  MarkdownLinkEditor,
  MindmapTemplate,
  OutlineDropPosition,
  SaveIndicator,
  SettingsExportPayload,
  ShortcutId,
  TemplateApplyTarget,
  TemplateNode,
  TemplateSource,
  ThemeMode,
  ViewportRect,
} from './app/types'
let pendingOutlinerSelection: {
  pointerId: number
  startId: string
  startX: number
  startY: number
  dragging: boolean
} | null = null
let draggedOutlineIds: string[] = []
let suppressNextClick = false
let nextCommandToastId = 1
let commandToastTimer: number | null = null
let edgeColorHistoryKey: string | null = null

let rootElement: HTMLElement | null = null
let autoSaveTimer: number | null = null
let titleCaretFrame: number | null = null
let pendingEscapeDetachNodeId: string | null = null
let hoveredMindNodeId: string | null = null
let shortcutTooltipTimer: number | null = null
let shortcutTooltipElement: HTMLDivElement | null = null
let shortcutTooltipTarget: HTMLElement | null = null

export function initApp(root: HTMLElement): void {
  rootElement = root
  scheduleAutoSave()
  render()
}

function render(): void {
  if (!rootElement) {
    return
  }

  ensureValidFocus()
  ensureValidSelection()
  syncActiveTab()
  if (state.view !== 'mindmap') {
    hoveredMindNodeId = null
  }
  hideShortcutTooltip()
  document.documentElement.dataset.theme = state.theme
  document.documentElement.dataset.themeTone = getThemeTone(state.theme)
  rootElement.innerHTML = renderApp()
  syncShortcutTooltips(rootElement)
  bindEvents(rootElement)
  restoreOutlineScroll()
  flushFocus()
  syncRenderedMapEdges()
}

function captureOutlineScroll(): void {
  const outlinerPage = document.querySelector<HTMLElement>('.outliner-page')

  if (!outlinerPage) {
    return
  }

  state.outlineScroll = {
    top: outlinerPage.scrollTop,
    left: outlinerPage.scrollLeft,
  }
}

function restoreOutlineScroll(): void {
  if (state.view !== 'list') {
    return
  }

  const outlinerPage = document.querySelector<HTMLElement>('.outliner-page')

  if (!outlinerPage) {
    return
  }

  outlinerPage.scrollTop = state.outlineScroll.top
  outlinerPage.scrollLeft = state.outlineScroll.left
}

function getSaveIndicator(): SaveIndicator {
  const location = getFileLocationLabel()

  if (!state.fileHandle) {
    return {
      variant: 'unsaved',
      label: 'Not saved yet',
      detail: state.dirty ? 'This .mosaic file has unsaved changes.' : 'This .mosaic file has no save location yet.',
      location,
      action: 'Click to choose where to save it.',
      canSave: true,
    }
  }

  if (state.dirty) {
    return {
      variant: 'dirty',
      label: 'Unsaved changes',
      detail: 'Changes are waiting to be written.',
      location,
      action: 'Click Save or use the shortcut to write changes.',
      canSave: true,
    }
  }

  return {
    variant: 'saved',
    label: 'Saved',
    detail: 'Saved .mosaic file',
    location,
    action: 'File is up to date.',
    canSave: false,
  }
}

function getFileLocationLabel(): string {
  if (!state.fileHandle) {
    return 'No save location selected'
  }

  const handlePath = state.fileHandle.fullPath?.trim() || state.fileHandle.path?.trim()

  return handlePath || state.fileHandle.name || state.fileName
}

function renderApp(): string {
  const saveIndicator = getSaveIndicator()
  const formatLabel = MOSAIC_FILE_EXTENSION

  return `
    <main class="app-shell">
      <div class="top-toolbar" aria-label="Application toolbar">
        <div class="floating-menu floating-left" aria-label="Create and file actions">
          <div class="brand-pill" tabindex="0" aria-label="Mosaic" aria-describedby="brand-popover">
            <span class="brand-logo-stack" aria-hidden="true">
              <img class="brand-logo brand-logo-light" src="/brand/logo-mosaic-light.svg" alt="" width="18" height="20" />
              <img class="brand-logo brand-logo-dark" src="/brand/logo-mosaic-dark.svg" alt="" width="18" height="20" />
            </span>
            <span class="brand-name" aria-hidden="true">Mosaic</span>
            <span id="brand-popover" class="brand-popover" role="tooltip">
              Mosaic is a local workspace for Markdown mindmaps: write an outline, switch to a node map, and export portable files.
            </span>
          </div>
          <div class="toolbar-divider"></div>
          <div class="toolbar-cluster">
            ${renderIconButton('new-file', 'New mindmap', 'plus')}
            ${renderIconButton('open', 'Open file', 'folder')}
            <div class="menu-anchor template-anchor${isTemplatesMenuOpen('header') ? ' open' : ''}">
              <button
                class="icon-button"
                data-action="toggle-template-menu"
                data-template-anchor="header"
                type="button"
                aria-label="Templates"
                aria-expanded="${String(isTemplatesMenuOpen('header'))}"
              >
                ${renderIcon('bookDashed')}
                <span class="tooltip-label">Templates</span>
              </button>
              ${isTemplatesMenuOpen('header') ? renderTemplatesMenu() : ''}
            </div>
            ${state.focusId ? '<button class="toolbar-button" data-action="clear-focus" type="button">All</button>' : ''}
            <input id="file-input" class="visually-hidden" type="file" accept=".mosaic,.md,.json,text/markdown,application/json" />
            <input id="image-input" class="visually-hidden" type="file" accept="${IMAGE_FILE_ACCEPT}" />
            <input id="canvas-image-input" class="visually-hidden" type="file" accept="${IMAGE_FILE_ACCEPT}" />
            <input id="settings-input" class="visually-hidden" type="file" accept=".json,application/json" />
          </div>
        </div>

        ${renderDocumentTabs(state.tabs, state.activeTabId, state.editingTabId)}

        <div class="floating-menu floating-right" aria-label="View and export actions">
          <div class="segmented" role="group" aria-label="View">
            ${renderViewButton('list', 'Outline')}
            ${renderViewButton('mindmap', 'Map')}
          </div>
          ${renderOutlineControls()}
          ${renderMapControls()}
          <div class="toolbar-divider"></div>
          <div class="toolbar-cluster document-actions">
            ${renderToolbarActionButton(
              'save',
              'Save',
              'save',
              `Save (${formatShortcutLabel(state.shortcuts.save)})`,
              saveIndicator.canSave ? 'primary save-action' : 'save-action',
            )}
            <div class="menu-anchor export-anchor${state.saveMenuOpen ? ' open' : ''}">
              <button class="toolbar-action export-button" data-action="toggle-export-menu" type="button" aria-label="Export" aria-expanded="${String(state.saveMenuOpen)}">
                ${renderIcon('download')}
                <span>Export</span>
              </button>
              ${renderExportMenu()}
            </div>
          </div>
          <div class="toolbar-divider subtle"></div>
          <div class="toolbar-cluster global-actions">
            <button class="icon-button" data-action="command" type="button" aria-label="Command palette">
              ${renderIcon('command')}
              <span class="tooltip-label">Command palette (${escapeHtml(formatShortcutLabel(state.shortcuts.commandPalette))})</span>
            </button>
            ${renderThemeSelector(state.theme, state.themeMenuOpen)}
            <div class="menu-anchor">
              ${renderIconButton('toggle-settings', 'Settings', 'settings')}
              ${state.settingsOpen ? renderSettingsMenu() : ''}
            </div>
          </div>
          <button
            class="file-pill ${saveIndicator.variant}${saveIndicator.canSave ? ' can-save' : ''}"
            data-action="save-status"
            type="button"
            aria-label="${escapeAttribute(`${saveIndicator.label}. ${saveIndicator.action}`)}"
            aria-describedby="file-popover"
            title="${escapeAttribute(saveIndicator.location)}"
          >
            <span class="state-dot-wrap">
              <span class="state-dot ${saveIndicator.variant}" aria-hidden="true"></span>
              <span class="tooltip-label">${escapeHtml(saveIndicator.label)}</span>
            </span>
            <code>${formatLabel}</code>
            <span id="file-popover" class="file-popover" role="tooltip">
              <span class="file-popover-status">${escapeHtml(saveIndicator.detail)}</span>
              <span class="file-popover-path">${escapeHtml(saveIndicator.location)}</span>
              <span class="file-popover-action">${escapeHtml(saveIndicator.action)}</span>
            </span>
          </button>
        </div>
      </div>

      <section class="canvas-stage" aria-label="Active view">
        ${state.view === 'list' ? renderOutliner() : renderMindmap()}
      </section>

      ${state.pendingLinkFrom ? renderLinkHint(state.document.nodes[state.pendingLinkFrom]?.markdown) : ''}
      ${state.activeMarkdownLink ? renderMarkdownLinkPrompt(state.activeMarkdownLink) : ''}
      ${state.pendingCloseTabId ? renderCloseTabDialog(state.tabs, state.pendingCloseTabId) : ''}
      ${state.commandOpen ? renderCommandPalette() : ''}
      ${state.commandToast ? renderCommandToast(state.commandToast, state.commandToastEnabled) : ''}
    </main>
  `
}

function renderMapControls(): string {
  return `
    <div class="toolbar-cluster view-controls map-controls${state.view === 'mindmap' ? '' : ' collapsed'}" aria-hidden="${String(state.view !== 'mindmap')}">
      <div class="zoom-control" aria-label="Zoom">
        <button class="zoom-step" data-action="zoom-out" type="button" aria-label="Zoom out">-</button>
        <button class="zoom-label" data-action="reset-map" type="button" aria-label="Center map">${getDisplayZoomPercent(state.zoom)}%</button>
        <button class="zoom-step" data-action="zoom-in" type="button" aria-label="Zoom in">+</button>
      </div>
    </div>
  `
}

function renderOutlineControls(): string {
  const maxLevel = getOutlineMaxLevel()
  const currentLevel = Math.min(getDeepestVisibleOutlineLevel(), maxLevel)
  const fullyExpanded = isOutlineScopeFullyExpanded()
  const label = fullyExpanded ? 'All' : `L${currentLevel}`
  const depthOptions = Array.from({ length: maxLevel }, (_, index) => index + 1)

  return `
    <div class="toolbar-cluster view-controls outline-controls${state.view === 'list' ? '' : ' collapsed'}" aria-hidden="${String(state.view !== 'list')}">
      <div class="outline-depth-control${state.outlineDepthControlsExpanded ? ' expanded' : ''}" aria-label="Outline level">
        <button
          class="outline-depth-step"
          data-action="outline-depth-down"
          type="button"
          aria-label="Collapse outline one level"
          ${currentLevel <= 1 ? 'disabled' : ''}
        >-</button>
        <div class="outline-depth-menu-anchor">
          <button class="outline-depth-label" data-action="outline-depth-all" type="button" aria-label="Expand all outline levels">${label}</button>
          <div class="outline-depth-menu" role="menu" aria-label="Outline levels">
            <button
              class="outline-depth-menu-item${fullyExpanded ? ' active' : ''}"
              data-action="outline-depth-all"
              type="button"
              role="menuitem"
            >All</button>
            ${depthOptions
              .map((level) => `
                <button
                  class="outline-depth-menu-item${!fullyExpanded && currentLevel === level ? ' active' : ''}"
                  data-action="outline-depth-set"
                  data-level="${level}"
                  type="button"
                  role="menuitem"
                >L${level}</button>
              `)
              .join('')}
          </div>
        </div>
        <button
          class="outline-depth-step"
          data-action="outline-depth-up"
          type="button"
          aria-label="Expand outline one level"
          ${fullyExpanded ? 'disabled' : ''}
        >+</button>
      </div>
    </div>
  `
}

function renderViewButton(view: ViewMode, label: string): string {
  const pressed = state.view === view
  const icon = view === 'list' ? 'list' : 'map'

  return `
    <button
      class="segmented-button${pressed ? ' active' : ''}"
      data-action="set-view"
      data-view="${view}"
      type="button"
      aria-pressed="${String(pressed)}"
      aria-label="${escapeAttribute(label)}"
    >
      ${renderIcon(icon)}
      <span class="tooltip-label">${escapeHtml(label)}</span>
    </button>
  `
}

function renderOutliner(): string {
  const visibleIds = getVisibleNodeIds(state.document, state.focusId)
  const documentTitle = getDocumentTitle()
  const titleClass = `document-title${documentTitle.trim() ? '' : ' empty-title'}`
  const showStarterState = shouldShowStarterEmptyState()

  return `
    <div class="outliner-page" style="--outline-width: ${state.outlineWidth}px">
      ${showStarterState ? renderStarterEmptyState('outline') : ''}
      <div
        id="title-input"
        class="${titleClass}"
        contenteditable="plaintext-only"
        role="textbox"
        aria-label="Mindmap title"
        data-placeholder="Untitled"
        spellcheck="false"
      >${escapeHtml(documentTitle)}</div>
      ${state.focusId ? `<button class="focus-path" data-action="clear-focus" type="button">Focused on ${escapeHtml(stripMarkdown(state.document.nodes[state.focusId]?.markdown ?? 'Untitled'))}</button>` : ''}
      ${renderFrontmatterEditor(getFrontmatterText)}
      <div class="outliner" role="tree" aria-multiselectable="true">
        ${visibleIds.map((id, index) => renderOutlinerRow(id, index + 1)).join('')}
      </div>
      ${renderOutlineAppendButton()}
    </div>
  `
}

function renderOutlineAppendButton(): string {
  return `
    <button
      class="outline-add-line"
      data-action="add-root-outline-line"
      type="button"
    >
      Add a line
    </button>
  `
}

function createFileProperty(key: string): FileProperty {
  return {
    id: createFilePropertyId(key),
    key,
    type: 'text',
    value: '',
  }
}

function createFilePropertyId(key: string): string {
  const base = `property-${slugifyFilePropertyKey(key) || 'field'}`
  let candidate = base
  let suffix = 2
  const properties = state.document.fileProperties ?? []

  while (properties.some((property) => property.id === candidate)) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }

  return candidate
}

function createFilePropertyKey(): string {
  const properties = state.document.fileProperties ?? []
  let candidate = 'property'
  let suffix = 2

  while (properties.some((property) => property.key.trim().toLowerCase() === candidate.toLowerCase())) {
    candidate = `property ${suffix}`
    suffix += 1
  }

  return candidate
}

function updateFileProperty(
  propertyId: string,
  update: (property: FileProperty) => FileProperty,
  shouldRender = false,
): void {
  const properties = state.document.fileProperties ?? []
  const index = properties.findIndex((property) => property.id === propertyId)

  if (index < 0) {
    return
  }

  const nextProperties = properties.map((property, propertyIndex) =>
    propertyIndex === index ? update(property) : property,
  )

  state.document = {
    ...state.document,
    fileProperties: nextProperties,
  }
  state.dirty = true
  state.status = 'File properties updated'

  if (shouldRender) {
    render()
  } else {
    updateDirtyIndicatorInDom()
  }
}

function addFileProperty(): void {
  pushHistory()
  const key = createFilePropertyKey()
  state.document = {
    ...state.document,
    fileProperties: [...(state.document.fileProperties ?? []), createFileProperty(key)],
  }
  state.frontmatterEnabled = true
  state.frontmatterOpen = true
  state.frontmatterMode = 'preview'
  state.dirty = true
  state.status = 'File property added'
  render()
}

function removeFileProperty(propertyId: string): void {
  const properties = state.document.fileProperties ?? []

  if (!properties.some((property) => property.id === propertyId)) {
    return
  }

  pushHistory()
  state.document = {
    ...state.document,
    fileProperties: properties.filter((property) => property.id !== propertyId),
  }
  state.dirty = true
  state.status = 'File property removed'
  render()
}

function moveFileProperty(propertyId: string, direction: -1 | 1): void {
  const properties = [...(state.document.fileProperties ?? [])]
  const index = properties.findIndex((property) => property.id === propertyId)
  const nextIndex = index + direction

  if (index < 0 || nextIndex < 0 || nextIndex >= properties.length) {
    return
  }

  pushHistory()
  const [property] = properties.splice(index, 1)
  properties.splice(nextIndex, 0, property)
  state.document = {
    ...state.document,
    fileProperties: properties,
  }
  state.dirty = true
  state.status = 'File property moved'
  render()
}

function changeFilePropertyType(propertyId: string, type: FilePropertyType): void {
  pushHistory()
  updateFileProperty(
    propertyId,
    (property) => ({
      ...property,
      type,
      value: getNormalizedFilePropertyValue(type, property.value),
    }),
    true,
  )
}

function renderOutlinerRow(id: string, lineNumber: number): string {
  const node = state.document.nodes[id]
  const depth = state.focusId ? getRelativeDepth(id, state.focusId) : getDepth(state.document, id)
  const hasChildren = node.children.length > 0
  const active = state.selectedId === id
  const selected = state.selectedIds.includes(id)
  const hasMedia = extractMarkdownImages(node.markdown).length > 0
  const editableMarkdown = getEditableMarkdown(node.markdown)
  const mediaClass = hasMedia ? ` image-${state.imagePlacement}` : ''
  const inputClass = `node-input${editableMarkdown.trim() ? '' : ' empty-node-input'}`
  const branchStyle = getOutlineBranchStyle(id, depth)
  const rowClass = [
    'outline-row',
    branchStyle.hasTint ? 'branch-tinted' : '',
    mediaClass,
    selected ? 'selected' : '',
    active ? 'active-selected' : '',
  ].filter(Boolean).join(' ')

  return `
    <div
      class="${rowClass}"
      data-node-id="${id}"
      role="treeitem"
      aria-expanded="${hasChildren ? String(!node.collapsed) : 'false'}"
      aria-selected="${String(selected)}"
      style="--depth: ${depth}; --outline-branch-color: ${escapeAttribute(branchStyle.color)}; --outline-title-color: ${escapeAttribute(branchStyle.titleColor)}"
    >
      <button
        class="row-drag-handle"
        data-row-drag
        data-node-id="${id}"
        draggable="true"
        type="button"
        aria-label="Move line"
      >${renderIcon('grip')}</button>
      <button
        class="collapse-button"
        data-action="toggle"
        data-node-id="${id}"
        type="button"
        aria-label="Toggle node"
        ${hasChildren ? '' : 'disabled'}
      >
        <span class="chevron${node.collapsed ? ' collapsed' : ''}" aria-hidden="true"></span>
      </button>
      <button class="bullet-button" data-action="focus-node" data-node-id="${id}" type="button" aria-label="Focus node">
        <span class="line-number">${lineNumber}</span>
      </button>
      ${active ? renderFormatToolbar(id) : ''}
      <div
        class="${inputClass}"
        contenteditable="true"
        data-node-input
        data-node-id="${id}"
        data-markdown="${escapeAttribute(editableMarkdown)}"
        data-placeholder="New line"
        spellcheck="true"
        aria-label="Node Markdown"
      >${renderRichMarkdown(editableMarkdown)}</div>
      ${renderNodeMedia(id)}
      ${renderOutlineActions(id, depth)}
    </div>
  `
}

function renderOutlineActions(id: string, depth: number): string {
  const branchStyle = getOutlineBranchStyle(id, depth)
  const colorPopoverOpen = state.activeEdgeColor?.kind === 'tree' && state.activeEdgeColor.id === id
  const focused = state.focusId === id
  const focusLabel = focused ? 'Clear focus' : 'Focus line and children'

  return `
    <div class="outline-actions" aria-label="Line actions">
      <button class="outline-action" data-action="add-after" data-node-id="${id}" type="button" aria-label="Create sibling">
        ${renderIcon('plus')}
        <span class="tooltip-label">Create sibling</span>
      </button>
      <button class="outline-action" data-action="indent" data-node-id="${id}" type="button" aria-label="Indent line">
        ${renderIcon('indent')}
        <span class="tooltip-label">Indent</span>
      </button>
      ${
        depth > 0
          ? `<button class="outline-action" data-action="outdent" data-node-id="${id}" type="button" aria-label="Outdent line">
              ${renderIcon('outdent')}
              <span class="tooltip-label">Outdent</span>
            </button>`
          : ''
      }
      <button
        class="outline-action${focused ? ' active' : ''}"
        data-action="focus-node"
        data-node-id="${id}"
        type="button"
        aria-label="${focusLabel}"
        aria-pressed="${String(focused)}"
      >
        ${renderIcon(focused ? 'focusOff' : 'focus')}
        <span class="tooltip-label">${focusLabel}</span>
      </button>
      <div class="outline-color-anchor">
        <button
          class="outline-action line-color-action${colorPopoverOpen ? ' active' : ''}"
          data-action="toggle-line-color"
          data-node-id="${id}"
          type="button"
          aria-label="Choose line color"
          aria-expanded="${String(colorPopoverOpen)}"
        >
          <span class="line-color-dot" aria-hidden="true"></span>
          <span class="tooltip-label">Line color</span>
        </button>
        ${colorPopoverOpen ? renderOutlineLineColorPopover(id, branchStyle.color) : ''}
      </div>
      <button class="outline-action danger" data-action="delete" data-node-id="${id}" type="button" aria-label="Delete line">
        ${renderIcon('x')}
        <span class="tooltip-label">Delete</span>
      </button>
    </div>
  `
}

function renderOutlineLineColorPopover(id: string, color: string): string {
  const normalizedColor = normalizeHexColor(color)

  return `
    <div
      class="edge-color-popover outline-line-color-popover"
      role="group"
      aria-label="Line color"
      data-edge-kind="tree"
      data-edge-id="${escapeAttribute(id)}"
    >
      <div class="edge-swatches">
        ${EDGE_COLOR_PRESETS.map(
          (preset) => `
            <button
              class="edge-swatch${preset.toLowerCase() === normalizedColor.toLowerCase() ? ' active' : ''}"
              data-action="set-edge-color"
              data-edge-kind="tree"
              data-edge-id="${escapeAttribute(id)}"
              data-color="${preset}"
              type="button"
              aria-label="Set line color ${preset}"
              style="--swatch: ${preset}"
            ></button>
          `,
        ).join('')}
      </div>
      <label class="edge-custom-color">
        <input
          data-edge-color-input
          data-edge-kind="tree"
          data-edge-id="${escapeAttribute(id)}"
          type="color"
          value="${normalizedColor}"
          aria-label="Custom line color"
        />
        <input
          data-edge-color-hex
          data-edge-kind="tree"
          data-edge-id="${escapeAttribute(id)}"
          type="text"
          value="${normalizedColor}"
          aria-label="Line color hex"
        />
      </label>
    </div>
  `
}

function renderFormatToolbar(id: string): string {
  const linkEditorOpen = state.linkEditor?.nodeId === id
  const showBackgroundControl = state.view === 'mindmap'
  const backgroundPopoverOpen = showBackgroundControl && state.activeNodeBackgroundId === id
  const backgroundStyle = getMindNodeBackgroundStyle(id)

  return `
    <div
      class="format-toolbar"
      data-node-id="${id}"
      style="--node-accent-color: ${escapeAttribute(backgroundStyle.accentColor)}; --node-card-bg: ${escapeAttribute(backgroundStyle.backgroundColor)};"
    >
      <button data-action="format-bold" data-node-id="${id}" type="button" aria-label="Bold">${renderIcon('bold')}</button>
      <button data-action="format-italic" data-node-id="${id}" type="button" aria-label="Italic">${renderIcon('italic')}</button>
      <button data-action="format-underline" data-node-id="${id}" type="button" aria-label="Underline">${renderIcon('underline')}</button>
      <button data-action="format-highlight" data-node-id="${id}" type="button" aria-label="Highlight">${renderIcon('highlighter')}</button>
      <button data-action="format-strike" data-node-id="${id}" type="button" aria-label="Strikethrough">${renderIcon('strike')}</button>
      <button data-action="format-code" data-node-id="${id}" type="button" aria-label="Inline code">${renderIcon('code')}</button>
      <button data-action="format-list" data-node-id="${id}" type="button" aria-label="Bullet list">${renderIcon('list')}</button>
      <button class="${linkEditorOpen ? 'active' : ''}" data-action="format-link" data-node-id="${id}" type="button" aria-label="Add URL link" aria-expanded="${String(linkEditorOpen)}">${renderIcon('link')}</button>
      ${linkEditorOpen ? renderMarkdownLinkEditor(id) : ''}
      <button data-action="upload-image" data-node-id="${id}" type="button" aria-label="Upload image">${renderIcon('image')}</button>
      <button data-action="start-node-link" data-node-id="${id}" type="button" aria-label="Link to another node">${renderIcon('nodeLink')}</button>
      ${showBackgroundControl ? `<div class="node-background-anchor">
        <button
          class="node-background-button${backgroundPopoverOpen ? ' active' : ''}"
          data-action="toggle-node-background"
          data-node-id="${id}"
          type="button"
          aria-label="Node background"
          aria-expanded="${String(backgroundPopoverOpen)}"
        >
          <span class="node-background-dot" aria-hidden="true"></span>
        </button>
        ${backgroundPopoverOpen ? renderNodeBackgroundPopover(id) : ''}
      </div>` : ''}
    </div>
  `
}

function renderNodeBackgroundPopover(id: string): string {
  const node = state.document.nodes[id]
  const activeColor = node?.color ?? 'neutral'

  return `
    <div class="node-background-popover" role="group" aria-label="Node background color">
      ${getNodeColors().map((color) => {
        const swatchColor = getThemeNodeColor(state.theme, color)

        return `
          <button
            class="node-background-swatch${activeColor === color ? ' active' : ''}"
            data-action="set-node-background"
            data-node-id="${escapeAttribute(id)}"
            data-node-color="${color}"
            type="button"
            aria-label="Set ${color} background"
            style="--swatch-color: ${escapeAttribute(swatchColor)}"
          >
            <span></span>
          </button>
        `
      }).join('')}
    </div>
  `
}

function renderMarkdownLinkEditor(id: string): string {
  const escapedId = escapeAttribute(id)

  return `
    <div class="format-link-editor" data-link-editor data-node-id="${escapedId}">
      <input
        class="format-link-input"
        data-link-url-input
        data-node-id="${escapedId}"
        type="url"
        inputmode="url"
        autocomplete="off"
        spellcheck="false"
        placeholder="https://example.com"
        aria-label="Link URL"
      />
      <button class="format-link-submit" data-action="commit-format-link" data-node-id="${escapedId}" type="button" aria-label="Add link">Add</button>
      <button class="format-link-cancel" data-action="cancel-format-link" data-node-id="${escapedId}" type="button" aria-label="Cancel link">${renderIcon('x')}</button>
    </div>
  `
}

function renderNodeMedia(id: string): string {
  const images = extractMarkdownImages(state.document.nodes[id]?.markdown ?? '')

  if (images.length === 0) {
    return ''
  }

  return `
    <div class="node-media image-${state.imagePlacement}">
      ${images
        .map(
          (image, index) => `
            <figure class="node-image">
              <button
                class="tab-close image-remove"
                data-action="remove-image"
                data-node-id="${id}"
                data-image-index="${index}"
                type="button"
                aria-label="Remove image ${index + 1}"
                title="Remove image"
              >
                ${renderIcon('x')}
              </button>
              <img
                src="${escapeAttribute(image.src)}"
                alt="${escapeAttribute(image.alt)}"
                data-node-id="${id}"
                data-image-index="${index}"
                style="width: ${image.width}px"
              />
              ${
                state.selectedId === id
                  ? `<input
                      class="image-width"
                      data-image-width
                      data-node-id="${id}"
                      data-image-index="${index}"
                      type="range"
                      min="120"
                      max="3840"
                      step="10"
                      value="${image.width}"
                      aria-label="Image width"
                    />`
                  : ''
              }
            </figure>
          `,
        )
        .join('')}
    </div>
  `
}

function renderMindmap(): string {
  const layout = computeMindmapLayout(state.document, state.focusId)
  const nodes = [...layout.values()]
  const canvasItemExtents = state.document.canvasItems.map((item) => ({
    x: item.x + item.width + 360,
    y: item.y + getCanvasItemEstimatedHeight(item) + 260,
  }))
  const width = Math.max(900, ...nodes.map((node) => node.x + node.width + 360), ...canvasItemExtents.map((item) => item.x))
  const height = Math.max(620, ...nodes.map((node) => node.y + node.height + 260), ...canvasItemExtents.map((item) => item.y))
  const stats = getDocumentStats()

  return `
    <div class="mindmap-canvas" data-canvas data-layout="${state.document.layout}" style="--map-nodes: ${stats.visible}">
      <div
        class="map-layer"
        data-map-layer
        style="width: ${width}px; height: ${height}px; transform: translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom});"
      >
        <svg class="map-edges" width="${width}" height="${height}" aria-hidden="true">
          ${renderMapEdges(layout)}
        </svg>
        ${renderEdgeControls(layout)}
        ${nodes.map((node) => renderMindNode(node.id, node.x, node.y, nodes.length)).join('')}
        ${renderCanvasItems()}
      </div>
      ${isMindmapCanvasEmpty() ? renderEmptyMindmapPrompt() : ''}
      ${shouldShowStarterEmptyState() ? renderStarterEmptyState('map') : ''}
      ${renderActiveEdgeColorPopover(layout)}
    </div>
  `
}

function shouldShowStarterEmptyState(): boolean {
  return !state.starterDismissed && isStarterDocument()
}

function isStarterDocument(): boolean {
  const nodeIds = Object.keys(state.document.nodes)
  const rootId = state.document.rootId ?? state.document.rootIds[0]
  const root = rootId ? state.document.nodes[rootId] : null

  return Boolean(
    root
    && nodeIds.length === 1
    && state.document.rootIds.length === 1
    && root.parentId === null
    && root.children.length === 0
    && getEditableMarkdown(root.markdown).trim().length === 0
    && state.document.title.trim().length === 0
    && state.document.canvasItems.length === 0
    && state.document.links.length === 0,
  )
}

function isMindmapCanvasEmpty(): boolean {
  return Object.keys(state.document.nodes).length === 0
    && state.document.canvasItems.length === 0
    && state.document.links.length === 0
}

function renderEmptyMindmapPrompt(): string {
  return '<p class="empty-mindmap-prompt">Double click to add a central node</p>'
}

function renderStarterEmptyState(placement: 'outline' | 'map'): string {
  return `
    <section class="starter-empty-state ${placement}" aria-label="Start a mindmap">
      <button class="starter-dismiss" data-action="dismiss-starter" type="button" aria-label="Hide starter panel">
        ${renderIcon('x')}
      </button>
      <div class="starter-copy">
        <span class="starter-kicker">New structured text</span>
        <h1>Start with the thought that needs shape</h1>
        <p>Name the central question, then let the branches gather around it</p>
      </div>
      <div class="starter-start-row">
        <div class="starter-actions" aria-label="Starter actions">
          <button class="starter-primary" data-action="focus-first-node" type="button">
            ${renderIcon('plus')}
            <span>Start writing</span>
          </button>
          <button class="starter-secondary" data-action="open" type="button">
            ${renderIcon('folder')}
            <span>Open file</span>
          </button>
          <button class="starter-secondary" data-action="load-sample-mosaic" type="button">
            ${renderIcon('map')}
            <span>View sample</span>
          </button>
          <div class="menu-anchor starter-template-anchor${isTemplatesMenuOpen('starter') ? ' open' : ''}">
            <button
              class="starter-secondary"
              data-action="toggle-template-menu"
              data-template-anchor="starter"
              type="button"
              aria-label="See templates"
              aria-expanded="${String(isTemplatesMenuOpen('starter'))}"
            >
              ${renderIcon('bookDashed')}
              <span>See templates</span>
            </button>
            ${isTemplatesMenuOpen('starter') ? renderTemplatesMenu() : ''}
          </div>
        </div>
      </div>
    </section>
  `
}

function renderCanvasItems(): string {
  return state.document.canvasItems.map(renderCanvasItem).join('')
}

function renderCanvasItem(item: CanvasItem): string {
  if (item.type === 'image') {
    const alt = item.alt || 'Canvas image'

    return `
      <figure
        class="canvas-item canvas-image-item"
        data-canvas-item-id="${escapeAttribute(item.id)}"
        style="left: ${item.x}px; top: ${item.y}px; width: ${item.width}px;"
      >
        ${renderCanvasItemCloseButton(item.id, 'Remove canvas image')}
        ${renderCanvasResizeButton(item.id, 'Resize canvas image')}
        <img src="${escapeAttribute(item.src)}" alt="${escapeAttribute(alt)}" draggable="false" />
        <span class="canvas-image-fallback">
          <span>Preview unavailable</span>
          <small>${escapeHtml(alt)}</small>
        </span>
      </figure>
    `
  }

  const safeUrl = normalizeLinkUrl(item.url)
  const host = formatCanvasLinkHost(item.url)
  const provider = item.provider?.trim() || host || 'Link'
  const title = item.title?.trim() || (item.previewKind === 'video' ? 'YouTube video' : provider)
  const description = item.description?.trim() || item.url
  const height = item.height ?? (item.image ? CANVAS_LINK_THUMBNAIL_HEIGHT : CANVAS_LINK_DEFAULT_HEIGHT)

  return `
    <article
      class="canvas-item canvas-link-preview${item.image ? ' has-thumbnail' : ''}"
      data-canvas-item-id="${escapeAttribute(item.id)}"
      style="left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${height}px;"
    >
      ${renderCanvasItemCloseButton(item.id, 'Remove link preview')}
      ${renderCanvasResizeButton(item.id, 'Resize link preview')}
      ${
        item.image
          ? `<div class="canvas-link-thumbnail"><img src="${escapeAttribute(item.image)}" alt="" draggable="false" /></div>`
          : ''
      }
      <div class="canvas-link-kicker">
        ${
          item.favicon
            ? `<img src="${escapeAttribute(item.favicon)}" alt="" draggable="false" />`
            : renderIcon('link')
        }
        <span>${escapeHtml(provider)}</span>
      </div>
      ${
        safeUrl
          ? `<a class="canvas-link-title" href="${escapeAttribute(safeUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a>`
          : `<span class="canvas-link-title">${escapeHtml(title)}</span>`
      }
      <p>${escapeHtml(description)}</p>
    </article>
  `
}

function getCanvasItemEstimatedHeight(item: CanvasItem): number {
  if (item.type === 'link') {
    return item.height ?? (item.image ? CANVAS_LINK_THUMBNAIL_HEIGHT : CANVAS_LINK_DEFAULT_HEIGHT)
  }

  return item.width * 0.75
}

function renderCanvasItemCloseButton(id: string, label: string): string {
  return `
    <button
      class="tab-close canvas-item-close"
      data-action="remove-canvas-item"
      data-canvas-item-id="${escapeAttribute(id)}"
      type="button"
      aria-label="${escapeAttribute(label)}"
      title="${escapeAttribute(label)}"
    >
      ${renderIcon('x')}
    </button>
  `
}

function renderCanvasResizeButton(id: string, label: string): string {
  return `
    <button
      class="canvas-resize-handle"
      data-canvas-resize-handle
      data-canvas-item-id="${escapeAttribute(id)}"
      type="button"
      aria-label="${escapeAttribute(label)}"
      title="${escapeAttribute(label)}"
    >
      ${renderIcon('resize')}
    </button>
  `
}

function renderMapEdges(layout: Map<string, MindmapLayoutNode>): string {
  return renderMapEdgePaths(collectMapEdges(layout))
}

function renderMapEdgePaths(edges: MapEdgeRender[]): string {
  const markerDefs = edges
    .map((edge, index) => edge.arrows === 'none' ? '' : renderSvgEdgeArrowMarker(edge, index))
    .join('')

  return [
    markerDefs ? `<defs>${markerDefs}</defs>` : '',
    ...edges.map((edge, index) => {
      const className = edge.kind === 'link' ? 'cross-link' : ''
      const markerAttributes = edge.arrows === 'none'
        ? ''
        : renderSvgEdgeArrowAttributes(edge.arrows, getEdgeArrowMarkerId(edge, index))

      return `
        <path
          class="${className}"
          data-edge-kind="${edge.kind}"
          data-edge-id="${escapeAttribute(edge.id)}"
          data-edge-from="${escapeAttribute(edge.fromId)}"
          data-edge-to="${escapeAttribute(edge.toId)}"
          d="${edge.path}"
          style="--edge-color: ${escapeAttribute(edge.color)}"
          ${markerAttributes}
        />`
    }),
    ...edges.filter((edge) => edge.kind === 'tree').map(renderSvgEdgeBreakControl),
  ].join('')
}

function renderSvgEdgeArrowMarker(edge: MapEdgeRender, index: number): string {
  const markerId = getEdgeArrowMarkerId(edge, index)
  const color = escapeAttribute(edge.color)

  return `
    <marker
      id="${markerId}"
      data-edge-kind="${edge.kind}"
      data-edge-id="${escapeAttribute(edge.id)}"
      viewBox="0 0 10 10"
      refX="8.4"
      refY="5"
      markerWidth="5.6"
      markerHeight="5.6"
      markerUnits="strokeWidth"
      orient="auto-start-reverse"
    >
      <path class="edge-arrow-marker" d="M 1.2 1.2 L 8.8 5 L 1.2 8.8 Z" style="fill: color-mix(in srgb, ${color} 72%, transparent)" />
    </marker>
  `
}

function renderSvgEdgeArrowAttributes(arrows: EdgeArrowMode, markerId: string): string {
  const markerUrl = `url(#${markerId})`
  const start = arrows === 'start' || arrows === 'both' ? `marker-start="${markerUrl}"` : ''
  const end = arrows === 'end' || arrows === 'both' ? `marker-end="${markerUrl}"` : ''

  return [start, end].filter(Boolean).join(' ')
}

function getEdgeArrowMarkerId(edge: MapEdgeRender, index: number): string {
  const safeId = `${edge.kind}-${edge.id}`.replace(/[^A-Za-z0-9_-]/g, '-')
  return `edge-arrow-${index}-${safeId}`
}

function syncRenderedMapEdges(): void {
  if (state.view !== 'mindmap') {
    return
  }

  updateMapEdges(getRenderedMapLayout())
}

function getRenderedMapLayout(): Map<string, MindmapLayoutNode> {
  return applyRenderedCardDimensions(computeMindmapLayout(state.document, state.focusId))
}

function applyRenderedCardDimensions(layout: Map<string, MindmapLayoutNode>): Map<string, MindmapLayoutNode> {
  document.querySelectorAll<HTMLElement>('.mind-card[data-card-id]').forEach((card) => {
    const id = card.dataset.cardId
    const nodeLayout = id ? layout.get(id) : null

    if (!id || !nodeLayout || card.offsetWidth <= 0 || card.offsetHeight <= 0) {
      return
    }

    layout.set(id, {
      ...nodeLayout,
      width: card.offsetWidth,
      height: card.offsetHeight,
    })
  })

  return layout
}

function renderEdgeControls(layout: Map<string, MindmapLayoutNode>): string {
  return collectMapEdges(layout)
    .map((edge) => {
      const popoverOpen =
        state.activeEdgeColor?.kind === edge.kind && state.activeEdgeColor.id === edge.id
      const editing = state.editingEdge?.kind === edge.kind && state.editingEdge.id === edge.id
      const label = editing
        ? `<input
            class="edge-label-input"
            data-edge-label-input
            data-edge-kind="${edge.kind}"
            data-edge-id="${escapeAttribute(edge.id)}"
            value="${escapeAttribute(edge.label)}"
            placeholder="Label"
            aria-label="Edge label"
          />`
        : `<button
            class="edge-label${edge.label ? '' : ' empty'}"
            data-action="edit-edge-label"
            data-edge-kind="${edge.kind}"
            data-edge-id="${escapeAttribute(edge.id)}"
            type="button"
            aria-label="${edge.label ? 'Edit edge label' : 'Add edge label'}"
          >${edge.label ? renderRichMarkdown(edge.label, { links: false }) : '+'}</button>`

      return `
        <div
          class="edge-hotspot${popoverOpen ? ' open' : ''}"
          style="left: ${edge.midX}px; top: ${edge.midY}px;"
          data-edge-kind="${edge.kind}"
          data-edge-id="${escapeAttribute(edge.id)}"
        >
          ${label}
        </div>
      `
    })
    .join('')
}

function renderSvgEdgeBreakControl(edge: MapEdgeRender): string {
  const controlPoint = getCubicBezierPoint(edge, 0.92)

  return `
    <g
      class="edge-break-group"
      data-edge-kind="${edge.kind}"
      data-edge-id="${escapeAttribute(edge.id)}"
      style="--edge-color: ${escapeAttribute(edge.color)}"
    >
      <path class="edge-hitbox" d="${edge.path}" />
      <g
        class="edge-breakpoint-svg"
        data-action="break-tree-edge"
        data-node-id="${escapeAttribute(edge.id)}"
        data-edge-kind="${edge.kind}"
        data-edge-id="${escapeAttribute(edge.id)}"
        role="button"
        tabindex="0"
        aria-label="Break link"
        transform="translate(${roundCanvasValue(controlPoint.x)} ${roundCanvasValue(controlPoint.y)})"
      >
        <circle r="7" />
        <text text-anchor="middle" dominant-baseline="central" aria-hidden="true">/</text>
      </g>
    </g>
  `
}

function renderActiveEdgeColorPopover(layout: Map<string, MindmapLayoutNode>): string {
  if (!state.activeEdgeColor) {
    return ''
  }

  const edge = collectMapEdges(layout).find(
    (candidate) => candidate.kind === state.activeEdgeColor?.kind && candidate.id === state.activeEdgeColor.id,
  )

  if (!edge) {
    return ''
  }

  const position = getMapScreenPosition(edge.midX, edge.midY)
  const color = normalizeHexColor(edge.color)

  return `
    <div
      class="edge-color-popover floating"
      role="group"
      aria-label="Edge style"
      style="left: ${position.left}px; top: ${position.top + EDGE_COLOR_POPOVER_OFFSET_Y}px;"
      data-edge-kind="${edge.kind}"
      data-edge-id="${escapeAttribute(edge.id)}"
      data-map-x="${edge.midX}"
      data-map-y="${edge.midY}"
    >
      ${renderEdgeColorPopoverContent(edge, color)}
    </div>
  `
}

function renderEdgeColorPopoverContent(edge: MapEdgeRender, color: string): string {
  return `
    <div class="edge-swatches">
      ${EDGE_COLOR_PRESETS.map(
        (preset) => `
          <button
            class="edge-swatch${preset.toLowerCase() === color.toLowerCase() ? ' active' : ''}"
            data-action="set-edge-color"
            data-edge-kind="${edge.kind}"
            data-edge-id="${escapeAttribute(edge.id)}"
            data-color="${preset}"
            type="button"
            aria-label="Set edge color ${preset}"
            style="--swatch: ${preset}"
          ></button>
        `,
      ).join('')}
    </div>
    ${renderEdgeArrowSelector(edge)}
    <label class="edge-custom-color">
      <input
        data-edge-color-input
        data-edge-kind="${edge.kind}"
        data-edge-id="${escapeAttribute(edge.id)}"
        type="color"
        value="${color}"
        aria-label="Custom edge color"
      />
      <input
        data-edge-color-hex
        data-edge-kind="${edge.kind}"
        data-edge-id="${escapeAttribute(edge.id)}"
        type="text"
        value="${color}"
        aria-label="Edge color hex"
      />
    </label>
  `
}

function renderEdgeArrowSelector(edge: MapEdgeRender): string {
  return `
    <div class="edge-arrow-options" role="group" aria-label="Edge arrows">
      ${EDGE_ARROW_MODES.map(
        ({ mode, label }) => `
          <button
            class="edge-arrow-option${edge.arrows === mode ? ' active' : ''}"
            data-action="set-edge-arrows"
            data-edge-kind="${edge.kind}"
            data-edge-id="${escapeAttribute(edge.id)}"
            data-arrows="${mode}"
            type="button"
            aria-label="${label}"
            aria-pressed="${String(edge.arrows === mode)}"
          >
            ${renderEdgeArrowIcon(mode)}
          </button>
        `,
      ).join('')}
    </div>
  `
}

function renderEdgeArrowIcon(mode: EdgeArrowMode): string {
  const paths: Record<EdgeArrowMode, string> = {
    none: '<path d="M5 12h14"/><path d="m8 8 8 8"/>',
    start: '<path d="M6 12h13"/><path d="m10 8-4 4 4 4"/>',
    end: '<path d="M5 12h13"/><path d="m14 8 4 4-4 4"/>',
    both: '<path d="M6 12h12"/><path d="m10 8-4 4 4 4"/><path d="m14 8 4 4-4 4"/>',
  }

  return `<svg class="icon edge-arrow-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[mode]}</svg>`
}

function getMapScreenPosition(x: number, y: number): { left: number; top: number } {
  return {
    left: Math.round(state.pan.x + x * state.zoom),
    top: Math.round(state.pan.y + y * state.zoom),
  }
}

function collectMapEdges(layout: Map<string, MindmapLayoutNode>): MapEdgeRender[] {
  const edges: MapEdgeRender[] = []

  for (const [id, parentLayout] of layout) {
    const parent = state.document.nodes[id]

    for (const childId of parent.children) {
      const childLayout = layout.get(childId)
      const child = state.document.nodes[childId]

      if (!childLayout || !child) {
        continue
      }

      const route = getStraightEdgeRoute(parentLayout, childLayout)
      edges.push({
        kind: 'tree',
        id: childId,
        fromId: id,
        toId: childId,
        path: route.path,
        label: child.edgeLabel ?? '',
        color: getInheritedTreeEdgeColor(childId),
        arrows: child.edgeArrows ?? 'none',
        startX: route.startX,
        startY: route.startY,
        controlX1: route.controlX1,
        controlY1: route.controlY1,
        controlX2: route.controlX2,
        controlY2: route.controlY2,
        endX: route.endX,
        endY: route.endY,
        midX: route.midX,
        midY: route.midY,
      })
    }
  }

  for (const link of state.document.links) {
    const from = layout.get(link.from)
    const to = layout.get(link.to)

    if (!from || !to) {
      continue
    }

    const route = getCurvedEdgeRoute(from, to)
    edges.push({
      kind: 'link',
      id: link.id,
      fromId: link.from,
      toId: link.to,
      path: route.path,
      label: link.label ?? '',
      color: link.color ?? '#3b82f6',
      arrows: link.arrows ?? 'none',
      startX: route.startX,
      startY: route.startY,
      controlX1: route.controlX1,
      controlY1: route.controlY1,
      controlX2: route.controlX2,
      controlY2: route.controlY2,
      endX: route.endX,
      endY: route.endY,
      midX: route.midX,
      midY: route.midY,
    })
  }

  return edges
}

function canAddMindmapSibling(id: string, visibleNodeCount?: number): boolean {
  const node = state.document.nodes[id]

  if (!node || node.parentId !== null) {
    return true
  }

  const renderedNodeCount = visibleNodeCount ?? computeMindmapLayout(state.document, state.focusId).size
  return renderedNodeCount > 1
}

function renderMindNode(id: string, x: number, y: number, visibleNodeCount: number): string {
  const node = state.document.nodes[id]
  const selected = state.selectedIds.includes(id)
  const primarySelected = state.selectedId === id
  const root = node.parentId === null
  const hasChildren = node.children.length > 0
  const hasMedia = extractMarkdownImages(node.markdown).length > 0
  const title = stripMarkdown(node.markdown) || 'Untitled'
  const editableMarkdown = getEditableMarkdown(node.markdown)
  const inputClass = `map-node-input${editableMarkdown.trim() ? '' : ' empty-node-input'}`
  const mediaClass = hasMedia ? ` image-${state.imagePlacement}` : ''
  const placeholder = root ? 'New central node' : 'New node'
  const focused = state.focusId === id
  const focusLabel = focused ? 'Clear focus' : 'Focus node'
  const backgroundStyle = getMindNodeBackgroundStyle(id)
  const showAddSibling = canAddMindmapSibling(id, visibleNodeCount)

  return `
    <article
      class="mind-card color-${node.color ?? 'neutral'}${backgroundStyle.hasTint ? ' background-tinted' : ''}${mediaClass}${root ? ' root-node' : ''}${selected ? ' selected' : ''}"
      data-card-id="${id}"
      data-node-id="${id}"
      style="left: ${x}px; top: ${y}px; --node-accent-color: ${escapeAttribute(backgroundStyle.accentColor)}; --node-card-bg: ${escapeAttribute(backgroundStyle.backgroundColor)}; --node-card-text: ${escapeAttribute(backgroundStyle.textColor)}; --node-card-muted: ${escapeAttribute(backgroundStyle.mutedColor)};"
    >
      <header class="mind-card-header">
        ${
          hasChildren
            ? `<button
                class="collapse-button"
                data-action="toggle"
                data-node-id="${id}"
                type="button"
                aria-label="Toggle node"
              >
                <span class="chevron${node.collapsed ? ' collapsed' : ''}" aria-hidden="true"></span>
              </button>`
            : ''
        }
        <span class="child-badge">${node.children.length}</span>
      </header>
      ${primarySelected ? renderFormatToolbar(id) : ''}
      <div
        class="${inputClass}"
        contenteditable="true"
        data-node-input
        data-node-id="${id}"
        data-markdown="${escapeAttribute(editableMarkdown)}"
        data-placeholder="${placeholder}"
        spellcheck="true"
        aria-label="Markdown for node ${escapeAttribute(title)}"
      >${renderRichMarkdown(editableMarkdown)}</div>
      ${renderNodeMedia(id)}
      <footer class="mind-card-footer">
        <button class="icon-button" data-action="add-child" data-node-id="${id}" type="button" aria-label="Add child">
          ${renderIcon('arrowRight')}
          <span class="tooltip-label">Add child</span>
        </button>
        ${
          showAddSibling
            ? `<button class="icon-button" data-action="add-after" data-node-id="${id}" type="button" aria-label="Add sibling">
                ${renderIcon('cornerDownRight')}
                <span class="tooltip-label">Add sibling</span>
              </button>`
            : ''
        }
        <button
          class="icon-button"
          data-action="focus-node"
          data-node-id="${id}"
          type="button"
          aria-label="${focusLabel}"
          aria-pressed="${String(focused)}"
        >
          ${renderIcon(focused ? 'focusOff' : 'focus')}
          <span class="tooltip-label">${focusLabel}</span>
        </button>
      </footer>
    </article>
  `
}

function getCommandItems(): CommandItem[] {
  const commandSelection = getValidCommandSelection()
  const contextualCommands: CommandItem[] = commandSelection
    ? [
        {
          action: 'format-selection-link',
          label: 'Add link to selected text',
          hint: 'Selection',
          keywords: 'link hyperlink url selection selected text',
        },
      ]
    : []

  return [
    ...contextualCommands,
    {
      action: 'new-file',
      label: 'New mindmap',
      hint: formatShortcutLabel(state.shortcuts.newTab),
      keywords: 'new create file',
    },
    {
      action: 'open',
      label: 'Open file',
      hint: formatShortcutLabel(state.shortcuts.openFile),
      keywords: 'open import markdown mind',
    },
    {
      action: 'save',
      label: 'Save file',
      hint: formatShortcutLabel(state.shortcuts.save),
      keywords: 'save',
    },
    {
      action: 'toggle-view',
      label: state.view === 'list' ? 'Switch to map' : 'Switch to outline',
      hint: formatShortcutLabel(state.shortcuts.toggleView),
      keywords: 'view list map outline',
    },
    {
      action: 'export-mosaic',
      label: 'Export Mosaic file',
      hint: MOSAIC_FILE_EXTENSION,
      keywords: 'export mosaic package assets zip',
    },
    {
      action: 'export-readable-markdown',
      label: 'Export readable Markdown',
      hint: '.md',
      keywords: 'export readable markdown clean text',
    },
    {
      action: 'export-json',
      label: 'Export JSON',
      hint: '.json',
      keywords: 'export json data interchange',
    },
    {
      action: 'toggle-theme-menu',
      label: 'Themes',
      hint: getAppTheme(state.theme).label,
      keywords: 'theme dark light sage carbon tokyo night tarracota terracotta',
    },
  ]
}

function renderCommandPalette(): string {
  const query = state.commandQuery.trim().toLowerCase()
  const commands = getCommandItems().filter((command) => {
    if (!query) {
      return true
    }

    return `${command.label} ${command.hint} ${command.keywords}`.toLowerCase().includes(query)
  })

  return `
    <div class="command-backdrop" data-action="close-command">
      <section class="command-panel" role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="command-title">
          <span>Commands</span>
          <kbd>Esc</kbd>
        </div>
        <input
          id="command-input"
          class="command-input"
          value="${escapeAttribute(state.commandQuery)}"
          placeholder="Search actions"
          autocomplete="off"
        />
        <div class="command-list">
          ${
            commands.length > 0
              ? commands
                  .map(
                    (command) => `
                      <button data-action="${command.action}" type="button">
                        <span>${escapeHtml(command.label)}</span>
                        <kbd>${escapeHtml(command.hint)}</kbd>
                      </button>
                    `,
                  )
                  .join('')
              : '<p class="command-empty">No actions found</p>'
          }
        </div>
      </section>
    </div>
  `
}

function bindEvents(root: HTMLElement): void {
  const titleInput = root.querySelector<HTMLElement>('#title-input')

  root.onclick = handleClick
  root.oninput = handleInput
  root.onchange = handleChange
  root.onkeydown = handleKeyDown
  root.onkeyup = handleTitleCaretEvent
  root.onpointerdown = handlePointerDown
  root.onpointerover = handlePointerOver
  root.onpointerout = handlePointerOut
  root.onpointerup = handlePointerUp
  root.onwheel = handleWheel
  root.ondblclick = handleDoubleClick
  root.ondragstart = handleDragStart
  root.ondragover = handleDragOver
  root.ondragleave = handleDragLeave
  root.ondragend = handleDragEnd
  root.ondrop = handleDrop
  root.onpaste = handlePaste
  ;(root as HTMLElement & { onfocusin: ((event: FocusEvent) => void) | null }).onfocusin = handleFocusIn
  ;(root as HTMLElement & { onfocusout: ((event: FocusEvent) => void) | null }).onfocusout = handleFocusOut
  if (titleInput) {
    titleInput.onscroll = handleTitleCaretEvent
  }
  root.querySelectorAll<HTMLImageElement>('.mind-card .node-image img').forEach((image) => {
    image.onload = syncRenderedMapEdges
  })
  root.querySelectorAll<HTMLImageElement>('.canvas-image-item img').forEach((image) => {
    image.onerror = () => image.closest('.canvas-image-item')?.classList.add('image-load-failed')
    image.onload = () => image.closest('.canvas-image-item')?.classList.remove('image-load-failed')
  })
  document.onkeydown = handleGlobalKeyDown
  document.onselectionchange = handleTitleCaretEvent
}

function syncShortcutTooltips(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-action]').forEach((element) => {
    const shortcutId = getActionShortcutId(element)
    const baseLabel = getActionTooltipBaseLabel(element)

    if (!shortcutId || !baseLabel) {
      delete element.dataset.shortcutTooltip
      return
    }

    const tooltip = formatShortcutTooltipLabel(baseLabel, shortcutId)
    element.dataset.shortcutTooltip = tooltip
    getDirectTooltipLabel(element)?.replaceChildren(document.createTextNode(tooltip))
  })
}

function getActionShortcutId(element: HTMLElement): ShortcutId | null {
  const action = element.dataset.action

  switch (action) {
    case 'new-file':
      return 'newTab'
    case 'open':
      return 'openFile'
    case 'set-view':
    case 'toggle-view':
      return 'toggleView'
    case 'command':
      return 'commandPalette'
    case 'save':
    case 'save-status':
      return 'save'
    case 'format-bold':
      return 'bold'
    case 'format-italic':
      return 'italic'
    case 'format-underline':
      return 'underline'
    case 'add-root-outline-line':
      return 'addRootOutlineLine'
    case 'add-after':
      return state.view === 'mindmap' ? 'mindmapAddSibling' : 'newOutlineLine'
    case 'add-child':
      return 'mindmapAddChild'
    case 'indent':
      return 'indentLine'
    case 'outdent':
      return 'outdentLine'
    case 'delete':
      return state.view === 'mindmap' ? 'mindmapDelete' : 'deleteSelection'
    case 'toggle':
      return 'toggleCollapse'
    case 'break-tree-edge':
      return 'mindmapBreakLink'
    case 'clear-focus':
      return 'outdentOrClearFocus'
    default:
      return null
  }
}

function getActionTooltipBaseLabel(element: HTMLElement): string {
  const action = element.dataset.action

  if (action === 'save-status') {
    return 'Save file'
  }

  if (action === 'clear-focus') {
    return 'Clear focus'
  }

  const ariaLabel = element.getAttribute('aria-label')?.trim()

  if (ariaLabel) {
    return ariaLabel
  }

  const directLabel = Array.from(element.children).find((child): child is HTMLElement => {
    return child instanceof HTMLElement
      && !child.classList.contains('tooltip-label')
      && child.tagName !== 'KBD'
      && child.tagName !== 'SVG'
  })
  const directText = directLabel?.textContent?.trim()

  if (directText) {
    return directText
  }

  return element.textContent?.replace(/\s+/gu, ' ').trim() ?? ''
}

function getDirectTooltipLabel(element: HTMLElement): HTMLElement | null {
  return Array.from(element.children).find((child): child is HTMLElement => {
    return child instanceof HTMLElement && child.classList.contains('tooltip-label')
  }) ?? null
}

function formatShortcutTooltipLabel(label: string, shortcutId: ShortcutId): string {
  return `${label} (${formatShortcutLabel(state.shortcuts[shortcutId] ?? '')})`
}

function handleShortcutTooltipPointerOver(event: PointerEvent): void {
  const target = event.target as HTMLElement
  const actionTarget = target.closest<HTMLElement>('[data-action][data-shortcut-tooltip]')

  if (!actionTarget || hasInlineShortcutTooltip(actionTarget)) {
    hideShortcutTooltip()
    return
  }

  const relatedTarget = event.relatedTarget

  if (shortcutTooltipTarget === actionTarget || (relatedTarget instanceof Node && actionTarget.contains(relatedTarget))) {
    return
  }

  hideShortcutTooltip()
  shortcutTooltipTarget = actionTarget
  shortcutTooltipTimer = window.setTimeout(() => {
    showShortcutTooltip(actionTarget)
  }, SHORTCUT_TOOLTIP_DELAY_MS)
}

function handleShortcutTooltipPointerOut(event: PointerEvent): void {
  if (!shortcutTooltipTarget) {
    return
  }

  const relatedTarget = event.relatedTarget

  if (relatedTarget instanceof Node && shortcutTooltipTarget.contains(relatedTarget)) {
    return
  }

  hideShortcutTooltip()
}

function hasInlineShortcutTooltip(element: HTMLElement): boolean {
  return Boolean(getDirectTooltipLabel(element) || element.closest('.format-toolbar'))
}

function showShortcutTooltip(target: HTMLElement): void {
  if (shortcutTooltipTarget !== target || !target.isConnected) {
    return
  }

  const label = target.dataset.shortcutTooltip

  if (!label) {
    return
  }

  shortcutTooltipElement?.remove()
  const tooltip = document.createElement('div')
  tooltip.className = 'shortcut-hover-tooltip'
  tooltip.textContent = label
  document.body.append(tooltip)

  const targetRect = target.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  const margin = 8
  const belowTop = targetRect.bottom + 9
  const aboveTop = targetRect.top - tooltipRect.height - 9
  const fitsBelow = belowTop + tooltipRect.height <= window.innerHeight - margin
  const maxLeft = Math.max(margin, window.innerWidth - tooltipRect.width - margin)
  const left = Math.min(maxLeft, Math.max(margin, targetRect.left + (targetRect.width - tooltipRect.width) / 2))
  const top = fitsBelow ? belowTop : Math.max(margin, aboveTop)

  tooltip.style.left = `${left}px`
  tooltip.style.top = `${top}px`
  shortcutTooltipElement = tooltip
  requestAnimationFrame(() => tooltip.classList.add('visible'))
}

function hideShortcutTooltip(): void {
  if (shortcutTooltipTimer !== null) {
    window.clearTimeout(shortcutTooltipTimer)
    shortcutTooltipTimer = null
  }

  shortcutTooltipElement?.remove()
  shortcutTooltipElement = null
  shortcutTooltipTarget = null
}

function handlePointerOver(event: PointerEvent): void {
  handleShortcutTooltipPointerOver(event)

  const target = event.target as HTMLElement
  const themeTrigger = target.closest<HTMLElement>('.theme-trigger')

  if (themeTrigger && event.pointerType !== 'touch') {
    openThemeMenu()
  }

  if (state.view === 'list') {
    const control = target.closest<HTMLElement>('.outline-depth-control')

    if (control) {
      setOutlineDepthControlsExpanded(true)
    }
  }

  if (state.view !== 'mindmap') {
    return
  }

  const card = target.closest<HTMLElement>('.mind-card[data-node-id]')

  if (card?.dataset.nodeId) {
    setHoveredMindNode(card.dataset.nodeId)
  }
}

function handlePointerOut(event: PointerEvent): void {
  handleShortcutTooltipPointerOut(event)

  const target = event.target as HTMLElement
  const themeAnchor = target.closest<HTMLElement>('.theme-anchor')

  if (themeAnchor && state.themeMenuOpen && event.pointerType !== 'touch') {
    const relatedTarget = event.relatedTarget

    if (!(relatedTarget instanceof Node && themeAnchor.contains(relatedTarget))) {
      closeThemeMenu()
    }
  }

  if (state.view === 'list') {
    const control = target.closest<HTMLElement>('.outline-depth-control')

    if (control) {
      const relatedTarget = event.relatedTarget

      if (!(relatedTarget instanceof Node && control.contains(relatedTarget))) {
        setOutlineDepthControlsExpanded(false)
      }
    }
  }

  if (state.view !== 'mindmap' || !hoveredMindNodeId) {
    return
  }

  const card = target.closest<HTMLElement>('.mind-card[data-node-id]')

  if (!card || card.dataset.nodeId !== hoveredMindNodeId) {
    return
  }

  const relatedTarget = event.relatedTarget

  if (relatedTarget instanceof Node && card.contains(relatedTarget)) {
    return
  }

  setHoveredMindNode(null)
}

function setOutlineDepthControlsExpanded(expanded: boolean): void {
  if (state.outlineDepthControlsExpanded === expanded) {
    return
  }

  state.outlineDepthControlsExpanded = expanded
  document.querySelector<HTMLElement>('.outline-depth-control')?.classList.toggle('expanded', expanded)
}

function setHoveredMindNode(nodeId: string | null): void {
  const nextNodeId = nodeId && state.document.nodes[nodeId] ? nodeId : null

  if (hoveredMindNodeId === nextNodeId) {
    return
  }

  hoveredMindNodeId = nextNodeId
  updateMindNodeHoverInDom()
}

function updateMindNodeHoverInDom(): void {
  document.querySelectorAll<HTMLElement>('.mind-card.node-hover').forEach((card) => {
    card.classList.remove('node-hover')
  })

  if (state.view !== 'mindmap' || !hoveredMindNodeId || !state.document.nodes[hoveredMindNodeId]) {
    return
  }

  const card = document.querySelector<HTMLElement>(`.mind-card[data-node-id="${cssEscape(hoveredMindNodeId)}"]`)

  card?.classList.add('node-hover')
}

function handleClick(event: MouseEvent): void {
  if (suppressNextClick) {
    suppressNextClick = false
    event.preventDefault()
    return
  }

  const target = event.target as HTMLElement

  if (handleShortcutClickCapture(event)) {
    return
  }

  const commandPanel = target.closest('.command-panel')
  const popupMenu = target.closest('.popup-menu')
  const linkEditor = target.closest('[data-link-editor]')
  const nodeInput = target.closest<HTMLInputElement>('[data-node-input]')
  const markdownAnchor = target.closest<HTMLAnchorElement>('[data-markdown-link]')
  const button = target.closest<HTMLElement>('[data-action]')
  const edgeHotspot = target.closest<HTMLElement>('.edge-hotspot')
  const edgeBreakpoint = target.closest<HTMLElement>('.edge-breakpoint-svg')
  const edgeBreakGroup = target.closest<HTMLElement>('.edge-break-group')

  if (state.themeMenuOpen && !target.closest('.theme-anchor')) {
    state.themeMenuOpen = false
    removeMenuPopupsFromDom()
  }

  if (!button && linkEditor) {
    return
  }

  if (!button && !state.pendingLinkFrom && markdownAnchor && nodeInput?.contains(markdownAnchor)) {
    event.preventDefault()
    showMarkdownLinkPrompt(markdownAnchor)
    return
  }

  if (state.view === 'mindmap' && isPointerShortcut(event, 'mindmapBreakLink')) {
    const childId =
      edgeBreakpoint?.dataset.edgeKind === 'tree'
        ? edgeBreakpoint.dataset.edgeId ?? null
        : edgeHotspot?.dataset.edgeKind === 'tree'
          ? edgeHotspot.dataset.edgeId ?? null
          : getTreeEdgeNearPoint(event.clientX, event.clientY)

    if (childId) {
      event.preventDefault()
      breakTreeEdge(childId)
      return
    }
  }

  if (!button && edgeBreakGroup) {
    return
  }

  if (state.pendingLinkFrom && !button) {
    const targetNode = target.closest<HTMLElement>('[data-node-id]')

    if (targetNode?.dataset.nodeId) {
      completeNodeLink(targetNode.dataset.nodeId)
      return
    }
  }

  if (!button && nodeInput?.dataset.nodeId) {
    selectNode(nodeInput.dataset.nodeId, false)
    updateSelectionInDom()
    closeFloatingPopups(false)
    return
  }

  if (!button && edgeHotspot?.dataset.edgeKind && edgeHotspot.dataset.edgeId) {
    openEdgeColorPopover(edgeHotspot.dataset.edgeKind as EdgeKind, edgeHotspot.dataset.edgeId)
    return
  }

  if (!button && target.closest('.edge-color-popover, .node-background-popover')) {
    return
  }

  if (!button && shouldClearOutlineSelectionOnClick(target)) {
    closeFloatingPopups(false)
    clearOutlineSelectionFromBackgroundClick(target)
    return
  }

  if (!button) {
    const canvas = target.closest<HTMLElement>('[data-canvas]')
    const canvasItem = target.closest<HTMLElement>('.canvas-item')
    const emptyCanvas = Boolean(canvas && !target.closest('.mind-card, .edge-hotspot, .canvas-item'))
    const closedPopups = !popupMenu && closeFloatingPopups(false)

    if (canvasItem) {
      return
    }

    if (emptyCanvas) {
      if (selectMindmapNodeNearPoint(event.clientX, event.clientY)) {
        return
      }

      clearCanvasSelection()
      return
    }

    if (closedPopups) {
      render()
      return
    }

    if (target.matches('input, textarea')) {
      return
    }

    const card = target.closest<HTMLElement>('[data-node-id]')

    if (card?.dataset.nodeId) {
      selectNode(card.dataset.nodeId)
    }

    return
  }

  if (button.dataset.action === 'close-command' && commandPanel) {
    return
  }

  const action = button.dataset.action
  const nodeId = button.dataset.nodeId ?? state.selectedId

  if (action === 'remove-image' && nodeId) {
    removeImageFromNode(nodeId, Number(button.dataset.imageIndex ?? '0'))
    return
  }

  if (action === 'remove-canvas-item' && button.dataset.canvasItemId) {
    removeCanvasItem(button.dataset.canvasItemId)
    return
  }

  if (nodeId && action && isNodeAction(action)) {
    runNodeAction(action, nodeId)
    return
  }

  switch (action) {
    case 'new-file':
      createNewDocumentTab()
      break
    case 'toggle-template-menu':
      toggleTemplatesMenu(isTemplateMenuAnchor(button.dataset.templateAnchor) ? button.dataset.templateAnchor : 'header')
      state.saveMenuOpen = false
      state.settingsOpen = false
      state.themeMenuOpen = false
      state.activeMarkdownLink = null
      state.activeNodeBackgroundId = null
      render()
      break
    case 'focus-first-node':
      focusFirstStarterNode()
      break
    case 'dismiss-starter':
      dismissStarterEmptyState()
      break
    case 'apply-template':
      if (isTemplateSource(button.dataset.templateSource) && button.dataset.templateId) {
        applyMindmapTemplate(
          button.dataset.templateId,
          button.dataset.templateSource,
          isTemplateApplyTarget(button.dataset.templateTarget) ? button.dataset.templateTarget : 'current',
        )
      }
      break
    case 'start-template-rename':
      if (isTemplateSource(button.dataset.templateSource) && button.dataset.templateId) {
        startTemplateRename(button.dataset.templateSource, button.dataset.templateId)
      }
      break
    case 'commit-template-rename':
      if (isTemplateSource(button.dataset.templateSource) && button.dataset.templateId) {
        commitTemplateRename(button.dataset.templateSource, button.dataset.templateId, state.templateRenameDraft)
      }
      break
    case 'cancel-template-rename':
      cancelTemplateRename()
      break
    case 'open-template-save':
      openTemplateSaveForm()
      break
    case 'save-template':
      saveCustomTemplateFromForm()
      break
    case 'cancel-template-save':
      closeTemplateSaveForm()
      break
    case 'remove-template':
      if (isTemplateSource(button.dataset.templateSource) && button.dataset.templateId) {
        removeTemplate(button.dataset.templateSource, button.dataset.templateId)
      }
      break
    case 'select-tab':
      if (button.dataset.tabId) {
        switchDocumentTab(button.dataset.tabId)
      }
      break
    case 'close-tab':
      if (button.dataset.tabId) {
        closeDocumentTab(button.dataset.tabId)
      }
      break
    case 'cancel-close-tab':
      state.pendingCloseTabId = null
      render()
      break
    case 'confirm-close-tab':
      if (button.dataset.tabId) {
        state.pendingCloseTabId = null
        closeDocumentTab(button.dataset.tabId, true)
      }
      break
    case 'open':
      state.commandOpen = false
      closeFloatingPopups(false)
      void openMindmapFile()
      break
    case 'save':
      state.commandOpen = false
      closeFloatingPopups(false)
      void saveMindmapFile()
      break
    case 'save-status':
      if (!state.fileHandle || state.dirty) {
        state.commandOpen = false
        closeFloatingPopups(false)
        void saveMindmapFile()
      }
      break
    case 'export-default':
      state.commandOpen = false
      closeFloatingPopups(false)
      void exportDefaultFormat()
      break
    case 'toggle-export-menu':
      state.saveMenuOpen = !state.saveMenuOpen
      state.settingsOpen = false
      state.themeMenuOpen = false
      closeTemplatesMenu()
      state.activeMarkdownLink = null
      state.activeNodeBackgroundId = null
      render()
      break
    case 'set-outline-width':
      updateOutlineWidth(Number(button.dataset.value ?? state.outlineWidth))
      break
    case 'set-image-width':
      updateDefaultImageWidth(Number(button.dataset.value ?? state.defaultImageWidth))
      break
    case 'set-trackpad-speed':
      updateTrackpadSpeed(Number(button.dataset.value ?? state.trackpadSpeed))
      break
    case 'step-autosave':
      updateAutoSaveSeconds(state.autoSaveSeconds + Number(button.dataset.step ?? '0'))
      break
    case 'export-settings':
      exportSettingsJson()
      break
    case 'import-settings':
      document.querySelector<HTMLInputElement>('#settings-input')?.click()
      break
    case 'settings-tab':
      if (isSettingsTab(button.dataset.settingsTab)) {
        state.settingsTab = button.dataset.settingsTab
        state.shortcutCaptureId = null
        state.shortcutConflictMessage = ''
        render()
      }
      break
    case 'capture-shortcut':
      if (isShortcutId(button.dataset.shortcutId)) {
        state.shortcutCaptureId = button.dataset.shortcutId
        state.shortcutConflictMessage = ''
        render()
      }
      break
    case 'reset-shortcut':
      if (isShortcutId(button.dataset.shortcutId)) {
        updateShortcut(button.dataset.shortcutId, DEFAULT_SHORTCUTS[button.dataset.shortcutId])
      }
      break
    case 'clear-shortcut':
      if (isShortcutId(button.dataset.shortcutId)) {
        updateShortcut(button.dataset.shortcutId, '')
      }
      break
    case 'reset-shortcuts':
      state.shortcuts = { ...DEFAULT_SHORTCUTS }
      state.shortcutCaptureId = null
      state.shortcutConflictMessage = 'Keyboard shortcuts reset to defaults.'
      saveShortcuts()
      render()
      break
    case 'toggle-settings':
      state.settingsOpen = !state.settingsOpen
      state.saveMenuOpen = false
      state.themeMenuOpen = false
      closeTemplatesMenu()
      state.activeMarkdownLink = null
      render()
      break
    case 'toggle-frontmatter':
      if (state.frontmatterMode === 'yaml') {
        syncOpenFrontmatter()
      }
      state.frontmatterOpen = !state.frontmatterOpen
      render()
      break
    case 'enable-frontmatter':
      state.frontmatterEnabled = true
      state.frontmatterOpen = true
      state.frontmatterMode = DEFAULT_FRONTMATTER_MODE
      render()
      break
    case 'set-frontmatter-mode':
      {
        const nextFrontmatterMode = button.dataset.frontmatterMode

        if (!isFrontmatterMode(nextFrontmatterMode)) {
          break
        }
        if (state.frontmatterMode === 'yaml') {
          syncOpenFrontmatter()
        }
        if (!state.frontmatterEnabled) {
          break
        }
        state.frontmatterMode = nextFrontmatterMode
        state.frontmatterOpen = true
        render()
        break
      }
    case 'add-file-property':
      addFileProperty()
      break
    case 'remove-file-property':
      if (button.dataset.propertyId) {
        removeFileProperty(button.dataset.propertyId)
      }
      break
    case 'move-file-property':
      if (button.dataset.propertyId) {
        moveFileProperty(button.dataset.propertyId, button.dataset.direction === '-1' ? -1 : 1)
      }
      break
    case 'load-sample-mosaic':
      {
        const sampleDocument = state.view === 'list'
          ? setDefaultView(createSampleMindmap(), 'list')
          : createSampleMindmap()

        openDocumentInNewTab(
          sampleDocument,
          `sample${MOSAIC_FILE_EXTENSION}`,
          'mosaic',
          null,
          'Sample .mosaic loaded',
          hasFileProperties(sampleDocument),
        )
        state.settingsOpen = false
        closeTemplatesMenu()
        render()
        break
      }
    case 'format-bold':
      applyMarkdownFormat(nodeId, '**', '**', 'bold text')
      break
    case 'format-italic':
      applyMarkdownFormat(nodeId, '_', '_', 'italic text')
      break
    case 'format-underline':
      applyMarkdownFormat(nodeId, '<u>', '</u>', 'underlined text')
      break
    case 'format-highlight':
      applyMarkdownFormat(nodeId, '==', '==', 'highlighted text')
      break
    case 'format-strike':
      applyMarkdownFormat(nodeId, '~~', '~~', 'struck text')
      break
    case 'format-code':
      applyMarkdownFormat(nodeId, '`', '`', 'code')
      break
    case 'format-list':
      toggleMarkdownBulletList(nodeId)
      break
    case 'format-link':
      openMarkdownLinkEditor(nodeId)
      break
    case 'format-selection-link':
      openCommandSelectionMarkdownLinkEditor()
      break
    case 'toggle-node-background':
      if (nodeId) {
        const isOpen = state.activeNodeBackgroundId === nodeId
        state.saveMenuOpen = false
        state.settingsOpen = false
        state.themeMenuOpen = false
        closeTemplatesMenu()
        state.activeMarkdownLink = null
        state.activeEdgeColor = null
        state.activeNodeBackgroundId = isOpen ? null : nodeId
        render()
      }
      break
    case 'toggle-line-color':
      if (nodeId) {
        const isOpen = state.activeEdgeColor?.kind === 'tree' && state.activeEdgeColor.id === nodeId
        state.saveMenuOpen = false
        state.settingsOpen = false
        state.themeMenuOpen = false
        closeTemplatesMenu()
        state.activeMarkdownLink = null
        state.activeNodeBackgroundId = null
        state.activeEdgeColor = isOpen ? null : { kind: 'tree', id: nodeId }
        render()
      }
      break
    case 'commit-format-link':
      commitMarkdownLink(nodeId)
      break
    case 'cancel-format-link':
      cancelMarkdownLinkEditor(nodeId)
      break
    case 'upload-image':
      if (nodeId) {
        state.imageTargetId = nodeId
        document.querySelector<HTMLInputElement>('#image-input')?.click()
      }
      break
    case 'add-canvas-image':
      if (state.view === 'mindmap') {
        closeFloatingPopups(false)
        document.querySelector<HTMLInputElement>('#canvas-image-input')?.click()
      }
      break
    case 'add-canvas-link':
      if (state.view === 'mindmap') {
        promptCanvasLink()
      }
      break
    case 'start-node-link':
      if (nodeId) {
        state.linkEditor = null
        state.focusLinkEditorAfterRender = false
        state.activeMarkdownLink = null
        state.pendingLinkFrom = nodeId
        setStatus('Choose another node to link')
      }
      break
    case 'set-edge-color':
      if (button.dataset.edgeKind && button.dataset.edgeId && button.dataset.color) {
        state.activeEdgeColor = { kind: button.dataset.edgeKind as EdgeKind, id: button.dataset.edgeId }
        updateEdgeColor(button.dataset.edgeKind as EdgeKind, button.dataset.edgeId, button.dataset.color)
      }
      break
    case 'set-node-background':
      if (nodeId && isNodeColor(button.dataset.nodeColor)) {
        updateNodeSubtreeBackground(nodeId, button.dataset.nodeColor)
      }
      break
    case 'set-edge-arrows':
      if (button.dataset.edgeKind && button.dataset.edgeId && isEdgeArrowMode(button.dataset.arrows)) {
        state.activeEdgeColor = { kind: button.dataset.edgeKind as EdgeKind, id: button.dataset.edgeId }
        updateEdgeArrows(button.dataset.edgeKind as EdgeKind, button.dataset.edgeId, button.dataset.arrows)
      }
      break
    case 'edit-edge-label':
      if (button.dataset.edgeKind && button.dataset.edgeId) {
        editEdgeLabel(button.dataset.edgeKind as EdgeKind, button.dataset.edgeId)
      }
      break
    case 'break-tree-edge':
      if (nodeId) {
        breakTreeEdge(nodeId)
      }
      break
    case 'cancel-link':
      state.pendingLinkFrom = null
      render()
      break
    case 'open-markdown-link':
      openActiveMarkdownLink()
      break
    case 'close-markdown-link':
      state.activeMarkdownLink = null
      render()
      break
    case 'export-mosaic':
      state.commandOpen = false
      closeFloatingPopups(false)
      void exportDocument('mosaic')
      break
    case 'export-readable-markdown':
      state.commandOpen = false
      closeFloatingPopups(false)
      exportReadableMarkdown()
      break
    case 'export-json':
      state.commandOpen = false
      closeFloatingPopups(false)
      exportJson()
      break
    case 'copy-full':
      closeFloatingPopups(false)
      void copyFullMarkdown()
      break
    case 'set-view':
      closeFloatingPopups(false)
      setView(button.dataset.view as ViewMode)
      break
    case 'outline-depth-down':
      closeFloatingPopups(false)
      changeOutlineDepthLevel(-1)
      break
    case 'outline-depth-up':
      closeFloatingPopups(false)
      changeOutlineDepthLevel(1)
      break
    case 'outline-depth-set':
      closeFloatingPopups(false)
      applyOutlineDepthLevel(Number(button.dataset.level ?? '1'))
      break
    case 'outline-depth-all':
      closeFloatingPopups(false)
      applyOutlineDepthLevel(getOutlineMaxLevel())
      break
    case 'toggle-view':
      toggleView()
      break
    case 'toggle-theme-menu':
      openThemeMenu()
      break
    case 'set-theme':
      if (isThemeMode(button.dataset.themeId)) {
        setTheme(button.dataset.themeId)
      }
      break
    case 'theme':
      closeFloatingPopups(false)
      toggleTheme()
      break
    case 'command':
      closeFloatingPopups(false)
      state.commandOpen = true
      state.commandQuery = ''
      state.focusCommandAfterRender = true
      render()
      break
    case 'zoom-in':
      closeFloatingPopups(false)
      setZoom(state.zoom + MAP_ZOOM_DISPLAY_STEP)
      break
    case 'zoom-out':
      closeFloatingPopups(false)
      setZoom(state.zoom - MAP_ZOOM_DISPLAY_STEP)
      break
    case 'reset-map':
      closeFloatingPopups(false)
      state.zoom = MAP_ZOOM_BASE
      state.pan = getDefaultMapPan(state.document, state.zoom)
      render()
      break
    case 'add-root':
      addRootNode()
      break
    case 'add-root-outline-line':
      addRootOutlineLine()
      break
    case 'clear-focus':
      closeFloatingPopups(false)
      state.focusId = null
      render()
      break
    case 'close-command':
      state.commandOpen = false
      state.commandQuery = ''
      state.commandSelection = null
      render()
      break
  }
}

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLElement

  if (target.matches('[data-frontmatter-property-key]')) {
    const input = target as HTMLInputElement

    if (!input.dataset.propertyId) {
      return
    }

    pushHistory()
    updateFileProperty(input.dataset.propertyId, (property) => ({
      ...property,
      key: input.value,
    }))
    return
  }

  if (target.matches('[data-frontmatter-property-value]')) {
    const input = target as HTMLInputElement | HTMLTextAreaElement

    if (!input.dataset.propertyId) {
      return
    }

    pushHistory()
    updateFileProperty(input.dataset.propertyId, (property) => ({
      ...property,
      value: input.value,
    }))
    return
  }

  if (target.id === 'frontmatter-input') {
    state.status = 'Editing frontmatter'
    return
  }

  if (target.id === 'outline-width-input') {
    updateOutlineWidth(Number((target as HTMLInputElement).value))
    return
  }

  if (target.id === 'image-width-input') {
    updateDefaultImageWidth(Number((target as HTMLInputElement).value))
    return
  }

  if (target.id === 'trackpad-speed-input') {
    updateTrackpadSpeed(Number((target as HTMLInputElement).value))
    return
  }

  if (target.matches('[data-edge-color-input]')) {
    const input = target as HTMLInputElement
    state.activeEdgeColor = { kind: input.dataset.edgeKind as EdgeKind, id: input.dataset.edgeId ?? '' }
    updateEdgeColor(input.dataset.edgeKind as EdgeKind, input.dataset.edgeId ?? '', input.value)
    return
  }

  if (target.matches('[data-edge-color-hex]')) {
    const input = target as HTMLInputElement

    if (isHexColorInput(input.value)) {
      state.activeEdgeColor = { kind: input.dataset.edgeKind as EdgeKind, id: input.dataset.edgeId ?? '' }
      updateEdgeColor(input.dataset.edgeKind as EdgeKind, input.dataset.edgeId ?? '', input.value)
    }
    return
  }

  if (target.id === 'autosave-seconds') {
    updateAutoSaveSeconds(Number((target as HTMLInputElement).value))
    return
  }

  if (target.id === 'command-toast-toggle') {
    updateCommandToastEnabled((target as HTMLInputElement).checked)
    render()
    return
  }

  if (target.matches('[data-image-width]')) {
    updateImageWidth(
      target.dataset.nodeId ?? '',
      Number(target.dataset.imageIndex ?? '0'),
      Number((target as HTMLInputElement).value),
    )
    return
  }

  if (target.id === 'command-input') {
    state.commandQuery = (target as HTMLInputElement).value
    state.focusCommandAfterRender = true
    render()
    return
  }

  if (target.matches('[data-template-save-input]')) {
    state.templateSaveDraft = (target as HTMLInputElement).value
    return
  }

  if (target.matches('[data-template-rename]')) {
    state.templateRenameDraft = (target as HTMLInputElement).value
    return
  }

  if (target.id === 'title-input') {
    pushHistory()
    updateTitle(getTitleInputText(target))
    updateDirtyIndicatorInDom()
    syncTitleEmptyState(target)
    scheduleTitleCaretSync()
    return
  }

  if (target.matches('[data-node-input]')) {
    const id = target.dataset.nodeId

    if (!id) {
      return
    }

    const previousMarkdown = target.dataset.markdown ?? ''
    const rawTextMarkdown = getEditableRawTextFromElement(target)
    const textMarkdown = normalizeEditableMarkdown(rawTextMarkdown)
    const shouldRenderRichMarkdown = shouldRenderTypedRichMarkdown(previousMarkdown, textMarkdown)
    if (!state.starterDismissed && rawTextMarkdown.length > 0) {
      dismissStarterEmptyState({ render: false })
    }
    pushHistory()
    syncNodeInputEmptyState(target)
    state.document = updateNodeTextMarkdown(state.document, id, textMarkdown)
    setSelectedNodes([id], id, id)
    state.dirty = true
    state.status = 'Editing'
    if (shouldRenderRichMarkdown) {
      state.focusAfterRender = id
      render()
    } else {
      syncRenderedMapEdges()
    }
  }
}

function handleChange(event: Event): void {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

  if (target instanceof HTMLSelectElement && target.matches('[data-frontmatter-property-type]')) {
    if (target.dataset.propertyId && isFilePropertyType(target.value)) {
      changeFilePropertyType(target.dataset.propertyId, target.value)
    }
    return
  }

  if (target instanceof HTMLSelectElement && target.matches('[data-frontmatter-property-value]')) {
    if (!target.dataset.propertyId) {
      return
    }

    pushHistory()
    updateFileProperty(
      target.dataset.propertyId,
      (property) => ({
        ...property,
        value: getNormalizedFilePropertyValue(property.type, target.value),
      }),
      true,
    )
    return
  }

  if (target.matches('[data-edge-color-input], [data-edge-color-hex]')) {
    edgeColorHistoryKey = null
    return
  }

  if (target instanceof HTMLSelectElement && target.id === 'image-placement') {
    updateImagePlacement(target.value as ImagePlacement)
    return
  }

  if (target.id === 'frontmatter-input') {
    applyFrontmatter(target.value)
    return
  }

  if (target instanceof HTMLInputElement && target.id === 'image-input' && target.files?.[0]) {
    void insertUploadedImage(target.files[0])
    target.value = ''
    return
  }

  if (target instanceof HTMLInputElement && target.id === 'canvas-image-input' && target.files?.[0]) {
    void insertCanvasUploadedImage(target.files[0])
    target.value = ''
    return
  }

  if (target instanceof HTMLInputElement && target.id === 'settings-input' && target.files?.[0]) {
    void importSettingsJson(target.files[0])
    target.value = ''
    return
  }

  if (!(target instanceof HTMLInputElement) || target.id !== 'file-input' || !target.files?.[0]) {
    return
  }

  void loadFile(target.files[0], null)
  target.value = ''
}

function handleFocusIn(event: FocusEvent): void {
  const target = event.target as HTMLElement

  if (target.id === 'title-input') {
    scheduleTitleCaretSync()
    return
  }

  const nodeInput = target.closest<HTMLInputElement>('[data-node-input]')

  if (!nodeInput?.dataset.nodeId) {
    return
  }

  selectNode(nodeInput.dataset.nodeId, false)
  state.status = 'Line selected'
  updateSelectionInDom()
}

function handleFocusOut(event: FocusEvent): void {
  const target = event.target as HTMLElement

  if (target.matches('[data-tab-rename]')) {
    commitDocumentTabRename(target as HTMLInputElement)
    return
  }

  if (target.matches('[data-edge-label-input]')) {
    commitEdgeLabelInput(target as HTMLInputElement)
    return
  }

  if (target.matches('[data-edge-color-input], [data-edge-color-hex]')) {
    edgeColorHistoryKey = null
    return
  }

  if (target.id === 'title-input') {
    hideTitleCaret(target)
  }
}

function handleKeyDown(event: KeyboardEvent): void {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLElement

  if (target.matches('[data-link-url-input]')) {
    handleInlineMarkdownLinkKeyDown(event, target as HTMLInputElement)
    return
  }

  if (target.matches('[data-template-save-input]')) {
    handleTemplateSaveKeyDown(event, target as HTMLInputElement)
    return
  }

  if (target.matches('[data-template-rename]')) {
    handleTemplateRenameKeyDown(event, target as HTMLInputElement)
    return
  }

  if (target.matches('[data-tab-rename]')) {
    handleInlineTabRenameKeyDown(event, target as HTMLInputElement)
    return
  }

  if (target.matches('[data-edge-label-input]')) {
    handleInlineEdgeLabelKeyDown(event, target as HTMLInputElement)
    return
  }

  if (target.id === 'title-input' && event.key === 'Enter') {
    event.preventDefault()
    focusFirstOutlineLine()
    return
  }

  if (!target.matches('[data-node-input]')) {
    return
  }

  const id = target.dataset.nodeId

  if (!id) {
    return
  }

  if (event.key === 'Escape' && clearSelectedNodeEditingState(target, id)) {
    event.preventDefault()
    return
  }

  if (state.view === 'mindmap' && isDeleteShortcut(event, 'mindmapDeleteOnly') && state.selectedId === id && state.status !== 'Editing') {
    event.preventDefault()
    deleteSelectedMindmapNode(true)
    return
  }

  if (state.view === 'mindmap' && isDeleteShortcut(event, 'mindmapDelete') && state.selectedId === id && state.status !== 'Editing') {
    event.preventDefault()
    deleteSelectedMindmapNode()
    return
  }

  if (
    state.view === 'list'
    && isDeleteShortcut(event, 'deleteSelectionOnly')
    && state.selectedIds.includes(id)
    && (state.selectedIds.length > 1 || state.status !== 'Editing')
  ) {
    event.preventDefault()
    deleteSelectedNodes(true)
    return
  }

  if (
    state.view === 'list'
    && isDeleteShortcut(event, 'deleteSelection')
    && state.selectedIds.includes(id)
    && (state.selectedIds.length > 1 || state.status !== 'Editing')
  ) {
    event.preventDefault()
    deleteSelectedNodes()
    return
  }

  if (isShortcut(event, 'bold')) {
    event.preventDefault()
    applyMarkdownFormat(id, '**', '**', 'bold text')
    return
  }

  if (isShortcut(event, 'italic')) {
    event.preventDefault()
    applyMarkdownFormat(id, '_', '_', 'italic text')
    return
  }

  if (isShortcut(event, 'underline')) {
    event.preventDefault()
    applyMarkdownFormat(id, '<u>', '</u>', 'underlined text')
    return
  }

  if (state.view === 'list' && (isShortcut(event, 'selectPreviousLine') || isShortcut(event, 'selectNextLine'))) {
    event.preventDefault()
    navigateOutlineSelection(id, isShortcut(event, 'selectNextLine') ? 1 : -1, false)
    return
  }

  if (state.view === 'list' && (isShortcut(event, 'extendSelectionUp') || isShortcut(event, 'extendSelectionDown'))) {
    event.preventDefault()
    navigateOutlineSelection(id, isShortcut(event, 'extendSelectionDown') ? 1 : -1, true)
    return
  }

  if (state.view === 'list' && isShortcut(event, 'newOutlineLine')) {
    event.preventDefault()
    showCommandToast('Line created')
    setDocument(insertSiblingAfter(state.document, id), id, true)
    return
  }

  if (state.view === 'list' && isShortcut(event, 'addRootOutlineLine')) {
    event.preventDefault()
    addRootOutlineLine()
    return
  }

  if (state.view === 'list' && isShortcut(event, 'lineBreak')) {
    event.preventDefault()
    insertEditorLineBreak(target, id)
    return
  }

  if (state.view === 'mindmap' && event.key === 'Enter' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault()

    if (event.shiftKey) {
      if (!canAddMindmapSibling(id)) {
        return
      }

      setDocument(insertSiblingAfter(state.document, id), id, true)
      return
    }

    insertEditorLineBreak(target, id)
    return
  }

  if (state.view === 'mindmap' && isShortcut(event, 'mindmapAddChild')) {
    event.preventDefault()
    setDocument(insertChild(state.document, id), id, true)
    return
  }

  if (state.view === 'mindmap' && isShortcut(event, 'mindmapAddSibling')) {
    event.preventDefault()
    if (!canAddMindmapSibling(id)) {
      return
    }

    setDocument(insertSiblingAfter(state.document, id), id, true)
    return
  }

  if (state.view === 'mindmap' && state.status !== 'Editing') {
    const keyboardMove = getMindmapKeyboardMove(event)

    if (keyboardMove) {
      event.preventDefault()
      moveSelectedMindmapNode(keyboardMove.dx, keyboardMove.dy)
      return
    }
  }

  if (state.view === 'list' && (isShortcut(event, 'indentLine') || isShortcut(event, 'outdentLine'))) {
    event.preventDefault()
    showCommandToast(isShortcut(event, 'outdentLine') ? 'Line outdented' : 'Line indented')
    setDocument(
      isShortcut(event, 'outdentLine')
        ? outdentNode(state.document, id)
        : indentNode(state.document, id),
      id,
      true,
    )
    return
  }

  if (isShortcut(event, 'outdentOrClearFocus')) {
    event.preventDefault()
    if (state.view === 'mindmap' && state.focusId) {
      state.focusId = null
      render()
      return
    }
    setDocument(outdentNode(state.document, id), id, true)
    return
  }

  if (isShortcut(event, 'deleteEmptyLine') && getEditableMarkdownFromElement(target).trim() === '') {
    event.preventDefault()
    setDocument(deleteNode(state.document, id))
    return
  }

  if (state.view === 'list' && state.status !== 'Editing' && isShortcut(event, 'moveLineUp')) {
    event.preventDefault()
    moveSelectedNodes(-1)
    return
  }

  if (state.view === 'list' && state.status !== 'Editing' && isShortcut(event, 'moveLineDown')) {
    event.preventDefault()
    moveSelectedNodes(1)
    return
  }

  if (isShortcut(event, 'toggleCollapse')) {
    event.preventDefault()
    setDocument(toggleNodeCollapsed(state.document, id), id, true)
  }
}

function handleGlobalKeyDown(event: KeyboardEvent): void {
  if (state.shortcutCaptureId) {
    handleShortcutCapture(event)
    return
  }

  if (event.defaultPrevented) {
    return
  }

  const typing = isTypingTarget(event.target)

  if (isShortcut(event, 'redo')) {
    event.preventDefault()
    redo()
    return
  }

  if (isShortcut(event, 'newTab')) {
    event.preventDefault()
    createNewDocumentTab()
    return
  }

  if (isShortcut(event, 'openFile')) {
    event.preventDefault()
    state.commandOpen = false
    closeFloatingPopups(false)
    void openMindmapFile()
    return
  }

  if (isShortcut(event, 'undo')) {
    event.preventDefault()
    undo()
    return
  }

  if (isShortcut(event, 'commandPalette')) {
    event.preventDefault()
    const nextCommandOpen = !state.commandOpen
    state.commandSelection = nextCommandOpen ? getCurrentNodeTextSelection() : null
    closeFloatingPopups(false)
    state.commandOpen = nextCommandOpen
    state.commandQuery = ''
    state.focusCommandAfterRender = state.commandOpen
    render()
    return
  }

  if (isShortcut(event, 'save')) {
    event.preventDefault()
    syncOpenFrontmatter()
    void saveMindmapFile()
    return
  }

  if (!typing && !state.commandOpen && isShortcut(event, 'toggleView')) {
    event.preventDefault()
    toggleView()
    return
  }

  if (!state.commandOpen && state.view === 'list' && isShortcut(event, 'addRootOutlineLine')) {
    event.preventDefault()
    addRootOutlineLine()
    return
  }

  if (
    isShortcut(event, 'closePanel')
    && (
      state.commandOpen
      || state.saveMenuOpen
      || state.settingsOpen
      || state.themeMenuOpen
      || state.templateMenuAnchor !== null
      || state.pendingLinkFrom
      || state.linkEditor
      || state.activeMarkdownLink
    )
  ) {
    event.preventDefault()
    state.commandOpen = false
    state.commandQuery = ''
    state.commandSelection = null
    state.pendingLinkFrom = null
    state.themeMenuOpen = false
    state.linkEditor = null
    state.activeMarkdownLink = null
    state.focusLinkEditorAfterRender = false
    closeFloatingPopups(false)
    render()
    return
  }

  if ((event.key === 'Escape' || isShortcut(event, 'outdentOrClearFocus')) && detachPendingEscapeNode()) {
    event.preventDefault()
    return
  }

  if (isShortcut(event, 'outdentOrClearFocus') && state.view === 'mindmap' && state.focusId) {
    event.preventDefault()
    state.focusId = null
    render()
    return
  }

  if (!typing && !state.commandOpen && state.view === 'mindmap' && isShortcut(event, 'mindmapSelectAllNodes')) {
    event.preventDefault()
    selectAllVisibleMindmapNodes()
    return
  }

  const mindmapKeyboardMove = !typing && state.view === 'mindmap' ? getMindmapKeyboardMove(event) : null

  if (!state.commandOpen && state.selectedId && mindmapKeyboardMove) {
    event.preventDefault()
    moveSelectedMindmapNode(mindmapKeyboardMove.dx, mindmapKeyboardMove.dy)
    return
  }

  if (
    !state.commandOpen
    && state.view === 'mindmap'
    && state.selectedId
    && isDeleteShortcut(event, 'mindmapDeleteOnly')
    && (!typing || state.status !== 'Editing')
  ) {
    event.preventDefault()
    deleteSelectedMindmapNode(true)
    return
  }

  if (
    !state.commandOpen
    && state.view === 'mindmap'
    && state.selectedId
    && isDeleteShortcut(event, 'mindmapDelete')
    && (!typing || state.status !== 'Editing')
  ) {
    event.preventDefault()
    deleteSelectedMindmapNode()
    return
  }

  if (!typing && state.view === 'list' && isDeleteShortcut(event, 'deleteSelectionOnly') && state.selectedIds.length > 0) {
    event.preventDefault()
    deleteSelectedNodes(true)
    return
  }

  if (!typing && state.view === 'list' && isDeleteShortcut(event, 'deleteSelection') && state.selectedIds.length > 0) {
    event.preventDefault()
    deleteSelectedNodes()
    return
  }

  if (!typing && !state.commandOpen && state.view === 'list' && isShortcut(event, 'selectAllLines')) {
    event.preventDefault()
    selectAllVisibleLines()
    return
  }

  if (!typing && !state.commandOpen && state.view === 'list' && state.selectedId && isShortcut(event, 'newOutlineLine')) {
    event.preventDefault()
    showCommandToast('Line created')
    setDocument(insertSiblingAfter(state.document, state.selectedId), state.selectedId, true)
    return
  }

  if (!typing && !state.commandOpen && state.view === 'list' && state.selectedId && isShortcut(event, 'lineBreak')) {
    event.preventDefault()
    focusNodeInputForEditing(state.selectedId)
    return
  }

  if (
    !typing
    && !state.commandOpen
    && state.view === 'list'
    && state.selectedId
    && (isShortcut(event, 'moveLineUp') || isShortcut(event, 'moveLineDown'))
  ) {
    event.preventDefault()
    moveSelectedNodes(isShortcut(event, 'moveLineUp') ? -1 : 1)
    return
  }

  if (
    !typing
    && !state.commandOpen
    && state.view === 'list'
    && state.selectedId
    && (isShortcut(event, 'selectPreviousLine') || isShortcut(event, 'selectNextLine'))
  ) {
    event.preventDefault()
    navigateOutlineSelection(state.selectedId, isShortcut(event, 'selectNextLine') ? 1 : -1, false)
    return
  }

  if (
    !typing
    && !state.commandOpen
    && state.view === 'list'
    && state.selectedId
    && (isShortcut(event, 'extendSelectionUp') || isShortcut(event, 'extendSelectionDown'))
  ) {
    event.preventDefault()
    navigateOutlineSelection(state.selectedId, isShortcut(event, 'extendSelectionDown') ? 1 : -1, true)
    return
  }

  if (
    !typing
    && !state.commandOpen
    && state.view === 'list'
    && state.selectedId
    && (isShortcut(event, 'outlineLeft') || isShortcut(event, 'outlineRight'))
  ) {
    event.preventDefault()
    navigateOutlineHierarchy(state.selectedId, isShortcut(event, 'outlineRight'))
    return
  }

  if (state.commandOpen || typing || !state.selectedId) {
    return
  }

  if (state.view === 'mindmap' && isDeleteShortcut(event, 'mindmapDeleteOnly')) {
    event.preventDefault()
    deleteSelectedMindmapNode(true)
    return
  }

  if (state.view === 'mindmap' && isDeleteShortcut(event, 'mindmapDelete')) {
    event.preventDefault()
    deleteSelectedMindmapNode()
    return
  }

  if (state.view === 'mindmap' && isShortcut(event, 'mindmapAddChild')) {
    event.preventDefault()
    showCommandToast('Child node created')
    setDocument(insertChild(state.document, state.selectedId), state.selectedId, true)
    return
  }

  if (state.view === 'mindmap' && isShortcut(event, 'mindmapAddSibling')) {
    event.preventDefault()
    if (!canAddMindmapSibling(state.selectedId)) {
      return
    }

    showCommandToast('Sibling node created')
    setDocument(insertSiblingAfter(state.document, state.selectedId), state.selectedId, true)
    return
  }

  if (state.view === 'mindmap' && isPlainEnter(event)) {
    event.preventDefault()
    focusNodeInputForEditing(state.selectedId)
    return
  }

  if (isShortcut(event, 'outdentOrClearFocus')) {
    event.preventDefault()
    setDocument(outdentNode(state.document, state.selectedId), state.selectedId, true)
  }
}

function handlePointerDown(event: PointerEvent): void {
  const target = event.target as HTMLElement

  if (!target.closest('.edge-color-popover')) {
    edgeColorHistoryKey = null
  }

  if (handleOutlinerSelectionPointerDown(event, target)) {
    return
  }

  if (target.closest('.format-toolbar')) {
    event.preventDefault()
    return
  }

  if (target.closest('.edge-color-popover')) {
    return
  }

  if (target.closest('.edge-hotspot, .edge-breakpoint-svg') || target.matches('.edge-hitbox')) {
    return
  }

  if (event.button !== 0) {
    return
  }

  const resizeHandle = target.closest<HTMLElement>('[data-canvas-resize-handle]')

  if (resizeHandle?.dataset.canvasItemId) {
    startCanvasItemResize(event, resizeHandle.dataset.canvasItemId)
    return
  }

  const canvasItem = target.closest<HTMLElement>('.canvas-item[data-canvas-item-id]')

  if (canvasItem?.dataset.canvasItemId && !target.closest('button, a, input, textarea')) {
    startCanvasItemDrag(event, canvasItem.dataset.canvasItemId)
    return
  }

  if (canvasItem) {
    return
  }

  const card = target.closest<HTMLElement>('.mind-card')

  if (card?.dataset.nodeId) {
    selectNode(card.dataset.nodeId, false)
    state.status = 'Node selected'
    updateSelectionInDom()

    if (!target.closest('[data-node-input], .format-toolbar, button, input, .node-media')) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }

      startNodeDrag(event, card.dataset.nodeId)
    }

    return
  }

  const canvas = target.closest<HTMLElement>('[data-canvas]')

  if (canvas) {
    startMindmapAreaSelection(event, canvas)
  }
}

function handlePointerUp(event: PointerEvent): void {
  handleTitleCaretEvent()

  const target = event.target as HTMLElement

  if (target.closest('.outline-row') && !target.closest('[data-node-input]')) {
    window.getSelection()?.removeAllRanges()
  }

  if (target instanceof HTMLInputElement && target.id === 'command-input') {
    collapseTextInputSelection(target)
  }
}

function handleOutlinerSelectionPointerDown(event: PointerEvent, target: HTMLElement): boolean {
  if (state.view !== 'list' || event.button !== 0) {
    return false
  }

  const row = target.closest<HTMLElement>('.outline-row')

  if (!row?.dataset.nodeId || target.closest('.format-toolbar, .node-media, input[type="range"]')) {
    return false
  }

  if (event.shiftKey) {
    event.preventDefault()
    suppressNextClick = true
    selectNodeRange(row.dataset.nodeId)
    closeFloatingPopups(false)
    return true
  }

  if (target.closest('button')) {
    return false
  }

  if (!target.closest('[data-node-input]')) {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    window.getSelection()?.removeAllRanges()
    selectNode(row.dataset.nodeId, false)
    state.status = 'Line selected'
    updateSelectionInDom()
    closeFloatingPopups(false)
  }

  pendingOutlinerSelection = {
    pointerId: event.pointerId,
    startId: row.dataset.nodeId,
    startX: event.clientX,
    startY: event.clientY,
    dragging: false,
  }

  window.addEventListener('pointermove', handleOutlinerSelectionMove)
  window.addEventListener('pointerup', handleOutlinerSelectionEnd)
  window.addEventListener('pointercancel', handleOutlinerSelectionEnd)

  return false
}

function handleOutlinerSelectionMove(event: PointerEvent): void {
  if (!pendingOutlinerSelection || event.pointerId !== pendingOutlinerSelection.pointerId) {
    return
  }

  const distance = Math.hypot(
    event.clientX - pendingOutlinerSelection.startX,
    event.clientY - pendingOutlinerSelection.startY,
  )

  if (!pendingOutlinerSelection.dragging && distance < 6) {
    return
  }

  if (!pendingOutlinerSelection.dragging) {
    pendingOutlinerSelection.dragging = true
    suppressNextClick = true
    document.body.classList.add('is-selecting-outline')

    if (document.activeElement instanceof HTMLElement && document.activeElement.matches('[data-node-input]')) {
      document.activeElement.blur()
    }
  }

  event.preventDefault()
  window.getSelection()?.removeAllRanges()

  const targetId = getOutlinerRowIdFromPoint(event.clientX, event.clientY)

  if (targetId) {
    selectDraggedNodeRange(pendingOutlinerSelection.startId, targetId)
  }
}

function handleOutlinerSelectionEnd(event: PointerEvent): void {
  if (!pendingOutlinerSelection || event.pointerId !== pendingOutlinerSelection.pointerId) {
    return
  }

  const shouldRender = pendingOutlinerSelection.dragging
  pendingOutlinerSelection = null
  document.body.classList.remove('is-selecting-outline')
  window.removeEventListener('pointermove', handleOutlinerSelectionMove)
  window.removeEventListener('pointerup', handleOutlinerSelectionEnd)
  window.removeEventListener('pointercancel', handleOutlinerSelectionEnd)

  if (shouldRender) {
    event.preventDefault()
    render()
  }
}

function getOutlinerRowIdFromPoint(clientX: number, clientY: number): string | null {
  const element = document.elementFromPoint(clientX, clientY)
  const directRow = element?.closest<HTMLElement>('.outline-row')

  if (directRow?.dataset.nodeId) {
    return directRow.dataset.nodeId
  }

  for (const row of document.querySelectorAll<HTMLElement>('.outline-row')) {
    const rect = row.getBoundingClientRect()

    if (clientY >= rect.top && clientY <= rect.bottom) {
      return row.dataset.nodeId ?? null
    }
  }

  return null
}

function handleDragStart(event: DragEvent): void {
  const target = event.target as HTMLElement
  const handle = target.closest<HTMLElement>('[data-row-drag]')

  if (!handle?.dataset.nodeId || !event.dataTransfer) {
    return
  }

  const nodeId = handle.dataset.nodeId
  draggedOutlineIds = state.selectedIds.includes(nodeId) ? [...state.selectedIds] : [nodeId]
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', draggedOutlineIds.join(','))
  document.body.classList.add('is-dragging-outline')
}

function handleDragOver(event: DragEvent): void {
  const target = event.target as HTMLElement
  const hasImageFile = [...(event.dataTransfer?.items ?? [])].some(isImageTransferItem)
  const hasLinkText = [...(event.dataTransfer?.items ?? [])].some((item) => item.kind === 'string' && (item.type === 'text/uri-list' || item.type === 'text/plain'))
  const row = target.closest<HTMLElement>('.outline-row')
  const canvas = target.closest<HTMLElement>('[data-canvas]')

  if (hasImageFile && (row || canvas)) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }
    if (row) {
      setOutlineDropClass(row, 'inside')
    }
    return
  }

  if (state.view === 'mindmap' && hasLinkText && canvas && !row && !target.closest('.mind-card, .canvas-item')) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }
    return
  }

  if (draggedOutlineIds.length > 0 && row?.dataset.nodeId && !draggedOutlineIds.includes(row.dataset.nodeId)) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
    setOutlineDropClass(row, getOutlineDropPosition(event, row))
  }
}

function handleDragLeave(event: DragEvent): void {
  const target = event.target as HTMLElement
  clearOutlineDropClasses(target.closest<HTMLElement>('.outline-row'))
}

function handleDragEnd(): void {
  draggedOutlineIds = []
  document.body.classList.remove('is-dragging-outline')
  document.querySelectorAll<HTMLElement>('.outline-row').forEach((element) => {
    clearOutlineDropClasses(element)
  })
}

function handleDrop(event: DragEvent): void {
  const target = event.target as HTMLElement
  const imageFile = [...(event.dataTransfer?.files ?? [])].find(isSupportedImageFile)
  const row = target.closest<HTMLElement>('.outline-row')
  const canvas = target.closest<HTMLElement>('[data-canvas]')
  const dropPosition = row ? getOutlineDropPosition(event, row) : 'before'

  document.querySelectorAll<HTMLElement>('.outline-row').forEach((element) => {
    clearOutlineDropClasses(element)
  })
  document.body.classList.remove('is-dragging-outline')

  if (imageFile) {
    event.preventDefault()
    void insertDroppedImage(imageFile, event, row?.dataset.nodeId ?? null)
    draggedOutlineIds = []
    return
  }

  const droppedLink = state.view === 'mindmap' && canvas && !row ? getDroppedLinkUrl(event.dataTransfer) : null

  if (droppedLink) {
    event.preventDefault()
    void addCanvasLinkAt(droppedLink, getCanvasPointFromEvent(event))
    draggedOutlineIds = []
    return
  }

  if (draggedOutlineIds.length > 0 && row?.dataset.nodeId) {
    event.preventDefault()
    reorderDraggedOutlineNodes(row.dataset.nodeId, dropPosition)
    draggedOutlineIds = []
  }
}

function handlePaste(event: ClipboardEvent): void {
  if (state.view !== 'mindmap' || isTypingTarget(event.target)) {
    return
  }

  const clipboard = event.clipboardData
  const imageFile = [...(clipboard?.files ?? [])].find(isSupportedImageFile)

  if (imageFile) {
    event.preventDefault()
    void addCanvasImageAt(imageFile, getCanvasViewportCenter())
    return
  }

  const link = extractFirstLinkUrl(clipboard?.getData('text/plain') ?? '')

  if (!link) {
    return
  }

  event.preventDefault()
  void addCanvasLinkAt(link, getCanvasViewportCenter())
}

function reorderDraggedOutlineNodes(targetId: string, position: OutlineDropPosition): void {
  const movedIds = draggedOutlineIds.filter((id) => id !== targetId)

  if (movedIds.length === 0) {
    return
  }

  pushHistory()
  state.document = moveNodesToOutlinePosition(state.document, movedIds, targetId, position)
  setSelectedNodes(movedIds, movedIds[0], movedIds[0])
  state.dirty = true
  state.status = position === 'inside' ? 'Lines indented under target' : 'Lines rearranged'
  render()
}

function getOutlineDropPosition(event: DragEvent, row: HTMLElement): OutlineDropPosition {
  const rect = row.getBoundingClientRect()
  const yRatio = (event.clientY - rect.top) / rect.height

  if (yRatio < 0.25) {
    return 'before'
  }

  if (yRatio > 0.75) {
    return 'after'
  }

  return 'inside'
}

function setOutlineDropClass(row: HTMLElement, position: OutlineDropPosition): void {
  document.querySelectorAll<HTMLElement>('.outline-row').forEach((element) => {
    if (element !== row) {
      clearOutlineDropClasses(element)
    }
  })

  clearOutlineDropClasses(row)
  row.classList.add('drop-target', `drop-${position}`)
}

function clearOutlineDropClasses(row: HTMLElement | null): void {
  row?.classList.remove('drop-target', 'drop-before', 'drop-after', 'drop-inside')
}

async function insertDroppedImage(file: File, event: DragEvent, rowNodeId: string | null): Promise<void> {
  const target = event.target as HTMLElement
  const card = target.closest<HTMLElement>('.mind-card')
  const canvas = target.closest<HTMLElement>('[data-canvas]')

  if (rowNodeId) {
    await insertImageIntoNode(file, rowNodeId)
    return
  }

  if (card?.dataset.nodeId) {
    await insertImageIntoNode(file, card.dataset.nodeId)
    return
  }

  if (state.view === 'mindmap' && canvas) {
    await addCanvasImageAt(file, getCanvasPointFromEvent(event))
    return
  }

  await insertImageIntoNode(file, state.selectedId)
}

function handleDoubleClick(event: MouseEvent): void {
  const target = event.target as HTMLElement
  const documentTab = target.closest<HTMLElement>('.document-tab')

  if (documentTab?.dataset.tabId) {
    event.preventDefault()
    renameDocumentTab(documentTab.dataset.tabId)
    return
  }

  const edgeHotspot = target.closest<HTMLElement>('.edge-hotspot')

  if (
    edgeHotspot?.dataset.edgeKind
    && edgeHotspot.dataset.edgeId
    && !target.closest('.edge-color-popover, [data-edge-label-input]')
  ) {
    event.preventDefault()
    editEdgeLabel(edgeHotspot.dataset.edgeKind as EdgeKind, edgeHotspot.dataset.edgeId)
    return
  }

  if (!target.closest('[data-canvas]') || target.closest('.mind-card, .canvas-item, button, input, textarea')) {
    return
  }

  const canvas = target.closest<HTMLElement>('[data-canvas]')

  if (!canvas) {
    return
  }

  const rect = canvas.getBoundingClientRect()
  const x = (event.clientX - rect.left - state.pan.x) / state.zoom
  const y = (event.clientY - rect.top - state.pan.y) / state.zoom
  addRootNodeAt(x, y)
}

function handleWheel(event: WheelEvent): void {
  const target = event.target as HTMLElement

  if (!target.closest('[data-canvas]')) {
    return
  }

  event.preventDefault()
  const delta = getNormalizedWheelDelta(event)
  const speed = getTrackpadSpeedMultiplier()

  if (event.ctrlKey || event.metaKey) {
    zoomAt(event.clientX, event.clientY, -delta.y * TRACKPAD_BASE_ZOOM_SCALE * speed)
    return
  }

  const deltaX = event.shiftKey && Math.abs(delta.x) < 0.01 ? delta.y : delta.x
  const deltaY = event.shiftKey ? 0 : delta.y

  state.pan = {
    x: state.pan.x - deltaX * TRACKPAD_BASE_PAN_SCALE * speed,
    y: state.pan.y - deltaY * TRACKPAD_BASE_PAN_SCALE * speed,
  }
  updateMapTransform()
}

function getNormalizedWheelDelta(event: WheelEvent): { x: number; y: number } {
  const multiplier =
    event.deltaMode === 1
      ? 16
      : event.deltaMode === 2
        ? Math.max(window.innerHeight, 1)
        : 1

  return {
    x: event.deltaX * multiplier,
    y: event.deltaY * multiplier,
  }
}

function getTrackpadSpeedMultiplier(): number {
  return Math.min(TRACKPAD_SPEED_MAX, Math.max(TRACKPAD_SPEED_MIN, state.trackpadSpeed))
}

function runNodeAction(action: string, nodeId: string): void {
  selectNode(nodeId, false)

  switch (action) {
    case 'select':
      render()
      break
    case 'toggle':
      showCommandToast('Line collapsed')
      setDocument(toggleNodeCollapsed(state.document, nodeId), nodeId)
      break
    case 'add-after':
      if (state.view === 'mindmap' && !canAddMindmapSibling(nodeId)) {
        return
      }

      showCommandToast('Line created')
      setDocument(insertSiblingAfter(state.document, nodeId), nodeId, true)
      break
    case 'add-child':
      showCommandToast('Child line created')
      setDocument(insertChild(state.document, nodeId), nodeId, true)
      break
    case 'delete':
      showCommandToast('Line deleted')
      setDocument(deleteNode(state.document, nodeId))
      break
    case 'indent':
      showCommandToast('Line indented')
      setDocument(indentNode(state.document, nodeId), nodeId, true)
      break
    case 'outdent':
      showCommandToast('Line outdented')
      setDocument(outdentNode(state.document, nodeId), nodeId, true)
      break
    case 'move-up':
      showCommandToast('Line moved up')
      setDocument(moveNode(state.document, nodeId, -1), nodeId, true)
      break
    case 'move-down':
      showCommandToast('Line moved down')
      setDocument(moveNode(state.document, nodeId, 1), nodeId, true)
      break
    case 'focus-node':
      state.focusId = state.focusId === nodeId ? null : nodeId
      render()
      break
  }
}

function isNodeAction(action: string): boolean {
  return [
    'select',
    'toggle',
    'add-after',
    'add-child',
    'delete',
    'indent',
    'outdent',
    'move-up',
    'move-down',
    'focus-node',
  ].includes(action)
}

function setDocument(documentUpdate: MindmapDocument, selectedId = state.selectedId, focusInput = false): void {
  const previousIds = new Set(Object.keys(state.document.nodes))
  const nextIds = Object.keys(documentUpdate.nodes)
  const createdId = nextIds.find((id) => !previousIds.has(id)) ?? null

  pushHistory()
  state.document = documentUpdate
  state.selectedId = createdId ?? selectedId
  state.selectedIds = state.selectedId && state.document.nodes[state.selectedId] ? [state.selectedId] : []
  state.selectionAnchorId = state.selectedId
  pendingEscapeDetachNodeId = null
  state.dirty = true
  state.status = 'Unsaved changes'
  state.focusAfterRender = focusInput ? state.selectedId : null
  render()
}

function updateNodeSubtreeBackground(id: string, color: NodeColor): void {
  if (!state.document.nodes[id]) {
    return
  }

  pushHistory()
  state.document = setNodeSubtreeColor(state.document, id, color)
  setSelectedNodes([id], id, id)
  state.activeNodeBackgroundId = id
  state.activeEdgeColor = null
  state.dirty = true
  state.status = 'Node background updated'
  showCommandToast('Node background updated')
  render()
}

function deleteSelectedNodes(preserveChildren = false): void {
  const ids = state.selectedIds.length > 0 ? state.selectedIds : state.selectedId ? [state.selectedId] : []

  if (ids.length === 0) {
    return
  }

  const visibleIds = getVisibleNodeIds(state.document, state.focusId)
  const firstIndex = ids.reduce((min, id) => {
    const index = visibleIds.indexOf(id)
    return index >= 0 ? Math.min(min, index) : min
  }, Number.POSITIVE_INFINITY)
  const documentUpdate = preserveChildren
    ? deleteNodesPreservingChildren(state.document, ids)
    : deleteNodes(state.document, ids)
  const nextVisibleIds = getVisibleNodeIds(documentUpdate, state.focusId)
  const fallbackIndex = Number.isFinite(firstIndex) ? Math.min(firstIndex, nextVisibleIds.length - 1) : 0
  const fallbackId = nextVisibleIds[fallbackIndex] ?? documentUpdate.rootId ?? documentUpdate.rootIds[0] ?? null

  pushHistory()
  state.document = documentUpdate
  setSelectedNodes(fallbackId ? [fallbackId] : [], fallbackId, fallbackId)
  state.dirty = true
  state.status = `${ids.length} ${ids.length === 1 ? 'line' : 'lines'} ${preserveChildren ? 'removed' : 'deleted'}`
  showCommandToast(state.status)
  render()
}

function deleteSelectedMindmapNode(preserveChildren = false): void {
  const ids = getSelectedExistingNodeIds()

  if (ids.length === 0) {
    return
  }

  const visibleIds = getVisibleNodeIds(state.document, state.focusId)
  const firstIndex = ids.reduce((min, id) => {
    const index = visibleIds.indexOf(id)
    return index >= 0 ? Math.min(min, index) : min
  }, Number.POSITIVE_INFINITY)
  const documentUpdate = preserveChildren
    ? deleteNodesPreservingChildren(state.document, ids)
    : deleteNodes(state.document, ids)
  const nextVisibleIds = getVisibleNodeIds(documentUpdate, state.focusId)
  const fallbackIndex = Number.isFinite(firstIndex) ? Math.min(firstIndex, nextVisibleIds.length - 1) : 0
  const fallbackId = nextVisibleIds[fallbackIndex] ?? documentUpdate.rootId ?? documentUpdate.rootIds[0] ?? null

  pushHistory()
  state.document = documentUpdate
  setSelectedNodes(fallbackId ? [fallbackId] : [], fallbackId, fallbackId)
  state.dirty = true
  state.status = `${ids.length} ${ids.length === 1 ? 'node' : 'nodes'} ${preserveChildren ? 'removed' : 'deleted'}`
  showCommandToast(state.status)
  render()
}

function getSelectedExistingNodeIds(): string[] {
  const ids = state.selectedIds.length > 0 ? state.selectedIds : state.selectedId ? [state.selectedId] : []

  return [...new Set(ids)].filter((id) => Boolean(state.document.nodes[id]))
}

function moveSelectedMindmapNode(dx: number, dy: number): void {
  if (!state.selectedId || !state.document.nodes[state.selectedId]) {
    return
  }

  const layout = computeMindmapLayout(state.document, state.focusId)
  const movedIds = getSubtreeIds(state.selectedId).filter((id) => layout.has(id))

  if (movedIds.length === 0) {
    return
  }

  const nextPositions: Record<string, { x: number; y: number }> = {}

  for (const id of movedIds) {
    const nodeLayout = layout.get(id)

    if (!nodeLayout) {
      continue
    }

    nextPositions[id] = {
      x: nodeLayout.x + dx,
      y: nodeLayout.y + dy,
    }
  }

  pushHistory()
  state.document = setNodePositions(state.document, nextPositions)
  setSelectedNodes([state.selectedId], state.selectedId, state.selectedId)
  state.dirty = true
  state.status = 'Node moved'
  showCommandToast(state.status)
  render()
}

function moveSelectedNodes(direction: -1 | 1): void {
  const ids = state.selectedIds.length > 0 ? state.selectedIds : state.selectedId ? [state.selectedId] : []

  if (ids.length === 0) {
    return
  }

  const primaryId = state.selectedId && ids.includes(state.selectedId) ? state.selectedId : ids[0] ?? null
  const documentUpdate = moveNodes(state.document, ids, direction)

  if (documentUpdate === state.document) {
    return
  }

  pushHistory()
  state.document = documentUpdate
  setSelectedNodes(ids, primaryId, state.selectionAnchorId)
  state.dirty = true
  state.status = `${ids.length} ${ids.length === 1 ? 'line' : 'lines'} moved ${direction < 0 ? 'up' : 'down'}`
  showCommandToast(state.status)
  render()

  if (primaryId) {
    scrollNodeIntoView(primaryId)
  }
}

function clearSelectedNodeEditingState(editor: HTMLElement, nodeId: string): boolean {
  if (!hasTextSelectionInside(editor)) {
    return false
  }

  window.getSelection()?.removeAllRanges()
  editor.blur()
  setSelectedNodes([], null, null)
  pendingEscapeDetachNodeId = nodeId
  state.status = 'Ready'
  updateSelectionInDom()

  return true
}

function detachPendingEscapeNode(): boolean {
  const nodeId = pendingEscapeDetachNodeId

  if (!nodeId) {
    return false
  }

  pendingEscapeDetachNodeId = null
  const node = state.document.nodes[nodeId]

  if (!node?.parentId) {
    return false
  }

  showCommandToast('Line detached')
  setDocument(outdentNode(state.document, nodeId), nodeId)

  return true
}

function focusFirstOutlineLine(): void {
  if (state.view !== 'list') {
    return
  }

  const visibleIds = getVisibleNodeIds(state.document, state.focusId)
  const firstId = visibleIds[0] ?? state.document.rootId ?? state.document.rootIds[0] ?? null

  if (!firstId) {
    return
  }

  setSelectedNodes([firstId], firstId, firstId)
  state.status = 'Line selected'
  state.focusAfterRender = firstId
  render()
}

function focusNodeInputForEditing(nodeId: string | null): boolean {
  if (!nodeId || !state.document.nodes[nodeId]) {
    return false
  }

  const input = document.querySelector<HTMLElement>(`[data-node-input][data-node-id="${cssEscape(nodeId)}"]`)

  if (!input) {
    return false
  }

  closeFloatingPopups(false)
  setSelectedNodes([nodeId], nodeId, nodeId)
  input.focus()
  moveEditableCaretToEnd(input)
  state.status = 'Editing'
  updateSelectionInDom()
  return true
}

function isPlainEnter(event: KeyboardEvent): boolean {
  return event.key === 'Enter' && !event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey
}

function selectAllVisibleLines(): void {
  const visibleIds = getVisibleNodeIds(state.document, state.focusId)

  if (visibleIds.length === 0) {
    return
  }

  setSelectedNodes(visibleIds, visibleIds[visibleIds.length - 1], visibleIds[0])
  state.status = `${visibleIds.length} lines selected`
  showCommandToast('All lines selected')
  render()
}

function selectAllVisibleMindmapNodes(): void {
  const visibleIds = getVisibleNodeIds(state.document, state.focusId)

  if (visibleIds.length === 0) {
    return
  }

  setSelectedNodes(visibleIds, visibleIds[visibleIds.length - 1], visibleIds[0])
  state.status = `${visibleIds.length} nodes selected`
  showCommandToast('All nodes selected')
  render()
}

function updateEdgeColor(kind: EdgeKind, id: string, color: string): void {
  const normalized = normalizeHexColor(color)

  if (!id || !isHexColorInput(color)) {
    return
  }

  const historyKey = `${kind}:${id}`

  if (edgeColorHistoryKey !== historyKey) {
    pushHistory()
    edgeColorHistoryKey = historyKey
  }

  state.document =
    kind === 'tree'
      ? setTreeEdgeColor(state.document, id, normalized)
      : setNodeLinkColor(state.document, id, normalized)
  state.dirty = true
  state.status = state.view === 'list' && kind === 'tree' ? 'Line color updated' : 'Edge color updated'
  updateEdgeColorInDom(kind, id, normalized)
}

function updateEdgeArrows(kind: EdgeKind, id: string, arrows: EdgeArrowMode): void {
  if (!id || !isEdgeArrowMode(arrows) || getEdgeArrows(kind, id) === arrows) {
    return
  }

  pushHistory()
  state.document =
    kind === 'tree'
      ? setTreeEdgeArrows(state.document, id, arrows)
      : setNodeLinkArrows(state.document, id, arrows)
  state.dirty = true
  state.status = 'Edge arrows updated'
  render()
}

function updateEdgeColorInDom(kind: EdgeKind, id: string, color: string): void {
  const selector = `[data-edge-kind="${cssEscape(kind)}"][data-edge-id="${cssEscape(id)}"]`
  document.querySelectorAll<SVGElement>(`.map-edges path${selector}`).forEach((path) => {
    path.style.setProperty('--edge-color', color)
  })
  document.querySelectorAll<SVGPathElement>(`.map-edges marker${selector} .edge-arrow-marker`).forEach((marker) => {
    marker.style.fill = `color-mix(in srgb, ${color} 72%, transparent)`
  })
  document.querySelectorAll<HTMLElement>(`.edge-color-popover${selector}`).forEach((popover) => {
    popover.querySelectorAll<HTMLButtonElement>('[data-action="set-edge-color"]').forEach((button) => {
      button.classList.toggle('active', normalizeHexColor(button.dataset.color ?? '') === color)
    })
    popover.querySelectorAll<HTMLInputElement>('[data-edge-color-input], [data-edge-color-hex]').forEach((input) => {
      if (input.value.toLowerCase() !== color) {
        input.value = color
      }
    })
  })
  if (kind === 'tree') {
    updateInheritedTreeEdgeColorsInDom()
  }
  updateOutlineBranchColorsInDom()
  updateDirtyIndicatorInDom()
}

function updateInheritedTreeEdgeColorsInDom(): void {
  document.querySelectorAll<SVGElement>('.map-edges path[data-edge-kind="tree"][data-edge-id]').forEach((path) => {
    const edgeId = path.dataset.edgeId

    if (edgeId) {
      path.style.setProperty('--edge-color', getInheritedTreeEdgeColor(edgeId))
    }
  })
  document.querySelectorAll<SVGPathElement>('.map-edges marker[data-edge-kind="tree"][data-edge-id] .edge-arrow-marker').forEach((marker) => {
    const edgeId = marker.closest<SVGMarkerElement>('marker')?.dataset.edgeId

    if (edgeId) {
      marker.style.fill = `color-mix(in srgb, ${getInheritedTreeEdgeColor(edgeId)} 72%, transparent)`
    }
  })
  document.querySelectorAll<SVGGElement>('.map-edges .edge-break-group[data-edge-kind="tree"][data-edge-id]').forEach((group) => {
    const edgeId = group.dataset.edgeId

    if (edgeId) {
      group.style.setProperty('--edge-color', getInheritedTreeEdgeColor(edgeId))
    }
  })
}

function updateOutlineBranchColorsInDom(): void {
  if (state.view !== 'list') {
    return
  }

  document.querySelectorAll<HTMLElement>('.outline-row[data-node-id]').forEach((row) => {
    const id = row.dataset.nodeId

    if (!id || !state.document.nodes[id]) {
      return
    }

    const depth = state.focusId ? getRelativeDepth(id, state.focusId) : getDepth(state.document, id)
    const branchStyle = getOutlineBranchStyle(id, depth)
    row.style.setProperty('--outline-branch-color', branchStyle.color)
    row.style.setProperty('--outline-title-color', branchStyle.titleColor)
    row.classList.toggle('branch-tinted', branchStyle.hasTint)
  })
}

function updateDirtyIndicatorInDom(): void {
  const saveIndicator = getSaveIndicator()
  const filePill = document.querySelector<HTMLElement>('.file-pill')
  const stateDot = document.querySelector<HTMLElement>('.state-dot')

  filePill?.classList.toggle('saved', saveIndicator.variant === 'saved')
  filePill?.classList.toggle('dirty', saveIndicator.variant === 'dirty')
  filePill?.classList.toggle('unsaved', saveIndicator.variant === 'unsaved')
  filePill?.classList.toggle('can-save', saveIndicator.canSave)
  filePill?.setAttribute('aria-label', `${saveIndicator.label}. ${saveIndicator.action}`)
  filePill?.setAttribute('title', saveIndicator.location)

  stateDot?.classList.toggle('saved', saveIndicator.variant === 'saved')
  stateDot?.classList.toggle('dirty', saveIndicator.variant === 'dirty')
  stateDot?.classList.toggle('unsaved', saveIndicator.variant === 'unsaved')
  document.querySelector<HTMLElement>('.state-dot-wrap .tooltip-label')?.replaceChildren(
    document.createTextNode(saveIndicator.label),
  )
  document.querySelector<HTMLElement>('.file-popover-status')?.replaceChildren(
    document.createTextNode(saveIndicator.detail),
  )
  document.querySelector<HTMLElement>('.file-popover-path')?.replaceChildren(
    document.createTextNode(saveIndicator.location),
  )
  document.querySelector<HTMLElement>('.file-popover-action')?.replaceChildren(
    document.createTextNode(saveIndicator.action),
  )
}

function editEdgeLabel(kind: EdgeKind, id: string): void {
  if (!getEdgeLabel(kind, id)) {
    const exists =
      kind === 'tree'
        ? Boolean(state.document.nodes[id])
        : state.document.links.some((link) => link.id === id)

    if (!exists) {
      return
    }
  }

  state.editingEdge = { kind, id }
  render()
}

function getEdgeLabel(kind: EdgeKind, id: string): string {
  return (
    kind === 'tree'
      ? state.document.nodes[id]?.edgeLabel ?? ''
      : state.document.links.find((link) => link.id === id)?.label ?? ''
  )
}

function getEdgeArrows(kind: EdgeKind, id: string): EdgeArrowMode {
  return (
    kind === 'tree'
      ? state.document.nodes[id]?.edgeArrows ?? 'none'
      : state.document.links.find((link) => link.id === id)?.arrows ?? 'none'
  )
}

function isEdgeArrowMode(value: unknown): value is EdgeArrowMode {
  return typeof value === 'string' && EDGE_ARROW_MODES.some(({ mode }) => mode === value)
}

function isNodeColor(value: unknown): value is NodeColor {
  return typeof value === 'string' && getNodeColors().includes(value as NodeColor)
}

function commitEdgeLabelInput(input: HTMLInputElement): void {
  const kind = input.dataset.edgeKind as EdgeKind | undefined
  const id = input.dataset.edgeId

  if (!kind || !id || state.editingEdge?.kind !== kind || state.editingEdge.id !== id) {
    return
  }

  commitEdgeLabel(kind, id, input.value)
}

function commitEdgeLabel(kind: EdgeKind, id: string, nextLabel: string): void {
  const currentLabel = getEdgeLabel(kind, id)
  state.editingEdge = null

  if (currentLabel.trim() === nextLabel.trim()) {
    render()
    return
  }

  pushHistory()
  state.document =
    kind === 'tree'
      ? setTreeEdgeLabel(state.document, id, nextLabel)
      : setNodeLinkLabel(state.document, id, nextLabel)
  state.dirty = true
  state.status = nextLabel.trim() ? 'Edge label updated' : 'Edge label removed'
  render()
}

function cancelEdgeLabelEdit(kind: EdgeKind, id: string): void {
  if (state.editingEdge?.kind !== kind || state.editingEdge.id !== id) {
    return
  }

  state.editingEdge = null
  render()
}

function handleInlineEdgeLabelKeyDown(event: KeyboardEvent, input: HTMLInputElement): void {
  event.stopPropagation()

  if (event.key === 'Enter') {
    event.preventDefault()
    commitEdgeLabelInput(input)
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    const kind = input.dataset.edgeKind as EdgeKind | undefined
    const id = input.dataset.edgeId

    if (kind && id) {
      cancelEdgeLabelEdit(kind, id)
    }
  }
}

function syncActiveTab(): void {
  const tab = state.tabs.find((candidate) => candidate.id === state.activeTabId)

  if (!tab) {
    return
  }

  captureOutlineScroll()
  tab.document = state.document
  tab.view = state.view
  tab.selectedId = state.selectedId
  tab.selectedIds = [...state.selectedIds]
  tab.selectionAnchorId = state.selectionAnchorId
  tab.focusId = state.focusId
  tab.dirty = state.dirty
  tab.fileName = state.fileName
  tab.fileFormat = state.fileFormat
  tab.fileHandle = state.fileHandle
  tab.zoom = state.zoom
  tab.pan = state.pan
  tab.outlineScroll = { ...state.outlineScroll }
  tab.frontmatterEnabled = state.frontmatterEnabled
  tab.frontmatterOpen = state.frontmatterOpen
  tab.frontmatterMode = state.frontmatterMode
  tab.pendingLinkFrom = state.pendingLinkFrom
  tab.imageTargetId = state.imageTargetId
  tab.historyPast = state.historyPast
  tab.historyFuture = state.historyFuture
}

function openDocumentInNewTab(
  documentUpdate: MindmapDocument,
  fileName: string,
  fileFormat: FileFormat,
  fileHandle: LocalFileHandle | null,
  status: string,
  hasFrontmatter = false,
): void {
  syncActiveTab()

  const tabId = createTabId()
  state.tabs.push({
    id: tabId,
    document: documentUpdate,
    view: documentUpdate.defaultView,
    selectedId: documentUpdate.rootId ?? documentUpdate.rootIds[0] ?? null,
    selectedIds: documentUpdate.rootId ? [documentUpdate.rootId] : documentUpdate.rootIds.slice(0, 1),
    selectionAnchorId: documentUpdate.rootId ?? documentUpdate.rootIds[0] ?? null,
    focusId: null,
    dirty: false,
    fileName,
    fileFormat,
    fileHandle,
    zoom: MAP_ZOOM_BASE,
    pan: getDefaultMapPan(documentUpdate, MAP_ZOOM_BASE),
    outlineScroll: { top: 0, left: 0 },
    frontmatterEnabled: hasFrontmatter,
    frontmatterOpen: false,
    frontmatterMode: DEFAULT_FRONTMATTER_MODE,
    pendingLinkFrom: null,
    imageTargetId: null,
    historyPast: [],
    historyFuture: [],
  })
  state.activeTabId = tabId
  replaceDocument(documentUpdate, fileName, fileFormat, fileHandle, status, hasFrontmatter)
}

function createNewDocumentTab(): void {
  openDocumentInNewTab(createNewMindmap(), getUntitledFileName(), 'mosaic', null, 'New mindmap', false)
  state.commandOpen = false
  closeFloatingPopups(false)
  showCommandToast('New tab')
  render()
}

function switchDocumentTab(tabId: string): void {
  if (tabId === state.activeTabId) {
    return
  }

  syncActiveTab()

  const tab = state.tabs.find((candidate) => candidate.id === tabId)

  if (!tab) {
    return
  }

  loadDocumentTab(tab, `Switched to ${tab.fileName}`)
  render()
}

function closeDocumentTab(tabId: string, force = false): void {
  syncActiveTab()

  const tabIndex = state.tabs.findIndex((tab) => tab.id === tabId)

  if (tabIndex < 0) {
    return
  }

  const tab = state.tabs[tabIndex]

  if (tab.dirty && !force) {
    state.pendingCloseTabId = tabId
    state.commandOpen = false
    state.saveMenuOpen = false
    state.settingsOpen = false
    state.themeMenuOpen = false
    closeTemplatesMenu()
    state.activeMarkdownLink = null
    render()
    return
  }

  if (state.tabs.length <= 1) {
    openDocumentInNewTab(createNewMindmap(), getUntitledFileName(), 'mosaic', null, 'New mindmap', false)
    state.tabs = state.tabs.filter((candidate) => candidate.id !== tab.id)
    render()
    return
  }

  const closingActiveTab = tab.id === state.activeTabId
  state.tabs.splice(tabIndex, 1)

  if (!closingActiveTab) {
    render()
    return
  }

  const nextTab = state.tabs[Math.min(tabIndex, state.tabs.length - 1)]
  loadDocumentTab(nextTab, `Closed ${tab.fileName}`)
  render()
}

function renameDocumentTab(tabId: string): void {
  syncActiveTab()

  if (!state.tabs.some((candidate) => candidate.id === tabId)) {
    return
  }

  state.editingTabId = tabId
  render()
}

function commitDocumentTabRename(input: HTMLInputElement): void {
  const tabId = input.dataset.tabId

  if (!tabId || state.editingTabId !== tabId) {
    return
  }

  const tab = state.tabs.find((candidate) => candidate.id === tabId)
  state.editingTabId = null

  if (!tab) {
    render()
    return
  }

  const nextLabel = input.value.trim()
  const currentName = getDisplayFileName(tab.fileName)

  if (!nextLabel || nextLabel === currentName) {
    render()
    return
  }

  const nextFileName = renameFileNamePreservingExtension(tab.fileName, nextLabel)
  tab.fileName = nextFileName
  tab.dirty = true

  if (tab.id === state.activeTabId) {
    state.fileName = nextFileName
    state.dirty = true
  }

  state.status = `Renamed ${getDisplayFileName(nextFileName)}`
  showCommandToast(state.status)
  render()
}

function cancelDocumentTabRename(tabId: string): void {
  if (state.editingTabId !== tabId) {
    return
  }

  state.editingTabId = null
  render()
}

function handleInlineTabRenameKeyDown(event: KeyboardEvent, input: HTMLInputElement): void {
  event.stopPropagation()

  if (event.key === 'Enter') {
    event.preventDefault()
    commitDocumentTabRename(input)
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    const tabId = input.dataset.tabId

    if (tabId) {
      cancelDocumentTabRename(tabId)
    }
  }
}

function loadDocumentTab(tab: DocumentTab, status: string): void {
  state.activeTabId = tab.id
  state.document = tab.document
  state.view = tab.view
  state.selectedId = tab.selectedId
  state.selectedIds = [...tab.selectedIds]
  state.selectionAnchorId = tab.selectionAnchorId
  state.focusId = tab.focusId
  state.dirty = tab.dirty
  state.fileName = tab.fileName
  state.fileFormat = tab.fileFormat
  state.fileHandle = tab.fileHandle
  state.zoom = tab.zoom
  state.pan = tab.pan
  state.outlineScroll = { ...tab.outlineScroll }
  state.frontmatterEnabled = tab.frontmatterEnabled
  state.frontmatterOpen = tab.frontmatterOpen
  state.frontmatterMode = tab.frontmatterMode
  state.pendingLinkFrom = tab.pendingLinkFrom
  state.imageTargetId = tab.imageTargetId
  state.historyPast = tab.historyPast
  state.historyFuture = tab.historyFuture
  state.commandQuery = ''
  state.commandOpen = false
  state.saveMenuOpen = false
  state.settingsOpen = false
  state.themeMenuOpen = false
  closeTemplatesMenu()
  state.pendingCloseTabId = null
  state.editingTabId = null
  state.editingEdge = null
  state.linkEditor = null
  state.focusLinkEditorAfterRender = false
  state.activeEdgeColor = null
  state.activeMarkdownLink = null
  state.outlineDepthControlsExpanded = false
  state.focusAfterRender = null
  state.focusCommandAfterRender = false
  state.status = status
}

function setView(view: ViewMode): void {
  if (state.view === view) {
    return
  }

  state.view = view
  if (view !== 'list') {
    state.outlineDepthControlsExpanded = false
  }
  state.status = view === 'list' ? 'Outline view active' : 'Mindmap view active'
  render()
}

function toggleView(): void {
  state.commandOpen = false
  state.commandQuery = ''
  state.commandSelection = null
  closeFloatingPopups(false)
  setView(state.view === 'list' ? 'mindmap' : 'list')
}

function setStatus(status: string): void {
  state.status = status
  showCommandToast(status)
  render()
}

function showCommandToast(message: string): void {
  if (!state.commandToastEnabled || !message || message === 'Ready' || message === 'Editing') {
    return
  }

  const id = nextCommandToastId
  nextCommandToastId += 1
  state.commandToast = { id, message }

  if (commandToastTimer) {
    window.clearTimeout(commandToastTimer)
  }

  commandToastTimer = window.setTimeout(() => {
    if (state.commandToast?.id === id) {
      state.commandToast = null
      render()
    }
  }, 1800)
}

function selectNode(id: string, rerender = true): void {
  if (!state.document.nodes[id]) {
    return
  }

  setSelectedNodes([id], id, id)

  if (rerender) {
    render()
  }
}

function setSelectedNodes(
  ids: string[],
  primaryId: string | null = ids[ids.length - 1] ?? null,
  anchorId: string | null = primaryId,
): void {
  const uniqueIds = [...new Set(ids)].filter((id) => Boolean(state.document.nodes[id]))
  const validPrimaryId = primaryId && state.document.nodes[primaryId] ? primaryId : uniqueIds[uniqueIds.length - 1] ?? null

  if (uniqueIds.length > 0) {
    pendingEscapeDetachNodeId = null
  }

  state.selectedIds = uniqueIds
  state.selectedId = validPrimaryId
  state.selectionAnchorId = anchorId && state.document.nodes[anchorId] ? anchorId : validPrimaryId
}

function shouldClearOutlineSelectionOnClick(target: HTMLElement): boolean {
  if (state.view !== 'list' || target.closest('.outline-row')) {
    return false
  }

  if (target.closest('.top-toolbar, .command-panel, .popup-menu, .markdown-link-popover, .edge-color-popover')) {
    return false
  }

  return Boolean(target.closest('.canvas-stage') || target.closest('.outliner-page'))
}

function clearOutlineSelectionFromBackgroundClick(target: HTMLElement): void {
  const hadSelection = state.selectedId !== null || state.selectedIds.length > 0
  const preserveTargetFocus = Boolean(target.closest('#title-input, input, textarea, [contenteditable="true"]'))
  const focusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
  const shouldBlurFocusedElement =
    !preserveTargetFocus
    && Boolean(focusedElement?.closest('[data-node-input], #title-input, input, textarea'))

  if (!hadSelection && !shouldBlurFocusedElement) {
    return
  }

  if (shouldBlurFocusedElement && focusedElement && rootElement?.contains(focusedElement)) {
    focusedElement.blur()
  }

  if (!preserveTargetFocus) {
    window.getSelection()?.removeAllRanges()
  }

  setSelectedNodes([], null, null)
  pendingEscapeDetachNodeId = null
  state.status = 'Selection cleared'

  if (shouldBlurFocusedElement) {
    render()
    return
  }

  updateSelectionInDom()
}

function clearCanvasSelection(): void {
  const hadSelection = state.selectedId !== null || state.selectedIds.length > 0
  const focusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
  const hadFocusedEditor = Boolean(focusedElement?.closest('[data-node-input], #title-input, input, textarea'))

  if (focusedElement && rootElement?.contains(focusedElement)) {
    focusedElement.blur()
  }

  window.getSelection()?.removeAllRanges()
  setSelectedNodes([], null, null)
  pendingEscapeDetachNodeId = null
  state.status = 'Selection cleared'

  if (hadSelection || hadFocusedEditor) {
    render()
    return
  }

  updateSelectionInDom()
}

function selectMindmapNodeNearPoint(clientX: number, clientY: number): boolean {
  if (state.view !== 'mindmap') {
    return false
  }

  const nodeId = getMindmapNodeNearPoint(clientX, clientY)

  if (!nodeId) {
    return false
  }

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }

  window.getSelection()?.removeAllRanges()
  setSelectedNodes([nodeId], nodeId, nodeId)
  state.status = 'Node selected'
  updateSelectionInDom()
  return true
}

function getMindmapNodeNearPoint(clientX: number, clientY: number): string | null {
  let closest: { id: string; distance: number } | null = null

  for (const card of document.querySelectorAll<HTMLElement>('.mind-card[data-node-id]')) {
    const id = card.dataset.nodeId

    if (!id) {
      continue
    }

    const rect = card.getBoundingClientRect()

    if (
      clientX < rect.left - MAP_CLICK_HIT_SLOP
      || clientX > rect.right + MAP_CLICK_HIT_SLOP
      || clientY < rect.top - MAP_CLICK_HIT_SLOP
      || clientY > rect.bottom + MAP_CLICK_HIT_SLOP
    ) {
      continue
    }

    const dx = clientX < rect.left ? rect.left - clientX : clientX > rect.right ? clientX - rect.right : 0
    const dy = clientY < rect.top ? rect.top - clientY : clientY > rect.bottom ? clientY - rect.bottom : 0
    const distance = Math.hypot(dx, dy)

    if (distance <= MAP_CLICK_HIT_SLOP && (!closest || distance < closest.distance)) {
      closest = { id, distance }
    }
  }

  return closest?.id ?? null
}

function getTreeEdgeNearPoint(clientX: number, clientY: number): string | null {
  const mapPoint = getMapPointFromClient(clientX, clientY)

  if (!mapPoint) {
    return null
  }

  const maxDistance = MAP_EDGE_CLICK_HIT_SLOP / Math.max(state.zoom, 0.1)
  let closest: { childId: string; distance: number } | null = null

  for (const edge of collectMapEdges(getRenderedMapLayout())) {
    if (edge.kind !== 'tree') {
      continue
    }

    const distance = getDistanceToEdge(mapPoint, edge)

    if (distance <= maxDistance && (!closest || distance < closest.distance)) {
      closest = { childId: edge.id, distance }
    }
  }

  return closest?.childId ?? null
}

function getMapPointFromClient(clientX: number, clientY: number): { x: number; y: number } | null {
  const canvas = document.querySelector<HTMLElement>('[data-canvas]')

  if (!canvas) {
    return null
  }

  const rect = canvas.getBoundingClientRect()

  return {
    x: (clientX - rect.left - state.pan.x) / state.zoom,
    y: (clientY - rect.top - state.pan.y) / state.zoom,
  }
}

function openEdgeColorPopover(kind: EdgeKind, id: string): void {
  if (!id) {
    return
  }

  state.saveMenuOpen = false
  state.settingsOpen = false
  state.themeMenuOpen = false
  closeTemplatesMenu()
  state.activeMarkdownLink = null
  state.activeNodeBackgroundId = null
  state.activeEdgeColor = { kind, id }
  removeMenuPopupsFromDom()
  render()
}

function updateEdgePopoverInDom(): void {
  document.querySelectorAll<HTMLElement>('.edge-hotspot.open').forEach((element) => {
    element.classList.remove('open')
  })
  document.querySelectorAll<HTMLElement>('.edge-color-popover.floating').forEach((element) => {
    element.remove()
  })

  if (!state.activeEdgeColor) {
    return
  }

  const selector = `.edge-hotspot[data-edge-kind="${cssEscape(state.activeEdgeColor.kind)}"][data-edge-id="${cssEscape(state.activeEdgeColor.id)}"]`
  document.querySelector<HTMLElement>(selector)?.classList.add('open')
}

function selectNodeRange(targetId: string, shouldRender = true): void {
  const visibleIds = getVisibleNodeIds(state.document, state.focusId)
  const anchorId =
    state.selectionAnchorId && visibleIds.includes(state.selectionAnchorId)
      ? state.selectionAnchorId
      : state.selectedId && visibleIds.includes(state.selectedId)
        ? state.selectedId
        : targetId

  setSelectedNodes(getVisibleRangeIds(anchorId, targetId), targetId, anchorId)
  state.status = `${state.selectedIds.length} lines selected`

  if (shouldRender) {
    render()
    return
  }

  updateSelectionInDom()
}

function navigateOutlineSelection(fromId: string, direction: -1 | 1, extendSelection: boolean): void {
  const visibleIds = getVisibleNodeIds(state.document, state.focusId)
  const currentIndex = visibleIds.indexOf(fromId)

  if (currentIndex < 0) {
    return
  }

  const targetIndex = Math.min(visibleIds.length - 1, Math.max(0, currentIndex + direction))
  const targetId = visibleIds[targetIndex]

  if (!targetId || targetId === fromId) {
    return
  }

  if (extendSelection) {
    const anchorId =
      state.selectionAnchorId && visibleIds.includes(state.selectionAnchorId)
        ? state.selectionAnchorId
        : fromId
    setSelectedNodes(getVisibleRangeIds(anchorId, targetId), targetId, anchorId)
    state.status = `${state.selectedIds.length} lines selected`
  } else {
    setSelectedNodes([targetId], targetId, targetId)
    state.status = 'Line selected'
  }

  render()
  scrollNodeIntoView(targetId)
}

function navigateOutlineHierarchy(id: string, expandOrEnter: boolean): void {
  const node = state.document.nodes[id]

  if (!node) {
    return
  }

  if (expandOrEnter) {
    if (node.children.length > 0 && node.collapsed) {
      setDocument(toggleNodeCollapsed(state.document, id), id)
      return
    }

    const firstChildId = node.children.find((childId) => Boolean(state.document.nodes[childId]))

    if (firstChildId) {
      setSelectedNodes([firstChildId], firstChildId, firstChildId)
      state.status = 'Line selected'
      render()
      scrollNodeIntoView(firstChildId)
    }

    return
  }

  if (node.children.length > 0 && !node.collapsed) {
    setDocument(toggleNodeCollapsed(state.document, id), id)
    return
  }

  if (node.parentId && state.document.nodes[node.parentId]) {
    setSelectedNodes([node.parentId], node.parentId, node.parentId)
    state.status = 'Line selected'
    render()
    scrollNodeIntoView(node.parentId)
  }
}

function selectDraggedNodeRange(startId: string, targetId: string): void {
  setSelectedNodes(getVisibleRangeIds(startId, targetId), targetId, startId)
  state.status = `${state.selectedIds.length} lines selected`
  updateSelectionInDom()
}

function getVisibleRangeIds(startId: string, endId: string): string[] {
  const visibleIds = getVisibleNodeIds(state.document, state.focusId)
  const startIndex = visibleIds.indexOf(startId)
  const endIndex = visibleIds.indexOf(endId)

  if (startIndex < 0 || endIndex < 0) {
    return state.document.nodes[endId] ? [endId] : []
  }

  const from = Math.min(startIndex, endIndex)
  const to = Math.max(startIndex, endIndex)

  return visibleIds.slice(from, to + 1)
}

function scrollNodeIntoView(id: string): void {
  requestAnimationFrame(() => {
    document
      .querySelector<HTMLElement>(`.outline-row[data-node-id="${cssEscape(id)}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  })
}

function pushHistory(): void {
  state.historyPast.push({
    document: cloneDocument(state.document),
    selectedId: state.selectedId,
    selectedIds: [...state.selectedIds],
    frontmatterEnabled: state.frontmatterEnabled,
  })

  if (state.historyPast.length > 120) {
    state.historyPast.shift()
  }

  state.historyFuture = []
}

function undo(): void {
  const previous = state.historyPast.pop()

  if (!previous) {
    return
  }

  state.historyFuture.push({
    document: cloneDocument(state.document),
    selectedId: state.selectedId,
    selectedIds: [...state.selectedIds],
    frontmatterEnabled: state.frontmatterEnabled,
  })
  restoreSnapshot(previous, 'Undo')
}

function redo(): void {
  const next = state.historyFuture.pop()

  if (!next) {
    return
  }

  state.historyPast.push({
    document: cloneDocument(state.document),
    selectedId: state.selectedId,
    selectedIds: [...state.selectedIds],
    frontmatterEnabled: state.frontmatterEnabled,
  })
  restoreSnapshot(next, 'Redo')
}

function restoreSnapshot(snapshot: HistorySnapshot, status: string): void {
  state.document = cloneDocument(snapshot.document)
  state.selectedId = snapshot.selectedId
  state.selectedIds = snapshot.selectedIds.filter((id) => Boolean(state.document.nodes[id]))
  if (state.selectedIds.length === 0 && state.selectedId && state.document.nodes[state.selectedId]) {
    state.selectedIds = [state.selectedId]
  }
  state.selectionAnchorId = state.selectedId
  state.frontmatterEnabled = snapshot.frontmatterEnabled
  state.dirty = true
  state.status = status
  showCommandToast(status)
  state.editingTabId = null
  state.editingEdge = null
  state.linkEditor = null
  state.activeMarkdownLink = null
  state.activeNodeBackgroundId = null
  state.focusLinkEditorAfterRender = false
  state.focusAfterRender = state.selectedId
  render()
}

function replaceDocument(
  documentUpdate: MindmapDocument,
  fileName: string,
  fileFormat: FileFormat,
  fileHandle: LocalFileHandle | null,
  status: string,
  hasFrontmatter = false,
): void {
  state.document = documentUpdate
  state.view = documentUpdate.defaultView
  state.selectedId = documentUpdate.rootId ?? documentUpdate.rootIds[0] ?? null
  state.selectedIds = state.selectedId ? [state.selectedId] : []
  state.selectionAnchorId = state.selectedId
  state.focusId = null
  state.commandQuery = ''
  state.fileName = fileName
  state.fileFormat = fileFormat
  state.fileHandle = fileHandle
  state.dirty = false
  state.status = status
  state.zoom = MAP_ZOOM_BASE
  state.pan = getDefaultMapPan(documentUpdate, MAP_ZOOM_BASE)
  state.outlineScroll = { top: 0, left: 0 }
  state.saveMenuOpen = false
  state.settingsOpen = false
  state.themeMenuOpen = false
  closeTemplatesMenu()
  state.editingTabId = null
  state.editingEdge = null
  state.linkEditor = null
  state.activeMarkdownLink = null
  state.focusLinkEditorAfterRender = false
  state.frontmatterOpen = false
  state.frontmatterEnabled = hasFrontmatter
  state.frontmatterMode = DEFAULT_FRONTMATTER_MODE
  state.pendingLinkFrom = null
  state.imageTargetId = null
  state.historyPast = []
  state.historyFuture = []
  syncActiveTab()
}

async function openMindmapFile(): Promise<void> {
  const pickerWindow = window as FilePickerWindow

  try {
    if (pickerWindow.showOpenFilePicker) {
      const [handle] = await pickerWindow.showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: 'Mosaic, Markdown, or JSON files',
            accept: {
              'application/octet-stream': [MOSAIC_FILE_EXTENSION],
              'text/markdown': ['.md'],
              'application/json': ['.json'],
            },
          },
        ],
      })
      const file = await handle.getFile()
      await loadFile(file, handle)
      return
    }

    document.querySelector<HTMLInputElement>('#file-input')?.click()
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Open canceled')
  }
}

async function loadFile(file: File, handle: LocalFileHandle | null): Promise<void> {
  if (isMosaicFileName(file.name)) {
    const documentUpdate = await parseMosaicFile(file)
    openDocumentInNewTab(documentUpdate, file.name, 'mosaic', handle, 'File loaded', hasFileProperties(documentUpdate))
    render()
    return
  }

  const source = await file.text()
  const imported = parseImportFile(file.name, source)
  openDocumentInNewTab(imported.document, getMosaicFileName(file.name), 'mosaic', null, imported.status, imported.hasFrontmatter)
  render()
}

function parseImportFile(fileName: string, source: string): { document: MindmapDocument; hasFrontmatter: boolean; status: string } {
  if (isJsonFileName(fileName) || source.trimStart().startsWith('{')) {
    const documentUpdate = parseMindmapJson(source)

    return {
      document: documentUpdate,
      hasFrontmatter: hasFileProperties(documentUpdate),
      status: 'JSON imported as Mosaic',
    }
  }

  if (isMarkdownFileName(fileName)) {
    const documentUpdate = parseMindmapMarkdown(source)

    return {
      document: documentUpdate,
      hasFrontmatter: hasFileProperties(documentUpdate),
      status: 'Markdown imported as Mosaic',
    }
  }

  throw new Error('Mosaic can open .mosaic, .md, or .json files')
}

function hasFileProperties(documentUpdate: MindmapDocument): boolean {
  return (documentUpdate.fileProperties ?? []).length > 0
}

async function saveMindmapFile(): Promise<void> {
  await persistMindmapFile(false)
}

async function persistMindmapFile(isAutoSave: boolean): Promise<void> {
  syncOpenFrontmatter()
  const fileContent = createMosaicPackageBlob(state.document)

  try {
    if (state.fileHandle) {
      await writeHandle(state.fileHandle, fileContent)
      state.dirty = false
      setStatus(isAutoSave ? 'Autosaved' : 'File saved')
      return
    }

    if (isAutoSave) {
      return
    }

    const pickerWindow = window as FilePickerWindow

    if (pickerWindow.showSaveFilePicker) {
      const handle = await pickerWindow.showSaveFilePicker({
        suggestedName: getSuggestedSaveName(),
        types: [
          {
            description: 'Mosaic file',
            accept: {
              'application/octet-stream': [MOSAIC_FILE_EXTENSION],
            },
          },
        ],
      })
      await writeHandle(handle, fileContent)
      state.fileHandle = handle
      state.fileName = handle.name
      state.fileFormat = 'mosaic'
      state.dirty = false
      setStatus('File saved')
      return
    }

    setStatus('Save unavailable in this environment. Use Export to download a copy.')
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Save canceled')
  }
}

async function copyFullMarkdown(): Promise<void> {
  syncOpenFrontmatter()

  try {
    await copyToClipboard(serializeCurrentMarkdown())
    setStatus('Markdown copied')
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Copy failed')
  }
}

function exportSettingsJson(): void {
  const payload: SettingsExportPayload = {
    version: 1,
    settings: {
      theme: state.theme,
      outlineWidth: state.outlineWidth,
      defaultImageWidth: state.defaultImageWidth,
      imagePlacement: state.imagePlacement,
      trackpadSpeed: state.trackpadSpeed,
      defaultExportFormat: state.defaultExportFormat,
      autoSaveSeconds: state.autoSaveSeconds,
      commandToastEnabled: state.commandToastEnabled,
      starterDismissed: state.starterDismissed,
      customTemplates: state.customTemplates,
      builtInTemplates: state.builtInTemplates,
      shortcuts: state.shortcuts,
    },
  }

  downloadText('mosaic-settings.json', `${JSON.stringify(payload, null, 2)}\n`, 'application/json')
  setStatus('Settings exported')
}

async function importSettingsJson(file: File): Promise<void> {
  try {
    applyImportedSettings(JSON.parse(await file.text()) as unknown)
    setStatus('Settings imported')
    render()
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Settings import failed')
  }
}

function applyImportedSettings(payload: unknown): void {
  const source = getSettingsSource(payload)

  if (!source) {
    throw new Error('Invalid settings JSON')
  }

  if (isThemeMode(source.theme)) {
    state.theme = source.theme
    localStorage.setItem('mosaic-theme', source.theme)
  }

  if (typeof source.outlineWidth === 'number') {
    updateOutlineWidth(source.outlineWidth)
  }

  if (typeof source.defaultImageWidth === 'number') {
    updateDefaultImageWidth(source.defaultImageWidth)
  }

  if (isImagePlacement(source.imagePlacement)) {
    state.imagePlacement = source.imagePlacement
    localStorage.setItem('mosaic-image-placement', source.imagePlacement)
  }

  if (typeof source.trackpadSpeed === 'number') {
    updateTrackpadSpeed(source.trackpadSpeed)
  }

  if (isExportFormat(source.defaultExportFormat)) {
    state.defaultExportFormat = source.defaultExportFormat
    localStorage.setItem('mosaic-default-export-format', source.defaultExportFormat)
  }

  if (typeof source.autoSaveSeconds === 'number') {
    updateAutoSaveSeconds(source.autoSaveSeconds)
  }

  if (typeof source.commandToastEnabled === 'boolean') {
    updateCommandToastEnabled(source.commandToastEnabled)
  }

  if (typeof source.starterDismissed === 'boolean') {
    state.starterDismissed = source.starterDismissed
    localStorage.setItem(STARTER_DISMISSED_STORAGE_KEY, source.starterDismissed ? 'true' : 'false')
  }

  if (Array.isArray(source.customTemplates)) {
    state.customTemplates = parseTemplates(source.customTemplates)
    saveCustomTemplates()
  }

  if (Array.isArray(source.builtInTemplates)) {
    state.builtInTemplates = parseTemplates(source.builtInTemplates)
    saveBuiltInTemplates()
  }

  if (isRecord(source.shortcuts)) {
    const nextShortcuts = { ...state.shortcuts }

    for (const shortcut of SHORTCUT_DEFINITIONS) {
      const combo = source.shortcuts[shortcut.id]

      if (typeof combo === 'string') {
        nextShortcuts[shortcut.id] = normalizeShortcutCombo(combo)
      }
    }

    state.shortcuts = nextShortcuts
    saveShortcuts()
  }

  state.shortcutCaptureId = null
  state.shortcutConflictMessage = ''
  scheduleAutoSave()
}

function addRootNode(): void {
  const targetId = state.document.rootIds[state.document.rootIds.length - 1] ?? state.document.rootId
  const documentUpdate = targetId && state.document.nodes[targetId]
    ? insertSiblingAfter(state.document, targetId, 'New root')
    : insertRootNode(state.document, 'New root')
  const createdId = Object.keys(documentUpdate.nodes).find((id) => !state.document.nodes[id])

  if (createdId) {
    documentUpdate.nodes[createdId].parentId = null
  }

  setDocument(documentUpdate, createdId ?? targetId ?? null, true)
}

function addRootOutlineLine(): void {
  const targetId = state.document.rootIds[state.document.rootIds.length - 1] ?? state.document.rootId

  if (!targetId || !state.document.nodes[targetId]) {
    showCommandToast('Line created')
    state.focusId = null
    setDocument(insertRootNode(state.document), null, true)
    return
  }

  showCommandToast('Line created')
  state.focusId = null
  setDocument(insertSiblingAfter(state.document, targetId), targetId, true)
}

function focusFirstStarterNode(): void {
  const rootId = state.document.rootId ?? state.document.rootIds[0]

  if (!rootId || !state.document.nodes[rootId]) {
    return
  }

  closeFloatingPopups(false)
  state.focusId = null
  state.selectedId = rootId
  state.selectedIds = [rootId]
  state.selectionAnchorId = rootId
  state.focusAfterRender = rootId
  render()
}

function dismissStarterEmptyState(options: { render?: boolean } = {}): void {
  const shouldRender = options.render ?? true
  state.starterDismissed = true
  localStorage.setItem(STARTER_DISMISSED_STORAGE_KEY, 'true')
  if (state.templateMenuAnchor === 'starter') {
    closeTemplatesMenu()
  }

  if (shouldRender) {
    render()
    return
  }

  document.querySelectorAll<HTMLElement>('.starter-empty-state').forEach((element) => {
    element.remove()
  })
}

function openTemplateSaveForm(): void {
  const sourceId = state.selectedId && state.document.nodes[state.selectedId]
    ? state.selectedId
    : state.document.rootId ?? state.document.rootIds[0] ?? null
  const sourceNode = sourceId ? state.document.nodes[sourceId] : null

  if (!sourceId || !sourceNode || getEditableMarkdown(sourceNode.markdown).trim().length === 0) {
    setStatus('Add content before saving a template')
    return
  }

  state.templateSaveOpen = true
  state.templateSaveDraft = stripMarkdown(sourceNode.markdown) || 'Custom template'
  state.editingTemplateId = null
  state.editingTemplateSource = null
  state.templateRenameDraft = ''
  state.focusTemplateSaveAfterRender = true
  render()
}

function closeTemplateSaveForm(): void {
  state.templateSaveOpen = false
  state.templateSaveDraft = ''
  state.focusTemplateSaveAfterRender = false
  render()
}

function saveCustomTemplateFromForm(): void {
  const sourceId = state.selectedId && state.document.nodes[state.selectedId]
    ? state.selectedId
    : state.document.rootId ?? state.document.rootIds[0] ?? null
  const sourceNode = sourceId ? state.document.nodes[sourceId] : null
  const label = state.templateSaveDraft.trim()

  if (!sourceId || !sourceNode || getEditableMarkdown(sourceNode.markdown).trim().length === 0) {
    setStatus('Add content before saving a template')
    return
  }

  if (!label) {
    state.focusTemplateSaveAfterRender = true
    render()
    return
  }

  const template: MindmapTemplate = {
    id: createCustomTemplateId(label),
    label,
    root: createTemplateNodeFromDocument(sourceId),
  }

  state.customTemplates = [template, ...state.customTemplates]
  state.templateSaveOpen = false
  state.templateSaveDraft = ''
  state.focusTemplateSaveAfterRender = false
  saveCustomTemplates()
  state.status = 'Template saved'
  showCommandToast('Template saved')
  render()
}

function handleTemplateSaveKeyDown(event: KeyboardEvent, input: HTMLInputElement): void {
  event.stopPropagation()

  if (event.key === 'Enter') {
    event.preventDefault()
    state.templateSaveDraft = input.value
    saveCustomTemplateFromForm()
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeTemplateSaveForm()
  }
}

function startTemplateRename(source: TemplateSource, id: string): void {
  const template = getMindmapTemplate(id, source)

  if (!template) {
    return
  }

  state.editingTemplateId = id
  state.editingTemplateSource = source
  state.templateRenameDraft = template.label
  state.templateSaveOpen = false
  state.templateSaveDraft = ''
  state.focusTemplateRenameAfterRender = id
  render()
}

function handleTemplateRenameKeyDown(event: KeyboardEvent, input: HTMLInputElement): void {
  event.stopPropagation()

  if (event.key === 'Enter') {
    event.preventDefault()
    if (isTemplateSource(input.dataset.templateSource)) {
      commitTemplateRename(input.dataset.templateSource, input.dataset.templateId ?? '', input.value)
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    cancelTemplateRename()
  }
}

function commitTemplateRename(source: TemplateSource, id: string, rawLabel: string): void {
  const label = rawLabel.trim()

  if (!id || !label) {
    cancelTemplateRename()
    return
  }

  if (source === 'custom') {
    state.customTemplates = renameTemplateInList(state.customTemplates, id, label)
    saveCustomTemplates()
  } else {
    state.builtInTemplates = renameTemplateInList(state.builtInTemplates, id, label)
    saveBuiltInTemplates()
  }

  state.editingTemplateId = null
  state.editingTemplateSource = null
  state.templateRenameDraft = ''
  state.focusTemplateRenameAfterRender = null
  render()
}

function cancelTemplateRename(): void {
  state.editingTemplateId = null
  state.editingTemplateSource = null
  state.templateRenameDraft = ''
  state.focusTemplateRenameAfterRender = null
  render()
}

function renameTemplateInList(templates: MindmapTemplate[], id: string, label: string): MindmapTemplate[] {
  return templates.map((template) =>
    template.id === id ? { ...template, label } : template,
  )
}

function applyMindmapTemplate(id: string, source: TemplateSource, target: TemplateApplyTarget = 'current'): void {
  const template = getMindmapTemplate(id, source)
  const rootId = state.document.rootId ?? state.document.rootIds[0]

  if (!template) {
    return
  }

  if (target === 'newTab') {
    closeFloatingPopups(false)
    openDocumentInNewTab(createDocumentFromTemplate(template), getUntitledFileName(), 'mosaic', null, `Template applied: ${template.label}`, false)
    showCommandToast('Template applied')
    render()
    return
  }

  let documentUpdate = state.document
  let selectedId: string | null = null

  if (rootId && state.document.nodes[rootId] && isStarterDocument()) {
    documentUpdate = updateNodeMarkdown(documentUpdate, rootId, template.root.markdown)
    documentUpdate = insertTemplateChildren(documentUpdate, rootId, template.root.children)
    selectedId = rootId
  } else {
    const beforeIds = new Set(Object.keys(documentUpdate.nodes))
    documentUpdate = insertRootNode(documentUpdate, template.root.markdown)
    selectedId = getCreatedNodeId(beforeIds, documentUpdate)

    if (selectedId) {
      documentUpdate = insertTemplateChildren(documentUpdate, selectedId, template.root.children)
    }
  }

  state.focusId = null
  closeTemplatesMenu()
  closeFloatingPopups(false)
  setDocument(documentUpdate, selectedId, true)
}

function createDocumentFromTemplate(template: MindmapTemplate): MindmapDocument {
  let documentUpdate = createNewMindmap()
  let rootId: string | null = documentUpdate.rootId ?? documentUpdate.rootIds[0] ?? null

  if (!rootId || !documentUpdate.nodes[rootId]) {
    const beforeIds = new Set(Object.keys(documentUpdate.nodes))
    documentUpdate = insertRootNode(documentUpdate, template.root.markdown)
    rootId = getCreatedNodeId(beforeIds, documentUpdate)
  } else {
    documentUpdate = updateNodeMarkdown(documentUpdate, rootId, template.root.markdown)
  }

  return rootId
    ? insertTemplateChildren(documentUpdate, rootId, template.root.children)
    : documentUpdate
}

function removeTemplate(source: TemplateSource, id: string): void {
  const templates = source === 'custom' ? state.customTemplates : state.builtInTemplates
  const nextTemplates = templates.filter((template) => template.id !== id)

  if (nextTemplates.length === templates.length) {
    return
  }

  if (source === 'custom') {
    state.customTemplates = nextTemplates
    saveCustomTemplates()
  } else {
    state.builtInTemplates = nextTemplates
    saveBuiltInTemplates()
  }

  if (state.editingTemplateId === id && state.editingTemplateSource === source) {
    state.editingTemplateId = null
    state.editingTemplateSource = null
    state.templateRenameDraft = ''
    state.focusTemplateRenameAfterRender = null
  }

  state.status = 'Template deleted'
  showCommandToast('Template deleted')
  render()
}

function getMindmapTemplate(id: string, source: TemplateSource): MindmapTemplate | null {
  const templates = source === 'builtin' ? state.builtInTemplates : state.customTemplates

  return templates.find((template) => template.id === id) ?? null
}

function insertTemplateChildren(
  documentUpdate: MindmapDocument,
  parentId: string,
  children: TemplateNode[],
): MindmapDocument {
  return children.reduce((nextDocument, templateNode) => {
    const beforeIds = new Set(Object.keys(nextDocument.nodes))
    const withChild = insertChild(nextDocument, parentId, templateNode.markdown)
    const createdId = getCreatedNodeId(beforeIds, withChild)

    return createdId
      ? insertTemplateChildren(withChild, createdId, templateNode.children)
      : withChild
  }, documentUpdate)
}

function getCreatedNodeId(previousIds: Set<string>, documentUpdate: MindmapDocument): string | null {
  return Object.keys(documentUpdate.nodes).find((id) => !previousIds.has(id)) ?? null
}

function createTemplateNodeFromDocument(id: string): TemplateNode {
  const node = state.document.nodes[id]

  if (!node) {
    return createTemplateNode('Untitled')
  }

  return {
    markdown: node.markdown,
    children: node.children.map(createTemplateNodeFromDocument),
  }
}

function createCustomTemplateId(label: string): string {
  const base = `custom-${slugifyFilePropertyKey(label) || 'template'}`
  const ids = new Set(state.customTemplates.map((template) => template.id))
  let candidate = base
  let suffix = 2

  while (ids.has(candidate)) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }

  return candidate
}

function isTemplateSource(value: string | undefined): value is TemplateSource {
  return value === 'builtin' || value === 'custom'
}

function isTemplateApplyTarget(value: string | undefined): value is TemplateApplyTarget {
  return value === 'current' || value === 'newTab'
}

function addRootNodeAt(x: number, y: number): void {
  const targetId = state.document.rootIds[state.document.rootIds.length - 1] ?? state.document.rootId
  const position = { x: Math.round(x), y: Math.round(y) }
  const documentUpdate = targetId && state.document.nodes[targetId]
    ? insertSiblingAfter(state.document, targetId, 'New central node')
    : insertRootNode(state.document, 'New central node', position)
  const createdId = Object.keys(documentUpdate.nodes).find((id) => !state.document.nodes[id])

  if (!createdId) {
    return
  }

  documentUpdate.nodes[createdId].parentId = null
  documentUpdate.nodes[createdId].position = position
  setDocument(documentUpdate, createdId, true)
}

function breakTreeEdge(childId: string): void {
  const node = state.document.nodes[childId]

  if (!node?.parentId) {
    return
  }

  const layout = getRenderedMapLayout()
  const positions: Record<string, { x: number; y: number }> = {}

  for (const id of getSubtreeIds(childId)) {
    const nodeLayout = layout.get(id)

    if (nodeLayout) {
      positions[id] = {
        x: nodeLayout.x,
        y: nodeLayout.y,
      }
    }
  }

  pushHistory()
  state.document = setNodePositions(detachNodeAsRoot(state.document, childId), positions)
  state.focusId = null
  state.editingEdge = null
  state.activeEdgeColor = null
  state.activeNodeBackgroundId = null
  state.activeMarkdownLink = null
  state.pendingLinkFrom = null
  setSelectedNodes([childId], childId, childId)
  state.dirty = true
  state.status = 'Link broken'
  showCommandToast('Link broken')
  render()
}

function completeNodeLink(targetId: string): void {
  if (!state.pendingLinkFrom || state.pendingLinkFrom === targetId) {
    state.pendingLinkFrom = null
    render()
    return
  }

  const sourceId = state.pendingLinkFrom
  state.pendingLinkFrom = null
  setDocument(addNodeLink(state.document, sourceId, targetId), targetId)
}

function showMarkdownLinkPrompt(anchor: HTMLAnchorElement): void {
  const rawUrl = anchor.dataset.linkUrl ?? anchor.getAttribute('href') ?? ''
  const url = normalizeLinkUrl(rawUrl)

  if (!url) {
    state.status = 'Unsupported link'
    return
  }

  const rect = anchor.getBoundingClientRect()
  const x = clampNumber((rect.left + rect.right) / 2, 124, Math.max(124, window.innerWidth - 124))
  const preferredY = rect.bottom + 12
  const fallbackY = rect.top - 12
  const y = preferredY < window.innerHeight - 82
    ? clampNumber(preferredY, 48, Math.max(48, window.innerHeight - 44))
    : clampNumber(fallbackY, 48, Math.max(48, window.innerHeight - 44))

  state.activeMarkdownLink = {
    url,
    label: anchor.textContent?.trim() || url,
    x,
    y,
  }
  state.saveMenuOpen = false
  state.settingsOpen = false
  state.themeMenuOpen = false
  closeTemplatesMenu()
  state.activeEdgeColor = null
  state.activeNodeBackgroundId = null
  state.linkEditor = null
  state.focusLinkEditorAfterRender = false
  state.status = 'Link detected'
  render()
}

function openActiveMarkdownLink(): void {
  const url = state.activeMarkdownLink?.url

  if (!url) {
    return
  }

  state.activeMarkdownLink = null
  state.status = 'Opening link'
  showCommandToast('Opening link')
  window.open(url, '_blank', 'noopener,noreferrer')
  render()
}

function applyMarkdownFormat(nodeId: string | null, prefix: string, suffix: string, fallback: string): void {
  if (!nodeId || !state.document.nodes[nodeId]) {
    return
  }

  const input = document.querySelector<HTMLElement>(`[data-node-input][data-node-id="${cssEscape(nodeId)}"]`)
  const current = getEditableMarkdown(state.document.nodes[nodeId].markdown)
  const range = getEditorSelectionRange(input)
  const start = range?.start ?? current.length
  const end = range?.end ?? start
  const selected = current.slice(start, end) || fallback
  const nextMarkdown = `${current.slice(0, start)}${prefix}${selected}${suffix}${current.slice(end)}`
  pushHistory()
  state.document = updateNodeTextMarkdown(state.document, nodeId, nextMarkdown)
  setSelectedNodes([nodeId], nodeId, nodeId)
  state.dirty = true
  state.status = 'Formatted text'
  state.focusAfterRender = nodeId
  render()
}

function toggleMarkdownBulletList(nodeId: string | null): void {
  if (!nodeId || !state.document.nodes[nodeId]) {
    return
  }

  const input = document.querySelector<HTMLElement>(`[data-node-input][data-node-id="${cssEscape(nodeId)}"]`)
  const current = getEditableMarkdown(state.document.nodes[nodeId].markdown)
  const range = getEditorSelectionRange(input)
  const lineRange = getMarkdownLineRange(current, range?.start ?? current.length, range?.end ?? range?.start ?? current.length)
  const selectedBlock = current.slice(lineRange.start, lineRange.end)
  const nextBlock = toggleBulletLines(selectedBlock)

  if (nextBlock === selectedBlock) {
    return
  }

  const nextMarkdown = `${current.slice(0, lineRange.start)}${nextBlock}${current.slice(lineRange.end)}`
  pushHistory()
  state.document = updateNodeTextMarkdown(state.document, nodeId, nextMarkdown)
  setSelectedNodes([nodeId], nodeId, nodeId)
  state.dirty = true
  state.status = 'Bullet list updated'
  state.focusAfterRender = nodeId
  render()
}

function openMarkdownLinkEditor(nodeId: string | null, rangeOverride: { start: number; end: number } | null = null): void {
  if (!nodeId || !state.document.nodes[nodeId]) {
    return
  }

  const input = document.querySelector<HTMLElement>(`[data-node-input][data-node-id="${cssEscape(nodeId)}"]`)
  const current = getEditableMarkdown(state.document.nodes[nodeId].markdown)
  const range = rangeOverride ?? getEditorSelectionRange(input)
  const start = Math.min(Math.max(0, range?.start ?? current.length), current.length)
  const end = Math.min(Math.max(start, range?.end ?? start), current.length)

  state.linkEditor = { nodeId, start, end }
  state.focusLinkEditorAfterRender = true
  state.commandOpen = false
  state.commandQuery = ''
  state.commandSelection = null
  state.saveMenuOpen = false
  state.settingsOpen = false
  closeTemplatesMenu()
  state.activeEdgeColor = null
  state.activeNodeBackgroundId = null
  state.activeMarkdownLink = null
  setSelectedNodes([nodeId], nodeId, nodeId)
  state.status = 'Enter link URL'
  render()
}

function openCommandSelectionMarkdownLinkEditor(): void {
  const commandSelection = getValidCommandSelection()

  if (!commandSelection) {
    state.commandSelection = null
    state.status = 'Select text first'
    render()
    return
  }

  openMarkdownLinkEditor(commandSelection.nodeId, {
    start: commandSelection.start,
    end: commandSelection.end,
  })
}

function commitMarkdownLink(nodeId: string | null): void {
  if (!nodeId || !state.linkEditor || state.linkEditor.nodeId !== nodeId) {
    return
  }

  const input = document.querySelector<HTMLInputElement>(
    `[data-link-url-input][data-node-id="${cssEscape(nodeId)}"]`,
  )
  const url = input?.value.trim() ?? ''

  if (!url) {
    state.focusLinkEditorAfterRender = true
    state.status = 'Enter link URL'
    flushFocus()
    return
  }

  applyMarkdownLink(nodeId, url, state.linkEditor)
}

function cancelMarkdownLinkEditor(nodeId: string | null = state.linkEditor?.nodeId ?? null): void {
  if (!state.linkEditor || (nodeId && state.linkEditor.nodeId !== nodeId)) {
    return
  }

  const linkNodeId = state.linkEditor.nodeId
  state.linkEditor = null
  state.focusLinkEditorAfterRender = false
  state.focusAfterRender = linkNodeId
  state.status = 'Link canceled'
  render()
}

function handleInlineMarkdownLinkKeyDown(event: KeyboardEvent, input: HTMLInputElement): void {
  event.stopPropagation()

  if (event.key === 'Enter') {
    event.preventDefault()
    commitMarkdownLink(input.dataset.nodeId ?? null)
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    cancelMarkdownLinkEditor(input.dataset.nodeId ?? null)
  }
}

function applyMarkdownLink(nodeId: string, url: string, linkEditor: MarkdownLinkEditor): void {
  if (!state.document.nodes[nodeId]) {
    return
  }

  const current = getEditableMarkdown(state.document.nodes[nodeId].markdown)
  const start = Math.min(Math.max(0, linkEditor.start), current.length)
  const end = Math.min(Math.max(start, linkEditor.end), current.length)
  const selected = current.slice(start, end) || 'link'
  const nextMarkdown = `${current.slice(0, start)}[${selected}](${url})${current.slice(end)}`
  pushHistory()
  state.document = updateNodeTextMarkdown(state.document, nodeId, nextMarkdown)
  setSelectedNodes([nodeId], nodeId, nodeId)
  state.linkEditor = null
  state.focusLinkEditorAfterRender = false
  state.dirty = true
  state.status = 'Link added'
  state.focusAfterRender = nodeId
  render()
}

async function insertUploadedImage(file: File): Promise<void> {
  const nodeId = state.imageTargetId ?? state.selectedId
  await insertImageIntoNode(file, nodeId)
}

async function insertCanvasUploadedImage(file: File): Promise<void> {
  if (state.view !== 'mindmap') {
    return
  }

  await addCanvasImageAt(file, getCanvasViewportCenter())
}

async function insertImageIntoNode(file: File, nodeId: string | null): Promise<void> {
  if (!nodeId || !state.document.nodes[nodeId]) {
    return
  }

  const dataUrl = await readFileAsDataUrl(file)
  const markdown = `![${file.name}](${dataUrl}){width=${state.defaultImageWidth}}`
  const current = state.document.nodes[nodeId].markdown
  pushHistory()
  state.document = updateNodeMarkdown(state.document, nodeId, `${current}${current ? '\n' : ''}${markdown}`)
  setSelectedNodes([nodeId], nodeId, nodeId)
  state.imageTargetId = null
  state.dirty = true
  state.status = 'Image uploaded'
  render()
}

async function addCanvasImageAt(file: File, point: { x: number; y: number }): Promise<void> {
  if (state.view !== 'mindmap') {
    return
  }

  const dataUrl = await readFileAsDataUrl(file)
  const nextDocument = cloneDocument(state.document)
  const item: CanvasItem = {
    id: createCanvasItemId('image', nextDocument.canvasItems),
    type: 'image',
    x: Math.round(point.x),
    y: Math.round(point.y),
    width: CANVAS_IMAGE_DEFAULT_WIDTH,
    src: dataUrl,
    alt: file.name || 'Canvas image',
  }

  pushHistory()
  nextDocument.canvasItems.push(item)
  state.document = nextDocument
  setSelectedNodes([], null, null)
  state.dirty = true
  state.status = 'Image added to canvas'
  showCommandToast(state.status)
  render()
}

function promptCanvasLink(): void {
  closeFloatingPopups(false)
  const rawUrl = window.prompt('Paste a link')

  if (!rawUrl) {
    return
  }

  void addCanvasLinkAt(rawUrl, getCanvasViewportCenter())
}

async function addCanvasLinkAt(rawUrl: string, point: { x: number; y: number }): Promise<void> {
  if (state.view !== 'mindmap') {
    return
  }

  const url = normalizeLinkUrl(rawUrl)

  if (!url) {
    setStatus('Unsupported link')
    return
  }

  const preview = await createCanvasLinkPreview(url)

  if (state.view !== 'mindmap') {
    return
  }

  const nextDocument = cloneDocument(state.document)
  const item: CanvasLinkItem = {
    id: createCanvasItemId('link', nextDocument.canvasItems),
    type: 'link',
    x: Math.round(point.x),
    y: Math.round(point.y),
    width: CANVAS_LINK_DEFAULT_WIDTH,
    height: preview.image ? CANVAS_LINK_THUMBNAIL_HEIGHT : CANVAS_LINK_DEFAULT_HEIGHT,
    url,
    ...preview,
  }

  pushHistory()
  nextDocument.canvasItems.push(item)
  state.document = nextDocument
  setSelectedNodes([], null, null)
  state.dirty = true
  state.status = 'Link preview added to canvas'
  showCommandToast(state.status)
  render()
}

function removeCanvasItem(id: string): void {
  if (!state.document.canvasItems.some((item) => item.id === id)) {
    return
  }

  const nextDocument = cloneDocument(state.document)
  nextDocument.canvasItems = nextDocument.canvasItems.filter((item) => item.id !== id)
  pushHistory()
  state.document = nextDocument
  state.dirty = true
  state.status = 'Canvas item removed'
  showCommandToast(state.status)
  render()
}

function startCanvasItemDrag(event: PointerEvent, id: string): void {
  const item = state.document.canvasItems.find((candidate) => candidate.id === id)
  const element = document.querySelector<HTMLElement>(`.canvas-item[data-canvas-item-id="${cssEscape(id)}"]`)

  if (!item || !element) {
    return
  }

  event.preventDefault()
  const pointerId = event.pointerId
  const startX = event.clientX
  const startY = event.clientY
  const initialX = item.x
  const initialY = item.y
  let nextX = initialX
  let nextY = initialY
  let dragging = false

  const move = (moveEvent: PointerEvent) => {
    if (moveEvent.pointerId !== pointerId) {
      return
    }

    const rawDx = moveEvent.clientX - startX
    const rawDy = moveEvent.clientY - startY

    if (!dragging && Math.hypot(rawDx, rawDy) < 4) {
      return
    }

    if (!dragging) {
      dragging = true
      suppressNextClick = true
      closeFloatingPopups(false)
      setSelectedNodes([], null, null)
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      window.getSelection()?.removeAllRanges()
    }

    moveEvent.preventDefault()
    nextX = initialX + rawDx / state.zoom
    nextY = initialY + rawDy / state.zoom
    element.style.left = `${nextX}px`
    element.style.top = `${nextY}px`
  }

  const end = (endEvent: PointerEvent) => {
    if (endEvent.pointerId !== pointerId) {
      return
    }

    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', end)
    window.removeEventListener('pointercancel', end)

    if (!dragging) {
      return
    }

    const nextDocument = cloneDocument(state.document)
    const nextItem = nextDocument.canvasItems.find((candidate) => candidate.id === id)

    if (!nextItem) {
      render()
      return
    }

    pushHistory()
    nextItem.x = Math.round(nextX)
    nextItem.y = Math.round(nextY)
    state.document = nextDocument
    state.dirty = true
    state.status = 'Canvas item moved'
    render()
  }

  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', end)
  window.addEventListener('pointercancel', end)
}

function startCanvasItemResize(event: PointerEvent, id: string): void {
  const item = state.document.canvasItems.find((candidate) => candidate.id === id)
  const element = document.querySelector<HTMLElement>(`.canvas-item[data-canvas-item-id="${cssEscape(id)}"]`)

  if (!item || !element) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  const pointerId = event.pointerId
  const startX = event.clientX
  const startY = event.clientY
  const initialWidth = item.width
  const initialHeight = item.type === 'link'
    ? item.height ?? (item.image ? CANVAS_LINK_THUMBNAIL_HEIGHT : CANVAS_LINK_DEFAULT_HEIGHT)
    : 0
  let nextWidth = initialWidth
  let nextHeight = initialHeight
  let resizing = false

  const move = (moveEvent: PointerEvent) => {
    if (moveEvent.pointerId !== pointerId) {
      return
    }

    const dx = (moveEvent.clientX - startX) / state.zoom
    const dy = (moveEvent.clientY - startY) / state.zoom

    if (!resizing && Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < 4) {
      return
    }

    if (!resizing) {
      resizing = true
      suppressNextClick = true
      closeFloatingPopups(false)
      setSelectedNodes([], null, null)
    }

    moveEvent.preventDefault()

    if (item.type === 'link') {
      nextWidth = clampNumber(initialWidth + dx, CANVAS_LINK_MIN_WIDTH, CANVAS_LINK_MAX_WIDTH)
      nextHeight = clampNumber(initialHeight + dy, CANVAS_LINK_MIN_HEIGHT, CANVAS_LINK_MAX_HEIGHT)
      element.style.width = `${Math.round(nextWidth)}px`
      element.style.height = `${Math.round(nextHeight)}px`
      return
    }

    nextWidth = clampNumber(initialWidth + dx, CANVAS_IMAGE_MIN_WIDTH, CANVAS_IMAGE_MAX_WIDTH)
    element.style.width = `${Math.round(nextWidth)}px`
  }

  const end = (endEvent: PointerEvent) => {
    if (endEvent.pointerId !== pointerId) {
      return
    }

    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', end)
    window.removeEventListener('pointercancel', end)

    if (!resizing) {
      return
    }

    const nextDocument = cloneDocument(state.document)
    const nextItem = nextDocument.canvasItems.find((candidate) => candidate.id === id)

    if (!nextItem) {
      render()
      return
    }

    pushHistory()
    nextItem.width = Math.round(nextWidth)

    if (nextItem.type === 'link') {
      nextItem.height = Math.round(nextHeight)
    }

    state.document = nextDocument
    state.dirty = true
    state.status = 'Canvas item resized'
    render()
  }

  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', end)
  window.addEventListener('pointercancel', end)
}

function createCanvasItemId(type: CanvasItem['type'], items: CanvasItem[]): string {
  const prefix = `canvas-${type}`
  let id = `${prefix}-${Date.now().toString(36)}`
  let index = 2

  while (items.some((item) => item.id === id)) {
    id = `${prefix}-${Date.now().toString(36)}-${index}`
    index += 1
  }

  return id
}

function getCanvasPointFromEvent(event: MouseEvent): { x: number; y: number } {
  return getMapPointFromClient(event.clientX, event.clientY) ?? { x: 0, y: 0 }
}

function getCanvasViewportCenter(): { x: number; y: number } {
  const canvas = document.querySelector<HTMLElement>('[data-canvas]')

  if (!canvas) {
    return { x: 0, y: 0 }
  }

  const rect = canvas.getBoundingClientRect()

  return getMapPointFromClient(rect.left + rect.width / 2, rect.top + rect.height / 2) ?? { x: 0, y: 0 }
}

function updateImageWidth(nodeId: string, imageIndex: number, width: number): void {
  const node = state.document.nodes[nodeId]

  if (!node || !Number.isFinite(width)) {
    return
  }

  pushHistory()
  state.document = updateNodeMarkdown(state.document, nodeId, replaceImageWidth(node.markdown, imageIndex, Math.round(width)))
  setSelectedNodes([nodeId], nodeId, nodeId)
  state.dirty = true
  state.status = 'Image resized'

  const image = document.querySelector<HTMLImageElement>(
    `.node-image img[data-node-id="${cssEscape(nodeId)}"][data-image-index="${imageIndex}"]`,
  )

  if (image) {
    image.style.width = `${Math.round(width)}px`
    syncRenderedMapEdges()
  }
}

function removeImageFromNode(nodeId: string, imageIndex: number): void {
  const node = state.document.nodes[nodeId]

  if (!node || !Number.isFinite(imageIndex)) {
    return
  }

  const nextMarkdown = removeImageMarkdown(node.markdown, imageIndex)

  if (nextMarkdown === node.markdown) {
    return
  }

  pushHistory()
  state.document = updateNodeMarkdown(state.document, nodeId, nextMarkdown)
  setSelectedNodes([nodeId], nodeId, nodeId)
  state.dirty = true
  state.status = 'Image removed'
  showCommandToast(state.status)
  render()
}

function updateTitle(title: string): void {
  state.document = {
    ...state.document,
    title,
  }
  state.dirty = true
  state.status = 'Title edited'
}

function getTitleInputText(element: HTMLElement): string {
  return (element.textContent ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .trim()
}

function syncTitleEmptyState(element: HTMLElement): void {
  const isEmpty = getTitleInputText(element).length === 0

  if (isEmpty) {
    normalizeEmptyTitleInput(element)
  }

  element.classList.toggle('empty-title', isEmpty)
}

function normalizeEmptyTitleInput(element: HTMLElement): void {
  if (element.childNodes.length === 0) {
    return
  }

  element.replaceChildren()

  if (document.activeElement !== element) {
    return
  }

  const range = document.createRange()
  range.setStart(element, 0)
  range.collapse(true)

  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

function syncNodeInputEmptyState(element: HTMLElement): void {
  element.classList.toggle('empty-node-input', getEditableRawTextFromElement(element).length === 0)
}

function handleTitleCaretEvent(): void {
  scheduleTitleCaretSync()
}

function scheduleTitleCaretSync(): void {
  if (titleCaretFrame !== null) {
    cancelAnimationFrame(titleCaretFrame)
  }

  titleCaretFrame = requestAnimationFrame(() => {
    titleCaretFrame = null
    syncTitleCaret()
  })
}

function syncTitleCaret(): void {
  const titleInput = document.querySelector<HTMLElement>('#title-input')

  if (!titleInput) {
    return
  }

  const selection = window.getSelection()

  if (
    document.activeElement !== titleInput
    || !selection
    || !selection.isCollapsed
    || selection.rangeCount === 0
  ) {
    hideTitleCaret(titleInput)
    return
  }

  const range = selection.getRangeAt(0)

  if (!titleInput.contains(range.startContainer)) {
    hideTitleCaret(titleInput)
    return
  }

  const titleRect = titleInput.getBoundingClientRect()
  const styles = getComputedStyle(titleInput)
  const fontSize = Number.parseFloat(styles.fontSize) || 16
  const caretHeight = Math.round(fontSize * 0.72)
  const lineHeight = Number.parseFloat(styles.lineHeight) || fontSize

  if (titleInput.classList.contains('empty-title') && getTitleInputText(titleInput).length === 0) {
    const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0
    const left = titleInput.scrollLeft + paddingLeft
    const top = titleInput.scrollTop + ((titleInput.clientHeight - caretHeight) / 2)
    setTitleCaretPosition(titleInput, left, top, caretHeight)
    return
  }

  const caretRect = getCaretClientRect(range)

  if (!caretRect) {
    hideTitleCaret(titleInput)
    return
  }

  const rectHeight = caretRect.height || lineHeight
  const left = caretRect.left - titleRect.left + titleInput.scrollLeft
  const top = caretRect.top - titleRect.top + titleInput.scrollTop + ((rectHeight - caretHeight) / 2)

  setTitleCaretPosition(titleInput, left, top, caretHeight)
}

function setTitleCaretPosition(titleInput: HTMLElement, left: number, top: number, height: number): void {
  titleInput.style.setProperty('--title-caret-left', `${Math.max(0, Math.round(left))}px`)
  titleInput.style.setProperty('--title-caret-top', `${Math.max(0, Math.round(top))}px`)
  titleInput.style.setProperty('--title-caret-height', `${height}px`)
  titleInput.classList.add('has-title-caret')
}

function hideTitleCaret(titleInput?: HTMLElement): void {
  const title = titleInput ?? document.querySelector<HTMLElement>('#title-input')

  if (!title) {
    return
  }

  title.classList.remove('has-title-caret')
}

function startMindmapAreaSelection(event: PointerEvent, canvas: HTMLElement): void {
  const startX = event.clientX
  const startY = event.clientY
  const pointerId = event.pointerId
  let dragging = false
  let selectionBox: HTMLElement | null = null

  const move = (moveEvent: PointerEvent) => {
    if (moveEvent.pointerId !== pointerId) {
      return
    }

    const dx = moveEvent.clientX - startX
    const dy = moveEvent.clientY - startY

    if (!dragging && Math.hypot(dx, dy) < MAP_AREA_SELECTION_THRESHOLD) {
      return
    }

    if (!dragging) {
      dragging = true
      suppressNextClick = true
      closeFloatingPopups(false)
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      window.getSelection()?.removeAllRanges()
      selectionBox = document.createElement('div')
      selectionBox.className = 'mindmap-selection-box'
      canvas.append(selectionBox)
    }

    moveEvent.preventDefault()
    updateMindmapSelectionBox(selectionBox, canvas, startX, startY, moveEvent.clientX, moveEvent.clientY)
    selectMindmapNodesInViewportRect(getViewportRect(startX, startY, moveEvent.clientX, moveEvent.clientY))
  }

  const end = (endEvent: PointerEvent) => {
    if (endEvent.pointerId !== pointerId) {
      return
    }

    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', end)
    window.removeEventListener('pointercancel', end)
    selectionBox?.remove()

    if (!dragging) {
      return
    }

    endEvent.preventDefault()
    render()
  }

  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', end)
  window.addEventListener('pointercancel', end)
}

function updateMindmapSelectionBox(
  selectionBox: HTMLElement | null,
  canvas: HTMLElement,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
): void {
  if (!selectionBox) {
    return
  }

  const canvasRect = canvas.getBoundingClientRect()
  const left = Math.min(startX, currentX) - canvasRect.left
  const top = Math.min(startY, currentY) - canvasRect.top
  const width = Math.abs(currentX - startX)
  const height = Math.abs(currentY - startY)

  selectionBox.style.left = `${left}px`
  selectionBox.style.top = `${top}px`
  selectionBox.style.width = `${width}px`
  selectionBox.style.height = `${height}px`
}

function selectMindmapNodesInViewportRect(selectionRect: ViewportRect): void {
  const ids = getMindmapNodeIdsIntersectingViewportRect(selectionRect)
  const primaryId = ids[0] ?? null

  setSelectedNodes(ids, primaryId, primaryId)
  state.status =
    ids.length === 0
      ? 'Selection cleared'
      : ids.length === 1
        ? '1 node selected'
        : `${ids.length} nodes selected`
  updateSelectionInDom()
}

function getMindmapNodeIdsIntersectingViewportRect(selectionRect: ViewportRect): string[] {
  const ids: string[] = []

  for (const card of document.querySelectorAll<HTMLElement>('.mind-card[data-node-id]')) {
    const id = card.dataset.nodeId

    if (!id) {
      continue
    }

    const cardRect = card.getBoundingClientRect()

    if (
      selectionRect.left <= cardRect.right
      && selectionRect.right >= cardRect.left
      && selectionRect.top <= cardRect.bottom
      && selectionRect.bottom >= cardRect.top
    ) {
      ids.push(id)
    }
  }

  return ids
}

function startNodeDrag(event: PointerEvent, id: string): void {
  event.preventDefault()
  const layout = getRenderedMapLayout()
  const subtreeIds = getSubtreeIds(id).filter((nodeId) => layout.has(nodeId))
  const initialLayouts = new Map(
    subtreeIds.map((nodeId) => {
      const nodeLayout = layout.get(nodeId)
      return [nodeId, nodeLayout ? { ...nodeLayout } : null] as const
    }),
  )

  if (subtreeIds.length === 0 || !initialLayouts.get(id)) {
    return
  }

  const startX = event.clientX
  const startY = event.clientY
  const nextPositions: Record<string, { x: number; y: number }> = {}
  let dragging = false

  const move = (moveEvent: PointerEvent) => {
    const dx = (moveEvent.clientX - startX) / state.zoom
    const dy = (moveEvent.clientY - startY) / state.zoom

    if (!dragging && Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < 4) {
      return
    }

    if (!dragging) {
      dragging = true
      suppressNextClick = true
      closeFloatingPopups(false)
    }

    const nextLayout = new Map(layout)

    for (const nodeId of subtreeIds) {
      const initialLayout = initialLayouts.get(nodeId)
      const card = document.querySelector<HTMLElement>(`[data-card-id="${cssEscape(nodeId)}"]`)

      if (!initialLayout) {
        continue
      }

      const nextPosition = {
        x: initialLayout.x + dx,
        y: initialLayout.y + dy,
      }
      nextPositions[nodeId] = nextPosition
      nextLayout.set(nodeId, {
        ...initialLayout,
        ...nextPosition,
      })

      if (card) {
        card.style.left = `${nextPosition.x}px`
        card.style.top = `${nextPosition.y}px`
      }
    }

    updateMapEdges(nextLayout)
  }

  const up = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)

    if (!dragging) {
      return
    }

    pushHistory()
    state.document = setNodePositions(state.document, nextPositions)
    setSelectedNodes([id], id, id)
    state.dirty = true
    state.status = 'Node position saved to metadata'
    render()
  }

  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}

function updateMapTransform(): void {
  const layer = document.querySelector<HTMLElement>('[data-map-layer]')

  if (!layer) {
    return
  }

  layer.style.transform = `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})`
  updateEdgePopoverPositionInDom()
  updateZoomLabel()
}

function updateMapEdges(layout: Map<string, MindmapLayoutNode>): void {
  const edges = document.querySelector<SVGElement>('.map-edges')
  const mapEdges = collectMapEdges(layout)

  if (edges) {
    edges.innerHTML = renderMapEdgePaths(mapEdges)
  }

  updateMindNodeHoverInDom()

  document.querySelectorAll<HTMLElement>('.edge-hotspot').forEach((element) => {
    const kind = element.dataset.edgeKind as EdgeKind | undefined
    const id = element.dataset.edgeId
    const edge = mapEdges.find((candidate) => candidate.kind === kind && candidate.id === id)

    if (!edge) {
      return
    }

    element.style.left = `${edge.midX}px`
    element.style.top = `${edge.midY}px`
  })
  updateEdgePopoverPositionInDom(mapEdges)
}

function updateEdgePopoverPositionInDom(mapEdges?: MapEdgeRender[]): void {
  const popover = document.querySelector<HTMLElement>('.edge-color-popover.floating')

  if (!popover) {
    return
  }

  let mapX = Number(popover.dataset.mapX)
  let mapY = Number(popover.dataset.mapY)

  if (mapEdges && state.activeEdgeColor) {
    const edge = mapEdges.find(
      (candidate) => candidate.kind === state.activeEdgeColor?.kind && candidate.id === state.activeEdgeColor.id,
    )

    if (!edge) {
      popover.remove()
      return
    }

    mapX = edge.midX
    mapY = edge.midY
    popover.dataset.mapX = String(edge.midX)
    popover.dataset.mapY = String(edge.midY)
  }

  if (!Number.isFinite(mapX) || !Number.isFinite(mapY)) {
    return
  }

  const position = getMapScreenPosition(mapX, mapY)
  popover.style.left = `${position.left}px`
  popover.style.top = `${position.top + EDGE_COLOR_POPOVER_OFFSET_Y}px`
}

function getSubtreeIds(id: string): string[] {
  const node = state.document.nodes[id]

  if (!node) {
    return []
  }

  return [id, ...node.children.flatMap((childId) => getSubtreeIds(childId))]
}

function setZoom(value: number): void {
  state.zoom = clampZoom(value)
  updateMapTransform()
}

function zoomAt(clientX: number, clientY: number, delta: number): void {
  const canvas = document.querySelector<HTMLElement>('[data-canvas]')

  if (!canvas) {
    return
  }

  const rect = canvas.getBoundingClientRect()
  const previousZoom = state.zoom
  const nextZoom = clampZoom(previousZoom * (1 + delta * 0.003))
  const localX = clientX - rect.left
  const localY = clientY - rect.top
  const mapX = (localX - state.pan.x) / previousZoom
  const mapY = (localY - state.pan.y) / previousZoom

  state.zoom = nextZoom
  state.pan = {
    x: localX - mapX * nextZoom,
    y: localY - mapY * nextZoom,
  }
  updateMapTransform()
}

function updateZoomLabel(): void {
  const label = document.querySelector<HTMLButtonElement>('.zoom-label')

  if (label) {
    label.textContent = `${getDisplayZoomPercent(state.zoom)}%`
  }
}

function getDocumentTitle(): string {
  return state.document.title
}

function getFrontmatterText(): string {
  const propertiesYaml = serializeFilePropertiesYaml(state.document.fileProperties ?? [])

  return propertiesYaml ? `---\n${propertiesYaml}\n---` : '---\n---'
}

function serializeCurrentMarkdown(): string {
  const full = serializeMindmapMarkdown(state.document)

  if (state.frontmatterEnabled) {
    return full
  }

  return `${full.replace(/^---\n[\s\S]*?\n---\n*/u, '').trimEnd()}\n`
}

function syncOpenFrontmatter(): void {
  const textarea = document.querySelector<HTMLTextAreaElement>('#frontmatter-input')

  if (!textarea) {
    return
  }

  if (normalizeFrontmatter(textarea.value) === normalizeFrontmatter(getFrontmatterText())) {
    return
  }

  applyFrontmatter(textarea.value)
}

function applyFrontmatter(value: string): void {
  const normalized = normalizeFrontmatter(value)

  pushHistory()

  state.document = {
    ...state.document,
    fileProperties: normalized ? parseFilePropertiesYaml(normalized) : [],
  }
  state.dirty = true
  state.status = 'File properties updated'
  state.frontmatterEnabled = true
  state.frontmatterOpen = true
  render()
}

function normalizeFrontmatter(value: string): string {
  const trimmed = value.trim()

  if (!trimmed || trimmed === '---') {
    return ''
  }

  if (!trimmed.startsWith('---')) {
    return `---\n${trimmed}\n---`
  }

  return trimmed.endsWith('---') ? trimmed : `${trimmed}\n---`
}

function ensureValidSelection(): void {
  state.selectedIds = state.selectedIds.filter((id) => Boolean(state.document.nodes[id]))

  if (state.selectedId === null) {
    if (state.selectedIds.length > 0) {
      const primaryId = state.selectedIds[state.selectedIds.length - 1] ?? null
      setSelectedNodes(state.selectedIds, primaryId, state.selectionAnchorId)
      return
    }

    state.selectionAnchorId = null
    return
  }

  if (state.selectedId && state.document.nodes[state.selectedId]) {
    if (state.selectedIds.length === 0) {
      state.selectedIds = [state.selectedId]
    }
    return
  }

  const fallbackId = state.selectedIds[0] ?? state.document.rootId ?? state.document.rootIds[0] ?? null
  setSelectedNodes(fallbackId ? [fallbackId] : [], fallbackId, fallbackId)
}

function ensureValidFocus(): void {
  if (state.focusId && !state.document.nodes[state.focusId]) {
    state.focusId = null
  }
}

function getDocumentStats(): {
  total: number
  visible: number
  collapsed: number
  maxDepth: number
} {
  const ids = Object.keys(state.document.nodes)
  const visible = getVisibleNodeIds(state.document, state.focusId).length
  let collapsed = 0
  let maxDepth = 0

  for (const id of ids) {
    const node = state.document.nodes[id]

    if (node.collapsed) {
      collapsed += 1
    }

    maxDepth = Math.max(maxDepth, getDepth(state.document, id) + 1)
  }

  return {
    total: ids.length,
    visible,
    collapsed,
    maxDepth,
  }
}

function getOutlineScopeRootIds(): string[] {
  return state.focusId && state.document.nodes[state.focusId] ? [state.focusId] : state.document.rootIds
}

function getOutlineMaxLevel(): number {
  let maxLevel = 1

  const visit = (id: string, level: number) => {
    const node = state.document.nodes[id]

    if (!node) {
      return
    }

    maxLevel = Math.max(maxLevel, level)
    node.children.forEach((childId) => visit(childId, level + 1))
  }

  getOutlineScopeRootIds().forEach((id) => visit(id, 1))
  return maxLevel
}

function getDeepestVisibleOutlineLevel(): number {
  return getVisibleNodeIds(state.document, state.focusId).reduce((maxLevel, id) => {
    return Math.max(maxLevel, getOutlineLevel(id))
  }, 1)
}

function getOutlineLevel(id: string): number {
  return (state.focusId ? getRelativeDepth(id, state.focusId) : getDepth(state.document, id)) + 1
}

function isOutlineScopeFullyExpanded(): boolean {
  let fullyExpanded = true

  const visit = (id: string) => {
    const node = state.document.nodes[id]

    if (!node) {
      return
    }

    if (node.children.length > 0 && node.collapsed) {
      fullyExpanded = false
    }

    node.children.forEach(visit)
  }

  getOutlineScopeRootIds().forEach(visit)
  return fullyExpanded
}

function changeOutlineDepthLevel(direction: -1 | 1): void {
  const maxLevel = getOutlineMaxLevel()
  const currentLevel = Math.min(getDeepestVisibleOutlineLevel(), maxLevel)
  const nextLevel = direction > 0
    ? Math.min(maxLevel, currentLevel + 1)
    : Math.max(1, currentLevel - 1)

  applyOutlineDepthLevel(nextLevel)
}

function applyOutlineDepthLevel(level: number): void {
  const maxLevel = getOutlineMaxLevel()
  const targetLevel = Math.min(maxLevel, Math.max(1, Math.floor(level)))
  const documentUpdate = setCollapsedToDepth(state.document, targetLevel, state.focusId)
  const expandedAll = targetLevel >= maxLevel
  const status = expandedAll ? 'All outline levels expanded' : `Outline shown to level ${targetLevel}`

  if (documentUpdate === state.document) {
    state.status = expandedAll ? 'All outline levels already expanded' : `Outline already shown to level ${targetLevel}`
    showCommandToast(state.status)
    render()
    return
  }

  pushHistory()
  state.document = documentUpdate
  keepSelectionVisibleInOutline()
  state.dirty = true
  state.status = status
  showCommandToast(status)
  render()
}

function keepSelectionVisibleInOutline(): void {
  const visibleIds = getVisibleNodeIds(state.document, state.focusId)
  const visibleSet = new Set(visibleIds)

  if (state.selectedId && visibleSet.has(state.selectedId)) {
    const visibleSelectedIds = state.selectedIds.filter((id) => visibleSet.has(id))
    setSelectedNodes(
      visibleSelectedIds.length > 0 ? visibleSelectedIds : [state.selectedId],
      state.selectedId,
      state.selectionAnchorId && visibleSet.has(state.selectionAnchorId) ? state.selectionAnchorId : state.selectedId,
    )
    return
  }

  const fallbackId =
    getVisibleAncestorId(state.selectedId, visibleSet)
    ?? visibleIds[0]
    ?? state.document.rootId
    ?? state.document.rootIds[0]
    ?? null

  setSelectedNodes(fallbackId ? [fallbackId] : [], fallbackId, fallbackId)
}

function getVisibleAncestorId(id: string | null, visibleSet: Set<string>): string | null {
  let currentId = id

  while (currentId) {
    if (visibleSet.has(currentId)) {
      return currentId
    }

    currentId = state.document.nodes[currentId]?.parentId ?? null
  }

  return null
}

async function exportDefaultFormat(): Promise<void> {
  await exportDocument(state.defaultExportFormat, true)
}

async function exportDocument(format: ExportFormat, isDefault = false): Promise<void> {
  syncOpenFrontmatter()
  const statusPrefix = isDefault ? 'Default ' : ''

  if (format !== 'mosaic') {
    return
  }

  downloadBlob(getMosaicFileName(state.fileName), createMosaicPackageBlob(state.document))
  setStatus(`${statusPrefix}Mosaic file exported`)
}

function exportReadableMarkdown(): void {
  syncOpenFrontmatter()
  downloadText(getReadableMarkdownFileName(state.fileName), serializeCleanMarkdown(state.document), 'text/markdown')
  setStatus('Readable Markdown exported')
}

function exportJson(): void {
  syncOpenFrontmatter()
  downloadText(getJsonFileName(state.fileName), serializeMindmapJson(state.document), 'application/json')
  setStatus('JSON exported')
}

function getSuggestedSaveName(): string {
  return getMosaicFileName(state.fileName)
}

function getUntitledFileName(): string {
  const fileNames = new Set(state.tabs.map((tab) => tab.fileName))
  const firstName = `untitled${MOSAIC_FILE_EXTENSION}`

  if (!fileNames.has(firstName)) {
    return firstName
  }

  let index = 2
  let nextName = `untitled ${index}${MOSAIC_FILE_EXTENSION}`

  while (fileNames.has(nextName)) {
    index += 1
    nextName = `untitled ${index}${MOSAIC_FILE_EXTENSION}`
  }

  return nextName
}

function flushFocus(): void {
  if (state.focusCommandAfterRender) {
    state.focusCommandAfterRender = false
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>('#command-input')
      input?.focus()
      input?.setSelectionRange(input.value.length, input.value.length)
    })
    return
  }

  if (state.editingTabId) {
    const tabId = state.editingTabId
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>(`[data-tab-rename][data-tab-id="${cssEscape(tabId)}"]`)
      input?.focus()
      input?.select()
    })
    return
  }

  if (state.editingEdge) {
    const { kind, id } = state.editingEdge
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>(
        `[data-edge-label-input][data-edge-kind="${cssEscape(kind)}"][data-edge-id="${cssEscape(id)}"]`,
      )
      input?.focus()
      input?.select()
    })
    return
  }

  if (state.focusLinkEditorAfterRender && state.linkEditor) {
    const { nodeId } = state.linkEditor
    state.focusLinkEditorAfterRender = false
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>(
        `[data-link-url-input][data-node-id="${cssEscape(nodeId)}"]`,
      )
      input?.focus()
      input?.select()
    })
    return
  }

  if (state.focusTemplateSaveAfterRender) {
    state.focusTemplateSaveAfterRender = false
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>('[data-template-save-input]')
      input?.focus()
      input?.select()
    })
    return
  }

  if (state.focusTemplateRenameAfterRender) {
    const id = state.focusTemplateRenameAfterRender
    state.focusTemplateRenameAfterRender = null
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>(`[data-template-rename][data-template-id="${cssEscape(id)}"]`)
      input?.focus()
      input?.select()
    })
    return
  }

  if (!state.focusAfterRender) {
    return
  }

  const id = state.focusAfterRender
  state.focusAfterRender = null
  requestAnimationFrame(() => {
    const input = document.querySelector<HTMLElement>(`[data-node-input][data-node-id="${cssEscape(id)}"]`)
    input?.focus()
    moveEditableCaretToEnd(input)
  })
}

function updateOutlineWidth(value: number): void {
  const rawWidth = Math.min(1180, Math.max(680, Number.isFinite(value) ? Math.round(value) : 900))
  const width = snapToMarks(rawWidth, OUTLINE_WIDTH_MARKS, 16)
  state.outlineWidth = width
  localStorage.setItem('mosaic-outline-width', String(width))
  document.querySelector<HTMLElement>('.outliner-page')?.style.setProperty('--outline-width', `${width}px`)

  const output = document.querySelector<HTMLOutputElement>('[data-output-for="outline-width-input"]')

  if (output) {
    output.value = `${width}px`
    output.textContent = `${width}px`
  }

  const input = document.querySelector<HTMLInputElement>('#outline-width-input')

  if (input && input.value !== String(width)) {
    input.value = String(width)
  }
}

function updateDefaultImageWidth(value: number): void {
  const rawWidth = Math.min(3840, Math.max(640, Number.isFinite(value) ? Math.round(value) : 1080))
  const width = snapToMarks(rawWidth, IMAGE_WIDTH_MARKS, 48)
  state.defaultImageWidth = width
  localStorage.setItem('mosaic-default-image-width', String(width))

  const output = document.querySelector<HTMLOutputElement>('[data-output-for="image-width-input"]')

  if (output) {
    output.value = `${width}px`
    output.textContent = `${width}px`
  }

  const input = document.querySelector<HTMLInputElement>('#image-width-input')

  if (input && input.value !== String(width)) {
    input.value = String(width)
  }
}

function updateImagePlacement(value: ImagePlacement): void {
  if (value !== 'inline' && value !== 'below') {
    return
  }

  state.imagePlacement = value
  localStorage.setItem('mosaic-image-placement', value)
  setStatus('Image placement updated')
}

function updateTrackpadSpeed(value: number): void {
  const rawSpeed = Number.isFinite(value) ? value : TRACKPAD_SPEED_DEFAULT
  const speed = snapToMarks(
    Math.min(TRACKPAD_SPEED_MAX, Math.max(TRACKPAD_SPEED_MIN, rawSpeed)),
    TRACKPAD_SPEED_MARKS,
    0.04,
  )
  state.trackpadSpeed = Math.round(speed * 100) / 100
  localStorage.setItem('mosaic-trackpad-speed', String(state.trackpadSpeed))
  localStorage.setItem('mosaic-trackpad-speed-version', '2')

  const output = document.querySelector<HTMLOutputElement>('[data-output-for="trackpad-speed-input"]')

  if (output) {
    output.value = formatSpeedValue(state.trackpadSpeed)
    output.textContent = formatSpeedValue(state.trackpadSpeed)
  }

  const input = document.querySelector<HTMLInputElement>('#trackpad-speed-input')

  if (input && input.value !== String(state.trackpadSpeed)) {
    input.value = String(state.trackpadSpeed)
  }
}

function updateAutoSaveSeconds(value: number): void {
  const seconds = Math.max(0, Math.round(Number.isFinite(value) ? value : 0))
  state.autoSaveSeconds = seconds
  localStorage.setItem('mosaic-autosave-seconds', String(seconds))
  scheduleAutoSave()

  const input = document.querySelector<HTMLInputElement>('#autosave-seconds')

  if (input && input.value !== String(seconds)) {
    input.value = String(seconds)
  }
}

function updateCommandToastEnabled(enabled: boolean): void {
  state.commandToastEnabled = enabled
  localStorage.setItem('mosaic-command-toast-enabled', enabled ? 'true' : 'false')

  if (!enabled) {
    state.commandToast = null
  }
}

function saveCustomTemplates(): void {
  localStorage.setItem(CUSTOM_TEMPLATES_STORAGE_KEY, JSON.stringify(state.customTemplates))
}

function saveBuiltInTemplates(): void {
  localStorage.setItem(BUILT_IN_TEMPLATES_STORAGE_KEY, JSON.stringify(state.builtInTemplates))
}

function saveShortcuts(): void {
  localStorage.setItem('mosaic-shortcuts', JSON.stringify(state.shortcuts))
}

function isShortcut(event: KeyboardEvent, id: ShortcutId): boolean {
  const combo = state.shortcuts[id]

  return Boolean(combo) && normalizeKeyboardEvent(event) === combo
}

function isPointerShortcut(event: MouseEvent, id: ShortcutId): boolean {
  const combo = state.shortcuts[id]

  return Boolean(combo) && normalizePointerEvent(event) === combo
}

function isDeleteShortcut(event: KeyboardEvent, id: ShortcutId): boolean {
  if (isShortcut(event, id)) {
    return true
  }

  const combo = state.shortcuts[id]
  const normalized = normalizeKeyboardEvent(event)

  if ((id === 'deleteSelection' || id === 'mindmapDelete') && combo === 'Delete') {
    return normalized === 'Backspace'
  }

  if ((id === 'deleteSelectionOnly' || id === 'mindmapDeleteOnly') && combo === 'Shift+Delete') {
    return normalized === 'Shift+Backspace'
  }

  return false
}

function getMindmapKeyboardMove(event: KeyboardEvent): { dx: number; dy: number } | null {
  if (isShortcut(event, 'mindmapMoveUp')) {
    return { dx: 0, dy: -MAP_KEYBOARD_NUDGE }
  }

  if (isShortcut(event, 'mindmapMoveDown')) {
    return { dx: 0, dy: MAP_KEYBOARD_NUDGE }
  }

  if (isShortcut(event, 'mindmapMoveLeft')) {
    return { dx: -MAP_KEYBOARD_NUDGE, dy: 0 }
  }

  if (isShortcut(event, 'mindmapMoveRight')) {
    return { dx: MAP_KEYBOARD_NUDGE, dy: 0 }
  }

  return null
}

function handleShortcutClickCapture(event: MouseEvent): boolean {
  if (!state.shortcutCaptureId || !(event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)) {
    return false
  }

  event.preventDefault()
  event.stopPropagation()
  updateShortcut(state.shortcutCaptureId, normalizePointerEvent(event))

  return true
}

function handleShortcutCapture(event: KeyboardEvent): void {
  event.preventDefault()
  event.stopPropagation()

  const captureId = state.shortcutCaptureId

  if (!captureId) {
    return
  }

  const combo = normalizeKeyboardEvent(event)

  if (!combo || ['Mod', 'Alt', 'Shift'].includes(combo)) {
    return
  }

  const conflict = getShortcutConflict(captureId, combo, state.shortcuts)

  if (conflict) {
    state.shortcutConflictMessage = `${formatShortcutLabel(combo)} is already used by ${getShortcutDefinition(conflict).label}.`
    render()
    return
  }

  updateShortcut(captureId, combo)
}

function updateShortcut(id: ShortcutId, combo: string): void {
  const normalizedCombo = combo ? normalizeShortcutCombo(combo) : ''

  state.shortcuts = {
    ...state.shortcuts,
    [id]: normalizedCombo,
  }
  state.shortcutCaptureId = null
  state.shortcutConflictMessage = normalizedCombo ? 'Keyboard shortcut updated.' : 'Keyboard shortcut cleared.'
  saveShortcuts()
  render()
}

function insertEditorLineBreak(element: HTMLElement, nodeId: string | null = null): void {
  if (nodeId && insertBulletListLineBreak(element, nodeId)) {
    return
  }

  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0) {
    element.append(document.createTextNode('\n'))
  } else {
    const range = selection.getRangeAt(0)

    if (!element.contains(range.commonAncestorContainer)) {
      return
    }

    range.deleteContents()
    const textNode = document.createTextNode('\n')
    range.insertNode(textNode)
    range.setStartAfter(textNode)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: '\n' }))
}

function insertBulletListLineBreak(element: HTMLElement, nodeId: string): boolean {
  if (!state.document.nodes[nodeId]) {
    return false
  }

  const range = getEditorSelectionRange(element)

  if (!range) {
    return false
  }

  const current = getEditableMarkdownFromElement(element)
  const lineRange = getMarkdownLineRange(current, range.start, range.end)
  const currentLine = current.slice(lineRange.start, lineRange.end)
  const bullet = getBulletLineParts(currentLine)

  if (!bullet) {
    return false
  }

  const nextLineAfterDeletion = `${current.slice(lineRange.start, range.start)}${current.slice(range.end, lineRange.end)}`
  const nextLineBullet = getBulletLineParts(nextLineAfterDeletion)
  const beforeSelection = current.slice(0, range.start)
  const afterSelection = current.slice(range.end)
  const indent = '  '.repeat(bullet.indentLevel)
  const nextMarkdown = nextLineBullet && nextLineBullet.content.trim().length === 0
    ? `${current.slice(0, lineRange.start)}${indent}${current.slice(lineRange.end)}`
    : `${beforeSelection}\n${indent}- ${afterSelection}`

  pushHistory()
  state.document = updateNodeTextMarkdown(state.document, nodeId, nextMarkdown)
  setSelectedNodes([nodeId], nodeId, nodeId)
  state.dirty = true
  state.status = nextLineBullet && nextLineBullet.content.trim().length === 0 ? 'Bullet list ended' : 'Bullet added'
  state.focusAfterRender = nodeId
  render()
  return true
}

function scheduleAutoSave(): void {
  if (autoSaveTimer) {
    window.clearInterval(autoSaveTimer)
    autoSaveTimer = null
  }

  if (state.autoSaveSeconds <= 0) {
    return
  }

  autoSaveTimer = window.setInterval(() => {
    if (!state.dirty || !state.fileHandle) {
      return
    }

    void persistMindmapFile(true)
  }, state.autoSaveSeconds * 1000)
}

function getCurrentNodeTextSelection(): CommandSelection | null {
  const selection = window.getSelection()

  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null
  }

  const range = selection.getRangeAt(0)
  const anchorElement = range.commonAncestorContainer instanceof HTMLElement
    ? range.commonAncestorContainer
    : range.commonAncestorContainer.parentElement
  const editor = anchorElement?.closest<HTMLElement>('[data-node-input]')
  const nodeId = editor?.dataset.nodeId

  if (!editor || !nodeId || !state.document.nodes[nodeId] || !editor.contains(range.commonAncestorContainer)) {
    return null
  }

  const selectionRange = getEditorSelectionRange(editor)

  if (!selectionRange || selectionRange.end <= selectionRange.start) {
    return null
  }

  const current = getEditableMarkdown(state.document.nodes[nodeId].markdown)
  const start = Math.min(Math.max(0, selectionRange.start), current.length)
  const end = Math.min(Math.max(start, selectionRange.end), current.length)
  const text = current.slice(start, end)

  if (!text.trim()) {
    return null
  }

  return { nodeId, start, end, text }
}

function getValidCommandSelection(): CommandSelection | null {
  const selection = state.commandSelection

  if (!selection || !state.document.nodes[selection.nodeId]) {
    return null
  }

  const current = getEditableMarkdown(state.document.nodes[selection.nodeId].markdown)
  const start = Math.min(Math.max(0, selection.start), current.length)
  const end = Math.min(Math.max(start, selection.end), current.length)
  const text = current.slice(start, end)

  if (!text.trim()) {
    return null
  }

  return { ...selection, start, end, text }
}

function updateSelectionInDom(): void {
  const selectedIds = new Set(state.selectedIds)

  document.querySelectorAll('.outline-row.selected, .outline-row.active-selected, .mind-card.selected').forEach((element) => {
    element.classList.remove('selected')
    element.classList.remove('active-selected')

    if (element instanceof HTMLElement) {
      element.setAttribute('aria-selected', 'false')
    }
  })

  for (const id of selectedIds) {
    document.querySelectorAll<HTMLElement>(`.outline-row[data-node-id="${cssEscape(id)}"]`).forEach((element) => {
      element.classList.add('selected')
      element.setAttribute('aria-selected', 'true')
    })
    document.querySelectorAll<HTMLElement>(`.mind-card[data-node-id="${cssEscape(id)}"]`).forEach((element) => {
      element.classList.add('selected')
      element.setAttribute('aria-selected', 'true')
    })
  }

  if (!state.selectedId) {
    return
  }

  document.querySelectorAll<HTMLElement>(`.outline-row[data-node-id="${cssEscape(state.selectedId)}"]`).forEach((element) => {
    element.classList.add('active-selected')
  })
}

function closeFloatingPopups(shouldRender = true): boolean {
  const hadLinkEditor = state.linkEditor !== null
  const hadOpenPopup =
    state.saveMenuOpen
    || state.settingsOpen
    || state.themeMenuOpen
    || state.templateMenuAnchor !== null
    || state.activeEdgeColor !== null
    || state.activeNodeBackgroundId !== null
    || state.activeMarkdownLink !== null
    || hadLinkEditor
  state.saveMenuOpen = false
  state.settingsOpen = false
  state.themeMenuOpen = false
  closeTemplatesMenu()
  state.activeEdgeColor = null
  state.activeNodeBackgroundId = null
  state.activeMarkdownLink = null
  state.linkEditor = null
  state.focusLinkEditorAfterRender = false

  if (hadOpenPopup && shouldRender) {
    render()
  }

  if (hadOpenPopup && !shouldRender) {
    removeMenuPopupsFromDom()
    updateEdgePopoverInDom()

    if (hadLinkEditor) {
      render()
    }
  }

  return hadOpenPopup
}

function removeMenuPopupsFromDom(): void {
  document.querySelectorAll('.popup-menu').forEach((element) => {
    element.remove()
  })
  document.querySelectorAll('.markdown-link-popover, .node-background-popover').forEach((element) => {
    element.remove()
  })
}

function openThemeMenu(): void {
  if (state.themeMenuOpen) {
    return
  }

  state.commandOpen = false
  state.saveMenuOpen = false
  state.settingsOpen = false
  closeTemplatesMenu()
  state.activeMarkdownLink = null
  state.activeNodeBackgroundId = null
  state.activeEdgeColor = null
  state.themeMenuOpen = true
  render()
}

function closeThemeMenu(): void {
  if (!state.themeMenuOpen) {
    return
  }

  state.themeMenuOpen = false
  render()
}

function toggleTheme(): void {
  setTheme(isLightTheme(state.theme) ? 'dark' : 'light')
}

function setTheme(theme: ThemeMode): void {
  state.theme = theme
  state.commandOpen = false
  localStorage.setItem('mosaic-theme', state.theme)
  render()
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return target.matches('input, textarea')
    || Boolean(target.closest('[contenteditable]:not([contenteditable="false"])'))
}
