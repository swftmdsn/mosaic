import type { EdgeArrowMode, MindmapDocument, NodeColor, ViewMode } from '../core/mindmap'

export type ThemeMode = 'light' | 'sage' | 'dark' | 'carbon' | 'tokyo-night' | 'tarracota'

export type ThemeTone = 'light' | 'dark'

export type FileFormat = 'mosaic'

export type ExportFormat = 'mosaic'

export type ImagePlacement = 'inline' | 'below'

export type EdgeKind = 'tree' | 'link'

export type OutlineDropPosition = 'before' | 'after' | 'inside'

export type SettingsTab = 'view' | 'export' | 'shortcuts'

export type FrontmatterMode = 'preview' | 'yaml'

export type ShortcutGroup = 'Global' | 'Editing' | 'Outline' | 'Mindmap'

export type ShortcutId =
  | 'undo'
  | 'redo'
  | 'newTab'
  | 'openFile'
  | 'toggleView'
  | 'commandPalette'
  | 'save'
  | 'closePanel'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'lineBreak'
  | 'newOutlineLine'
  | 'addRootOutlineLine'
  | 'selectPreviousLine'
  | 'selectNextLine'
  | 'extendSelectionUp'
  | 'extendSelectionDown'
  | 'selectAllLines'
  | 'indentLine'
  | 'outdentLine'
  | 'outdentOrClearFocus'
  | 'deleteEmptyLine'
  | 'deleteSelection'
  | 'deleteSelectionOnly'
  | 'moveLineUp'
  | 'moveLineDown'
  | 'toggleCollapse'
  | 'outlineLeft'
  | 'outlineRight'
  | 'mindmapSelectAllNodes'
  | 'mindmapAddChild'
  | 'mindmapAddSibling'
  | 'mindmapDelete'
  | 'mindmapDeleteOnly'
  | 'mindmapMoveUp'
  | 'mindmapMoveDown'
  | 'mindmapMoveLeft'
  | 'mindmapMoveRight'
  | 'mindmapBreakLink'

export type ShortcutDefinition = {
  id: ShortcutId
  label: string
  group: ShortcutGroup
  defaultCombo: string
}

export type IconName =
  | 'arrowDown'
  | 'arrowRight'
  | 'arrowUp'
  | 'bookDashed'
  | 'bold'
  | 'code'
  | 'command'
  | 'cornerDownRight'
  | 'copy'
  | 'download'
  | 'focus'
  | 'focusOff'
  | 'folder'
  | 'grip'
  | 'highlighter'
  | 'image'
  | 'indent'
  | 'italic'
  | 'keyboard'
  | 'link'
  | 'list'
  | 'map'
  | 'nodeLink'
  | 'moon'
  | 'outdent'
  | 'plus'
  | 'resize'
  | 'save'
  | 'settings'
  | 'strike'
  | 'sun'
  | 'underline'
  | 'x'

export type HistorySnapshot = {
  document: MindmapDocument
  selectedId: string | null
  selectedIds: string[]
  frontmatterEnabled: boolean
}

export type LocalFileHandle = {
  name: string
  path?: string
  fullPath?: string
  getFile(): Promise<File>
  createWritable(): Promise<{
    write(data: Blob): Promise<void>
    close(): Promise<void>
  }>
}

export type FilePickerWindow = Window &
  typeof globalThis & {
    showOpenFilePicker?: (options?: unknown) => Promise<LocalFileHandle[]>
    showSaveFilePicker?: (options?: unknown) => Promise<LocalFileHandle>
  }

export type CommandItem = {
  action: string
  label: string
  hint: string
  keywords: string
}

export type TemplateSource = 'builtin' | 'custom'

export type TemplateMenuAnchor = 'header' | 'starter'

export type TemplateApplyTarget = 'current' | 'newTab'

export type TemplateNode = {
  markdown: string
  children: TemplateNode[]
}

export type MindmapTemplate = {
  id: string
  label: string
  root: TemplateNode
}

export type AppTheme = {
  id: ThemeMode
  label: string
  tone: ThemeTone
  color: string
  stroke: string
  tokens: ThemeTokens
}

export type ThemeTokens = {
  canvas: string
  surface: string
  surfaceSoft: string
  surfaceHover: string
  text: string
  muted: string
  faint: string
  border: string
  borderStrong: string
  accent: string
  accentSoft: string
  danger: string
  solidControl: string
  solidControlHover: string
  solidControlText: string
  tooltipSurface: string
  tooltipText: string
  centralNodeSurface: string
  centralNodeText: string
  glintSilver: string
  glintSilverBright: string
  glintSilverShadow: string
  nodeColors: Record<NodeColor, string>
  nodeCard: ThemeNodeCardTokens
  outlineDepth: ThemeOutlineDepthTokens
  outlineTitle: ThemeOutlineTitleTokens
}

export type ThemeNodeCardTokens = {
  surface: string
  baseWeight: number
  minWeight: number
  depthStep: number
}

export type ThemeOutlineDepthTokens = {
  saturationStep: number
  minSaturation: number
  lightnessStep: number
  maxLightness: number
}

export type ThemeOutlineTitleTokens = {
  baseWeight: number
  minWeight: number
  maxWeight: number
  depthStep: number
}

