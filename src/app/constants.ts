import type { EdgeArrowMode, FilePropertyType } from '../core/mindmap'
import type { AppTheme, FrontmatterMode, ShortcutDefinition, ShortcutId } from './types'

export const DEFAULT_FRONTMATTER_MODE: FrontmatterMode = 'preview'

export const FILE_PROPERTY_TYPES: { type: FilePropertyType; label: string }[] = [
  { type: 'text', label: 'Text' },
  { type: 'number', label: 'Number' },
  { type: 'boolean', label: 'Boolean' },
  { type: 'date', label: 'Date' },
  { type: 'list', label: 'List' },
  { type: 'url', label: 'URL' },
  { type: 'object', label: 'Object' },
]

export const EDGE_COLOR_PRESETS = [
  '#6b7280',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
]

export const APP_THEMES: AppTheme[] = [
  {
    id: 'light',
    label: 'Light',
    tone: 'light',
    color: '#f6f7f9',
    stroke: '#8892a0',
    tokens: {
      canvas: '#f6f7f9',
      surface: '#ffffff',
      surfaceSoft: '#f1f3f6',
      surfaceHover: '#e8ebf0',
      text: '#14161a',
      muted: '#626a75',
      faint: '#9aa2ad',
      border: '#dde2e8',
      borderStrong: '#c6ced8',
      accent: '#315fcd',
      accentSoft: '#e8efff',
      danger: '#b42318',
      solidControl: '#232832',
      solidControlHover: '#1b2029',
      solidControlText: '#f7f8fb',
      tooltipSurface: '#232832',
      tooltipText: '#f7f8fb',
      centralNodeSurface: '#202733',
      centralNodeText: '#f7f8fb',
      glintSilver: '#cbd5e1',
      glintSilverBright: '#ffffff',
      glintSilverShadow: '#94a3b8',
      nodeColors: {
        neutral: '#6b7280',
        blue: '#3b82f6',
        green: '#1fa06b',
        amber: '#d97706',
        rose: '#e11d48',
        violet: '#7c3aed',
      },
      nodeCard: {
        surface: '#ffffff',
        baseWeight: 0.18,
        minWeight: 0.07,
        depthStep: 0.032,
      },
      outlineDepth: {
        saturationStep: 0.2,
        minSaturation: 0.22,
        lightnessStep: 0.042,
        maxLightness: 0.84,
      },
      outlineTitle: {
        baseWeight: 0.16,
        minWeight: 0.16,
        maxWeight: 0.36,
        depthStep: 0.045,
      },
    },
  },
  {
    id: 'sage',
    label: 'Sage',
    tone: 'light',
    color: '#eef3ee',
    stroke: '#4f8a68',
    tokens: {
      canvas: '#eef3ee',
      surface: '#fbfdf9',
      surfaceSoft: '#e3ece3',
      surfaceHover: '#d9e5da',
      text: '#1f2a24',
      muted: '#607268',
      faint: '#90a197',
      border: '#d2ded4',
      borderStrong: '#b5c7ba',
      accent: '#4f8a68',
      accentSoft: '#e3f0e8',
      danger: '#a3473b',
      solidControl: '#25352d',
      solidControlHover: '#1e2b25',
      solidControlText: '#f7fbf6',
      tooltipSurface: '#25352d',
      tooltipText: '#f7fbf6',
      centralNodeSurface: '#263a31',
      centralNodeText: '#f7fbf6',
      glintSilver: '#d6e4d8',
      glintSilverBright: '#ffffff',
      glintSilverShadow: '#9fb3a5',
      nodeColors: {
        neutral: '#6f7d73',
        blue: '#4d79a7',
        green: '#4f8a68',
        amber: '#b8873f',
        rose: '#be6864',
        violet: '#7d6fa0',
      },
      nodeCard: {
        surface: '#fbfdf9',
        baseWeight: 0.18,
        minWeight: 0.07,
        depthStep: 0.032,
      },
      outlineDepth: {
        saturationStep: 0.18,
        minSaturation: 0.24,
        lightnessStep: 0.038,
        maxLightness: 0.82,
      },
      outlineTitle: {
        baseWeight: 0.18,
        minWeight: 0.16,
        maxWeight: 0.38,
        depthStep: 0.04,
      },
    },
  },
  {
    id: 'dark',
    label: 'Dark',
    tone: 'dark',
    color: '#0c0d10',
    stroke: '#dce2eb',
    tokens: {
      canvas: '#0c0d10',
      surface: '#15171c',
      surfaceSoft: '#1e2229',
      surfaceHover: '#292e37',
      text: '#f2f4f7',
      muted: '#a6adb8',
      faint: '#767f8e',
      border: '#2a3039',
      borderStrong: '#444c58',
      accent: '#8fb5ff',
      accentSoft: '#1c2a43',
      danger: '#ff8f83',
      solidControl: '#e3e7ee',
      solidControlHover: '#ccd3dd',
      solidControlText: '#111318',
      tooltipSurface: '#e3e7ee',
      tooltipText: '#111318',
      centralNodeSurface: '#242b36',
      centralNodeText: '#f4f7fb',
      glintSilver: '#dce4ef',
      glintSilverBright: '#ffffff',
      glintSilverShadow: '#8794a5',
      nodeColors: {
        neutral: '#9aa4b2',
        blue: '#8fb5ff',
        green: '#72d39b',
        amber: '#f2b766',
        rose: '#ff8aa1',
        violet: '#b89cff',
      },
      nodeCard: {
        surface: '#15171c',
        baseWeight: 0.34,
        minWeight: 0.14,
        depthStep: 0.04,
      },
      outlineDepth: {
        saturationStep: 0.2,
        minSaturation: 0.2,
        lightnessStep: 0.026,
        maxLightness: 0.72,
      },
      outlineTitle: {
        baseWeight: 0.3,
        minWeight: 0.16,
        maxWeight: 0.3,
        depthStep: -0.018,
      },
    },
  },
  {
    id: 'carbon',
    label: 'Carbon',
    tone: 'dark',
    color: '#101312',
    stroke: '#7bc4b6',
    tokens: {
      canvas: '#101312',
      surface: '#181d1b',
      surfaceSoft: '#222a27',
      surfaceHover: '#2d3733',
      text: '#eef3ef',
      muted: '#a7b4ac',
      faint: '#78877f',
      border: '#2d3834',
      borderStrong: '#4b5a54',
      accent: '#7bc4b6',
      accentSoft: '#193631',
      danger: '#ff9185',
      solidControl: '#dce8e1',
      solidControlHover: '#c6d7ce',
      solidControlText: '#101312',
      tooltipSurface: '#dce8e1',
      tooltipText: '#101312',
      centralNodeSurface: '#203a34',
      centralNodeText: '#f1fbf7',
      glintSilver: '#d4ebe4',
      glintSilverBright: '#ffffff',
      glintSilverShadow: '#7d9289',
      nodeColors: {
        neutral: '#95a39c',
        blue: '#8ab6d6',
        green: '#7bcf9c',
        amber: '#e7bd72',
        rose: '#f28d9a',
        violet: '#bca6e8',
      },
      nodeCard: {
        surface: '#181d1b',
        baseWeight: 0.33,
        minWeight: 0.14,
        depthStep: 0.038,
      },
      outlineDepth: {
        saturationStep: 0.19,
        minSaturation: 0.22,
        lightnessStep: 0.026,
        maxLightness: 0.73,
      },
      outlineTitle: {
        baseWeight: 0.3,
        minWeight: 0.16,
        maxWeight: 0.32,
        depthStep: -0.016,
      },
    },
  },
  {
    id: 'tokyo-night',
    label: 'Tokyo Night',
    tone: 'dark',
    color: '#171925',
    stroke: '#84a9ff',
    tokens: {
      canvas: '#171925',
      surface: '#202538',
      surfaceSoft: '#2a3148',
      surfaceHover: '#35405d',
      text: '#d6defe',
      muted: '#a8b3dd',
      faint: '#7884bd',
      border: '#303852',
      borderStrong: '#56628d',
      accent: '#84a9ff',
      accentSoft: '#202d4f',
      danger: '#ff7f96',
      solidControl: '#8ab4ff',
      solidControlHover: '#a2c3ff',
      solidControlText: '#141722',
      tooltipSurface: '#d8e0ff',
      tooltipText: '#141722',
      centralNodeSurface: '#263761',
      centralNodeText: '#edf1ff',
      glintSilver: '#d8e0ff',
      glintSilverBright: '#ffffff',
      glintSilverShadow: '#7080bf',
      nodeColors: {
        neutral: '#7f8ab8',
        blue: '#84a9ff',
        green: '#9ece6a',
        amber: '#e0af68',
        rose: '#ff7f96',
        violet: '#bb9af7',
      },
      nodeCard: {
        surface: '#202538',
        baseWeight: 0.32,
        minWeight: 0.14,
        depthStep: 0.038,
      },
      outlineDepth: {
        saturationStep: 0.18,
        minSaturation: 0.24,
        lightnessStep: 0.03,
        maxLightness: 0.76,
      },
      outlineTitle: {
        baseWeight: 0.32,
        minWeight: 0.18,
        maxWeight: 0.34,
        depthStep: -0.015,
      },
    },
  },
  {
    id: 'tarracota',
    label: 'Terracotta',
    tone: 'light',
    color: '#b86445',
    stroke: '#573f37',
    tokens: {
      canvas: '#f6eee6',
      surface: '#fffaf4',
      surfaceSoft: '#f0e1d6',
      surfaceHover: '#e7d3c4',
      text: '#33221d',
      muted: '#745e55',
      faint: '#9b7c6f',
      border: '#d9c4b6',
      borderStrong: '#bd9f8f',
      accent: '#b86445',
      accentSoft: '#f4ded3',
      danger: '#994635',
      solidControl: '#573f37',
      solidControlHover: '#44312b',
      solidControlText: '#fff8f1',
      tooltipSurface: '#573f37',
      tooltipText: '#fff8f1',
      centralNodeSurface: '#573f37',
      centralNodeText: '#fff8f1',
      glintSilver: '#ebcbb9',
      glintSilverBright: '#fff8f1',
      glintSilverShadow: '#ad806c',
      nodeColors: {
        neutral: '#8a756b',
        blue: '#4f75a8',
        green: '#5f8f66',
        amber: '#c58a37',
        rose: '#c65b5b',
        violet: '#89639a',
      },
      nodeCard: {
        surface: '#fffaf4',
        baseWeight: 0.18,
        minWeight: 0.07,
        depthStep: 0.032,
      },
      outlineDepth: {
        saturationStep: 0.19,
        minSaturation: 0.24,
        lightnessStep: 0.036,
        maxLightness: 0.82,
      },
      outlineTitle: {
        baseWeight: 0.18,
        minWeight: 0.16,
        maxWeight: 0.38,
        depthStep: 0.042,
      },
    },
  },
]

