import { getDepth, type MindNode } from '../core/mindmap'
import { OUTLINE_FALLBACK_BRANCH_COLOR, OUTLINE_MIN_TEXT_CONTRAST } from './constants'
import { clampNumber } from './mindmap/geometry'
import { state } from './state'
import type { MindNodeBackgroundStyle, OutlineBranchSource, OutlineBranchStyle, ThemeTokens } from './types'
import { getContrastRatio, hslToRgb, isHexColorInput, mixRgb, normalizeHexColor, parseHexColor, rgbToHex, rgbToHsl } from './utils/color'
import { getThemeTokens } from './theme'

const FALLBACK_DARK_TEXT = '#14161a'
const FALLBACK_LIGHT_TEXT = '#f7f8fb'

export function getMindNodeBackgroundStyle(id: string): MindNodeBackgroundStyle {
  const source = getMindNodeBackgroundSource(id)

  if (!source) {
    return {
      accentColor: OUTLINE_FALLBACK_BRANCH_COLOR,
      backgroundColor: 'color-mix(in srgb, var(--surface) 94%, transparent)',
      textColor: 'var(--text)',
      mutedColor: 'var(--muted)',
      hasTint: false,
    }
  }

  const depth = state.focusId ? getRelativeDepth(id, state.focusId) : getDepth(state.document, id)
  const depthOffset = Math.max(0, depth - source.depth)
  const accentColor = getNodeBackgroundTint(source.color, depthOffset)
  const backgroundColor = getNodeCardBackgroundColor(accentColor, depthOffset)
  const textColor = getNodeCardTextColor(backgroundColor)

  return {
    accentColor,
    backgroundColor,
    textColor,
    mutedColor: getNodeCardMutedColor(backgroundColor, textColor),
    hasTint: true,
  }
}

export function getMindNodeBackgroundSource(id: string): OutlineBranchSource | null {
  const node = state.document.nodes[id]
  const color = node?.color ?? 'neutral'

  if (!node || color === 'neutral') {
    return null
  }

  let sourceId = id
  let parentId = node.parentId

  while (parentId) {
    const parent = state.document.nodes[parentId]

    if (!parent || (parent.color ?? 'neutral') !== color) {
      break
    }

    sourceId = parentId
    parentId = parent.parentId
  }

  return {
    color: getActiveThemeTokens().nodeColors[color],
    depth: state.focusId ? getRelativeDepth(sourceId, state.focusId) : getDepth(state.document, sourceId),
  }
}

export function getNodeBackgroundTint(color: string, depthOffset: number): string {
  return getOutlineDepthColor(color, depthOffset)
}

export function getNodeCardBackgroundColor(color: string, depthOffset: number): string {
  const tokens = getActiveThemeTokens()
  const surface = parseHexColor(tokens.nodeCard.surface)
  const accent = parseHexColor(color)
  const weight = clampNumber(
    tokens.nodeCard.baseWeight - depthOffset * tokens.nodeCard.depthStep,
    tokens.nodeCard.minWeight,
    tokens.nodeCard.baseWeight,
  )

  return rgbToHex(mixRgb(surface, accent, weight))
}

export function getNodeCardTextColor(backgroundColor: string): string {
  const tokens = getActiveThemeTokens()
  const background = parseHexColor(backgroundColor)
  const themeText = parseHexColor(tokens.text)

  if (getContrastRatio(themeText, background) >= OUTLINE_MIN_TEXT_CONTRAST) {
    return rgbToHex(themeText)
  }

  const darkText = parseHexColor(FALLBACK_DARK_TEXT)
  const lightText = parseHexColor(FALLBACK_LIGHT_TEXT)

  return getContrastRatio(darkText, background) >= getContrastRatio(lightText, background)
    ? rgbToHex(darkText)
    : rgbToHex(lightText)
}

export function getNodeCardMutedColor(backgroundColor: string, textColor: string): string {
  return rgbToHex(mixRgb(parseHexColor(backgroundColor), parseHexColor(textColor), 0.62))
}

export function getOutlineBranchStyle(id: string, depth: number): OutlineBranchStyle {
  const source = getOutlineBranchSource(id)
  const inheritedDepth = source ? Math.max(0, depth - source.depth) : depth
  const baseColor = source?.color ?? OUTLINE_FALLBACK_BRANCH_COLOR
  const color = getOutlineDepthColor(baseColor, inheritedDepth)

  return {
    color,
    titleColor: getOutlineTitleColor(color, inheritedDepth),
    hasTint: depth > 0 || Boolean(source),
  }
}

export function getOutlineBranchSource(id: string): OutlineBranchSource | null {
  let currentId: string | null = id

  while (currentId) {
    const node: MindNode | undefined = state.document.nodes[currentId]

    if (!node) {
      break
    }

    if (node.edgeColor && isHexColorInput(node.edgeColor)) {
      return {
        color: normalizeHexColor(node.edgeColor),
        depth: state.focusId ? getRelativeDepth(currentId, state.focusId) : getDepth(state.document, currentId),
      }
    }

    currentId = node.parentId
  }

  return null
}

export function getInheritedTreeEdgeColor(id: string): string {
  let currentId: string | null = id

  while (currentId) {
    const node: MindNode | undefined = state.document.nodes[currentId]

    if (!node) {
      break
    }

    if (node.edgeColor && isHexColorInput(node.edgeColor)) {
      return normalizeHexColor(node.edgeColor)
    }

    currentId = node.parentId
  }

  return OUTLINE_FALLBACK_BRANCH_COLOR
}

export function getOutlineDepthColor(color: string, depthOffset: number): string {
  const tokens = getActiveThemeTokens()
  const hsl = rgbToHsl(parseHexColor(color))
  const saturationMultiplier = clampNumber(
    1 - depthOffset * tokens.outlineDepth.saturationStep,
    tokens.outlineDepth.minSaturation,
    1,
  )

  return rgbToHex(hslToRgb({
    h: hsl.h,
    s: hsl.s * saturationMultiplier,
    l: Math.min(tokens.outlineDepth.maxLightness, hsl.l + depthOffset * tokens.outlineDepth.lightnessStep),
  }))
}

export function getOutlineTitleColor(branchColor: string, depth: number): string {
  const tokens = getActiveThemeTokens()
  const textColor = parseHexColor(tokens.text)
  const surfaceColor = parseHexColor(tokens.surface)
  const branch = parseHexColor(branchColor)
  let branchWeight = clampNumber(
    tokens.outlineTitle.baseWeight + depth * tokens.outlineTitle.depthStep,
    tokens.outlineTitle.minWeight,
    tokens.outlineTitle.maxWeight,
  )
  let candidate = mixRgb(textColor, branch, branchWeight)

  while (getContrastRatio(candidate, surfaceColor) < OUTLINE_MIN_TEXT_CONTRAST && branchWeight > 0) {
    branchWeight = Math.max(0, branchWeight - 0.025)
    candidate = mixRgb(textColor, branch, branchWeight)
  }

  return rgbToHex(candidate)
}

function getActiveThemeTokens(): ThemeTokens {
  return getThemeTokens(state.theme)
}

export function getRelativeDepth(id: string, rootId: string): number {
  return Math.max(0, getDepth(state.document, id) - getDepth(state.document, rootId))
}