export type MapEdgeRender = {
  kind: EdgeKind
  id: string
  fromId: string
  toId: string
  path: string
  label: string
  color: string
  arrows: EdgeArrowMode
  startX: number
  startY: number
  controlX1: number
  controlY1: number
  controlX2: number
  controlY2: number
  endX: number
  endY: number
  midX: number
  midY: number
}

export type MapEdgeRoute = {
  path: string
  startX: number
  startY: number
  controlX1: number
  controlY1: number
  controlX2: number
  controlY2: number
  endX: number
  endY: number
  midX: number
  midY: number
}

export type CommandToast = {
  id: number
  message: string
}

export type CommandSelection = {
  nodeId: string
  start: number
  end: number
  text: string
}

export type ExportAsset = {
  originalSrc: string
  exportSrc: string
  zipPath: string
  data: Uint8Array
}

export type ActiveEdgeColor = {
  kind: EdgeKind
  id: string
}

export type SaveIndicator = {
  variant: 'saved' | 'dirty' | 'unsaved'
  label: string
  detail: string
  location: string
  action: string
  canSave: boolean
}

export type OutlineBranchStyle = {
  color: string
  titleColor: string
  hasTint: boolean
}

export type MindNodeBackgroundStyle = {
  accentColor: string
  backgroundColor: string
  textColor: string
  mutedColor: string
  hasTint: boolean
}

export type OutlineBranchSource = {
  color: string
  depth: number
}

export type MarkdownLinkEditor = {
  nodeId: string
  start: number
  end: number
}

export type MarkdownLinkPrompt = {
  url: string
  label: string
  x: number
  y: number
}

export type ViewportRect = {
  left: number
  top: number
  right: number
  bottom: number
}

export type SettingsExportPayload = {
  version: 1
  settings: {
    theme: ThemeMode
    outlineWidth: number
    defaultImageWidth: number
    imagePlacement: ImagePlacement
    trackpadSpeed: number
    defaultExportFormat: ExportFormat
    autoSaveSeconds: number
    commandToastEnabled: boolean
    starterDismissed: boolean
    customTemplates: MindmapTemplate[]
    builtInTemplates: MindmapTemplate[]
    shortcuts: Record<ShortcutId, string>
  }
}

export type DocumentTab = {
  id: string
  document: MindmapDocument
  view: ViewMode
  selectedId: string | null
  selectedIds: string[]
  selectionAnchorId: string | null
  focusId: string | null
  dirty: boolean
  fileName: string
  fileFormat: FileFormat
  fileHandle: LocalFileHandle | null
  zoom: number
  pan: {
    x: number
    y: number
  }
  outlineScroll: {
    top: number
    left: number
  }
  frontmatterEnabled: boolean
  frontmatterOpen: boolean
  frontmatterMode: FrontmatterMode
  pendingLinkFrom: string | null
  imageTargetId: string | null
  historyPast: HistorySnapshot[]
  historyFuture: HistorySnapshot[]
}

export type AppState = {
  document: MindmapDocument
  tabs: DocumentTab[]
  activeTabId: string
  editingTabId: string | null
  editingEdge: {
    kind: EdgeKind
    id: string
  } | null
  view: ViewMode
  selectedId: string | null
  selectedIds: string[]
  selectionAnchorId: string | null
  focusId: string | null
  commandQuery: string
  commandSelection: CommandSelection | null
  dirty: boolean
  fileName: string
  fileFormat: FileFormat
  fileHandle: LocalFileHandle | null
  status: string
  theme: ThemeMode
  zoom: number
  pan: {
    x: number
    y: number
  }
  outlineScroll: {
    top: number
    left: number
  }
  outlineWidth: number
  defaultImageWidth: number
  imagePlacement: ImagePlacement
  trackpadSpeed: number
  defaultExportFormat: ExportFormat
  autoSaveSeconds: number
  commandOpen: boolean
  saveMenuOpen: boolean
  settingsOpen: boolean
  themeMenuOpen: boolean
  linkEditor: MarkdownLinkEditor | null
  activeMarkdownLink: MarkdownLinkPrompt | null
  focusLinkEditorAfterRender: boolean
  frontmatterEnabled: boolean
  frontmatterOpen: boolean
  frontmatterMode: FrontmatterMode
  pendingLinkFrom: string | null
  imageTargetId: string | null
  historyPast: HistorySnapshot[]
  historyFuture: HistorySnapshot[]
  focusAfterRender: string | null
  focusCommandAfterRender: boolean
  settingsTab: SettingsTab
  shortcuts: Record<ShortcutId, string>
  shortcutCaptureId: ShortcutId | null
  shortcutConflictMessage: string
  activeEdgeColor: ActiveEdgeColor | null
  activeNodeBackgroundId: string | null
  commandToastEnabled: boolean
  commandToast: CommandToast | null
  pendingCloseTabId: string | null
  outlineDepthControlsExpanded: boolean
  starterDismissed: boolean
  templateMenuAnchor: TemplateMenuAnchor | null
  templateSaveOpen: boolean
  templateSaveDraft: string
  editingTemplateId: string | null
  editingTemplateSource: TemplateSource | null
  templateRenameDraft: string
  focusTemplateSaveAfterRender: boolean
  focusTemplateRenameAfterRender: string | null
  customTemplates: MindmapTemplate[]
  builtInTemplates: MindmapTemplate[]
}