export const EDGE_ARROW_MODES: { mode: EdgeArrowMode; label: string }[] = [
  { mode: 'none', label: 'No arrows' },
  { mode: 'start', label: 'Start arrow' },
  { mode: 'end', label: 'End arrow' },
  { mode: 'both', label: 'Both arrows' },
]

export const OUTLINE_FALLBACK_BRANCH_COLOR = '#6b7280'

export const OUTLINE_MIN_TEXT_CONTRAST = 4.8

export const OUTLINE_WIDTH_MARKS = [680, 760, 900, 1024, 1180]

export const IMAGE_WIDTH_MARKS = [640, 1080, 1920, 2560, 3840]

export const TRACKPAD_SPEED_MIN = 0.25

export const TRACKPAD_SPEED_MAX = 4

export const TRACKPAD_SPEED_DEFAULT = 1

export const TRACKPAD_SPEED_MARKS = [0.25, 0.5, 1, 2, 4]

export const TRACKPAD_BASE_PAN_SCALE = 3.06

export const TRACKPAD_BASE_ZOOM_SCALE = 3.1

export const MAP_ZOOM_BASE = 0.85

export const MAP_ZOOM_DISPLAY_STEP = MAP_ZOOM_BASE * 0.1

export const MAP_KEYBOARD_NUDGE = 24

