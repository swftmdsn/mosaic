import { createNewMindmap } from '../core/mindmap'
import { DEFAULT_FRONTMATTER_MODE, MAP_ZOOM_BASE } from './constants'
import { getDefaultMapPan } from './mindmap/geometry'
import { MOSAIC_FILE_EXTENSION } from './utils/file-names'
import { loadTheme } from './theme'
import { loadShortcuts } from './shortcuts'
import { loadAutoSaveSeconds, loadCommandToastEnabled, loadDefaultExportFormat, loadDefaultImageWidth, loadImagePlacement, loadOutlineWidth, loadStarterDismissed, loadTrackpadSpeed } from './preferences'
import { loadBuiltInTemplates, loadCustomTemplates } from './templates/model'
import type { AppState } from './types'

let nextTabIndex = 1

const initialTabId = createTabId()

const initialDocument = createNewMindmap()

const initialSelectedId = initialDocument.rootId ?? initialDocument.rootIds[0] ?? null

export const state: AppState = {
  document: initialDocument,
  tabs: [
    {
      id: initialTabId,
      document: initialDocument,
      view: initialDocument.defaultView,
      selectedId: initialSelectedId,
      selectedIds: initialSelectedId ? [initialSelectedId] : [],
      selectionAnchorId: initialSelectedId,
      focusId: null,
      dirty: false,
      fileName: `untitled${MOSAIC_FILE_EXTENSION}`,
      fileFormat: 'mosaic',
      fileHandle: null,
      zoom: MAP_ZOOM_BASE,
      pan: getDefaultMapPan(initialDocument, MAP_ZOOM_BASE),
      outlineScroll: { top: 0, left: 0 },
      frontmatterEnabled: false,
      frontmatterOpen: false,
      frontmatterMode: DEFAULT_FRONTMATTER_MODE,
      pendingLinkFrom: null,
      imageTargetId: null,
      historyPast: [],
      historyFuture: [],
    },
  ],
  activeTabId: initialTabId,
  editingTabId: null,
  editingEdge: null,
  view: initialDocument.defaultView,
  selectedId: initialSelectedId,
  selectedIds: initialSelectedId ? [initialSelectedId] : [],
  selectionAnchorId: initialSelectedId,
  focusId: null,
  commandQuery: '',
  commandSelection: null,
  dirty: false,
  fileName: `untitled${MOSAIC_FILE_EXTENSION}`,
  fileFormat: 'mosaic',
  fileHandle: null,
  status: 'Ready',
  theme: loadTheme(),
  zoom: MAP_ZOOM_BASE,
  pan: getDefaultMapPan(initialDocument, MAP_ZOOM_BASE),
  outlineScroll: { top: 0, left: 0 },
  outlineWidth: loadOutlineWidth(),
  defaultImageWidth: loadDefaultImageWidth(),
  imagePlacement: loadImagePlacement(),
  trackpadSpeed: loadTrackpadSpeed(),
  defaultExportFormat: loadDefaultExportFormat(),
  autoSaveSeconds: loadAutoSaveSeconds(),
  commandOpen: false,
  saveMenuOpen: false,
  settingsOpen: false,
  themeMenuOpen: false,
  linkEditor: null,
  activeMarkdownLink: null,
  focusLinkEditorAfterRender: false,
  frontmatterEnabled: false,
  frontmatterOpen: false,
  frontmatterMode: DEFAULT_FRONTMATTER_MODE,
  pendingLinkFrom: null,
  imageTargetId: null,
  historyPast: [],
  historyFuture: [],
  focusAfterRender: null,
  focusCommandAfterRender: false,
  settingsTab: 'view',
  shortcuts: loadShortcuts(),
  shortcutCaptureId: null,
  shortcutConflictMessage: '',
  activeEdgeColor: null,
  activeNodeBackgroundId: null,
  commandToastEnabled: loadCommandToastEnabled(),
  commandToast: null,
  pendingCloseTabId: null,
  outlineDepthControlsExpanded: false,
  starterDismissed: loadStarterDismissed(),
  templateMenuAnchor: null,
  templateSaveOpen: false,
  templateSaveDraft: '',
  editingTemplateId: null,
  editingTemplateSource: null,
  templateRenameDraft: '',
  focusTemplateSaveAfterRender: false,
  focusTemplateRenameAfterRender: null,
  customTemplates: loadCustomTemplates(),
  builtInTemplates: loadBuiltInTemplates(),
}

export function createTabId(): string {
  const tabId = `tab-${nextTabIndex}`
  nextTabIndex += 1

  return tabId
}