export const MAP_CLICK_HIT_SLOP = 24

export const MAP_AREA_SELECTION_THRESHOLD = 4

export const MAP_EDGE_CLICK_HIT_SLOP = 12

export const CANVAS_IMAGE_DEFAULT_WIDTH = 320

export const CANVAS_LINK_DEFAULT_WIDTH = 286

export const CANVAS_LINK_DEFAULT_HEIGHT = 132

export const CANVAS_LINK_THUMBNAIL_HEIGHT = 188

export const CANVAS_IMAGE_MIN_WIDTH = 96

export const CANVAS_IMAGE_MAX_WIDTH = 1920

export const CANVAS_LINK_MIN_WIDTH = 190

export const CANVAS_LINK_MAX_WIDTH = 720

export const CANVAS_LINK_MIN_HEIGHT = 104

export const CANVAS_LINK_MAX_HEIGHT = 520

export const STARTER_DISMISSED_STORAGE_KEY = 'mosaic-starter-dismissed'

export const CUSTOM_TEMPLATES_STORAGE_KEY = 'mosaic-custom-templates'

export const BUILT_IN_TEMPLATES_STORAGE_KEY = 'mosaic-built-in-templates'

export const SHORTCUT_TOOLTIP_DELAY_MS = 400

export const SHORTCUT_DEFINITIONS: ShortcutDefinition[] = [
  { id: 'undo', label: 'Undo', group: 'Global', defaultCombo: 'Mod+Z' },
  { id: 'redo', label: 'Redo', group: 'Global', defaultCombo: 'Mod+Shift+Z' },
  { id: 'newTab', label: 'New tab', group: 'Global', defaultCombo: 'Mod+T' },
  { id: 'openFile', label: 'Open file', group: 'Global', defaultCombo: 'Mod+O' },
  { id: 'toggleView', label: 'Toggle outline/map view', group: 'Global', defaultCombo: 'Shift+Tab' },
  { id: 'commandPalette', label: 'Command palette', group: 'Global', defaultCombo: 'Mod+K' },
  { id: 'save', label: 'Save file', group: 'Global', defaultCombo: 'Mod+S' },
  { id: 'closePanel', label: 'Close palette or panel', group: 'Global', defaultCombo: 'Escape' },
  { id: 'bold', label: 'Bold', group: 'Editing', defaultCombo: 'Mod+B' },
  { id: 'italic', label: 'Italic', group: 'Editing', defaultCombo: 'Mod+I' },
  { id: 'underline', label: 'Underline', group: 'Editing', defaultCombo: 'Mod+U' },
  { id: 'lineBreak', label: 'Edit line or insert line break', group: 'Outline', defaultCombo: 'Enter' },
  { id: 'newOutlineLine', label: 'Create line below', group: 'Outline', defaultCombo: 'Shift+Enter' },
  { id: 'addRootOutlineLine', label: 'Add root line', group: 'Outline', defaultCombo: 'Mod+N' },
  { id: 'selectPreviousLine', label: 'Select previous line', group: 'Outline', defaultCombo: 'ArrowUp' },
  { id: 'selectNextLine', label: 'Select next line', group: 'Outline', defaultCombo: 'ArrowDown' },
  { id: 'extendSelectionUp', label: 'Extend selection up', group: 'Outline', defaultCombo: 'Mod+Shift+ArrowUp' },
  { id: 'extendSelectionDown', label: 'Extend selection down', group: 'Outline', defaultCombo: 'Mod+Shift+ArrowDown' },
  { id: 'selectAllLines', label: 'Select all lines', group: 'Outline', defaultCombo: 'Mod+A' },
  { id: 'indentLine', label: 'Indent line', group: 'Outline', defaultCombo: 'Tab' },
  { id: 'outdentLine', label: 'Outdent line', group: 'Outline', defaultCombo: 'Shift+Tab' },
  { id: 'outdentOrClearFocus', label: 'Outdent or clear focus', group: 'Outline', defaultCombo: 'Escape' },
  { id: 'deleteEmptyLine', label: 'Delete empty line', group: 'Outline', defaultCombo: 'Backspace' },
  { id: 'deleteSelection', label: 'Delete selected lines and children', group: 'Outline', defaultCombo: 'Delete' },
  { id: 'deleteSelectionOnly', label: 'Delete selected lines only', group: 'Outline', defaultCombo: 'Shift+Delete' },
  { id: 'moveLineUp', label: 'Move selected lines up', group: 'Outline', defaultCombo: 'Shift+ArrowUp' },
  { id: 'moveLineDown', label: 'Move selected lines down', group: 'Outline', defaultCombo: 'Shift+ArrowDown' },
  { id: 'toggleCollapse', label: 'Collapse or expand line', group: 'Outline', defaultCombo: 'Mod+.' },
  { id: 'outlineLeft', label: 'Collapse or select parent', group: 'Outline', defaultCombo: 'ArrowLeft' },
  { id: 'outlineRight', label: 'Expand or select child', group: 'Outline', defaultCombo: 'ArrowRight' },
  { id: 'mindmapSelectAllNodes', label: 'Select all nodes', group: 'Mindmap', defaultCombo: 'Mod+A' },
  { id: 'mindmapAddChild', label: 'Add child node', group: 'Mindmap', defaultCombo: 'Tab' },
  { id: 'mindmapAddSibling', label: 'Add sibling node', group: 'Mindmap', defaultCombo: 'Shift+Enter' },
  { id: 'mindmapDelete', label: 'Delete selected node and children', group: 'Mindmap', defaultCombo: 'Delete' },
  { id: 'mindmapDeleteOnly', label: 'Delete selected node only', group: 'Mindmap', defaultCombo: 'Shift+Delete' },
  { id: 'mindmapMoveUp', label: 'Move selected node up', group: 'Mindmap', defaultCombo: 'Shift+ArrowUp' },
  { id: 'mindmapMoveDown', label: 'Move selected node down', group: 'Mindmap', defaultCombo: 'Shift+ArrowDown' },
  { id: 'mindmapMoveLeft', label: 'Move selected node left', group: 'Mindmap', defaultCombo: 'Shift+ArrowLeft' },
  { id: 'mindmapMoveRight', label: 'Move selected node right', group: 'Mindmap', defaultCombo: 'Shift+ArrowRight' },
  { id: 'mindmapBreakLink', label: 'Break link', group: 'Mindmap', defaultCombo: 'Alt+Click' },
]

export const DEFAULT_SHORTCUTS = Object.fromEntries(
  SHORTCUT_DEFINITIONS.map((shortcut) => [shortcut.id, shortcut.defaultCombo]),
) as Record<ShortcutId, string>

export const LEGACY_SHORTCUT_DEFAULTS = {
  extendSelectionUp: 'Shift+ArrowUp',
  extendSelectionDown: 'Shift+ArrowDown',
  moveLineUp: 'Mod+ArrowUp',
  moveLineDown: 'Mod+ArrowDown',
  mindmapAddChild: 'Enter',
  mindmapAddSibling: 'Tab',
  toggleView: '',
} satisfies Partial<Record<ShortcutId, string>>

export const EDGE_ENDPOINT_OFFSET = 1

export const EDGE_COLOR_POPOVER_OFFSET_Y = 18
