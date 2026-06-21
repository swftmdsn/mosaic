import { computeMindmapLayout, type MindmapDocument, type MindmapLayoutNode } from '../../core/mindmap'
import { EDGE_ENDPOINT_OFFSET, MAP_ZOOM_BASE } from '../constants'
import type { MapEdgeRender, MapEdgeRoute, ViewportRect } from '../types'

export function getStraightEdgeRoute(from: MindmapLayoutNode, to: MindmapLayoutNode): MapEdgeRoute {
  const fromCenter = { x: from.x + from.width / 2, y: from.y + from.height / 2 }
  const toCenter = { x: to.x + to.width / 2, y: to.y + to.height / 2 }
  const dx = toCenter.x - fromCenter.x
  const dy = toCenter.y - fromCenter.y
  const start = getRectEdgePoint(from, dx, dy, EDGE_ENDPOINT_OFFSET)
  const end = getRectEdgePoint(to, -dx, -dy, EDGE_ENDPOINT_OFFSET)
  const controlX1 = start.x + (end.x - start.x) / 3
  const controlY1 = start.y + (end.y - start.y) / 3
  const controlX2 = start.x + ((end.x - start.x) * 2) / 3
  const controlY2 = start.y + ((end.y - start.y) * 2) / 3

  return {
    path: `M ${roundCanvasValue(start.x)} ${roundCanvasValue(start.y)} L ${roundCanvasValue(end.x)} ${roundCanvasValue(end.y)}`,
    startX: start.x,
    startY: start.y,
    controlX1,
    controlY1,
    controlX2,
    controlY2,
    endX: end.x,
    endY: end.y,
    midX: (start.x + end.x) / 2,
    midY: (start.y + end.y) / 2,
  }
}

export function getRectEdgePoint(
  node: MindmapLayoutNode,
  directionX: number,
  directionY: number,
  offset: number,
): { x: number; y: number } {
  const centerX = node.x + node.width / 2
  const centerY = node.y + node.height / 2
  const distance = Math.hypot(directionX, directionY)

  if (distance < 0.001) {
    return { x: centerX, y: centerY }
  }

  const halfWidth = node.width / 2
  const halfHeight = node.height / 2
  const scaleX = Math.abs(directionX) > 0.001 ? halfWidth / Math.abs(directionX) : Number.POSITIVE_INFINITY
  const scaleY = Math.abs(directionY) > 0.001 ? halfHeight / Math.abs(directionY) : Number.POSITIVE_INFINITY
  const scale = Math.min(scaleX, scaleY) + offset / distance

  return {
    x: centerX + directionX * scale,
    y: centerY + directionY * scale,
  }
}

export function getCurvedEdgeRoute(
  from: MindmapLayoutNode,
  to: MindmapLayoutNode,
): MapEdgeRoute {
  const fromCenter = { x: from.x + from.width / 2, y: from.y + from.height / 2 }
  const toCenter = { x: to.x + to.width / 2, y: to.y + to.height / 2 }
  const dx = toCenter.x - fromCenter.x
  const dy = toCenter.y - fromCenter.y
  let startX = fromCenter.x
  let startY = fromCenter.y
  let endX = toCenter.x
  let endY = toCenter.y
  let controlX1 = startX
  let controlY1 = startY
  let controlX2 = endX
  let controlY2 = endY

  if (Math.abs(dx) >= Math.abs(dy)) {
    startX = dx >= 0 ? from.x + from.width + EDGE_ENDPOINT_OFFSET : from.x - EDGE_ENDPOINT_OFFSET
    startY = fromCenter.y
    endX = dx >= 0 ? to.x - EDGE_ENDPOINT_OFFSET : to.x + to.width + EDGE_ENDPOINT_OFFSET
    endY = toCenter.y
    const control = Math.max(48, Math.abs(endX - startX) * 0.42)
    controlX1 = startX + (dx >= 0 ? control : -control)
    controlY1 = startY
    controlX2 = endX - (dx >= 0 ? control : -control)
    controlY2 = endY
  } else {
    startX = fromCenter.x
    startY = dy >= 0 ? from.y + from.height + EDGE_ENDPOINT_OFFSET : from.y - EDGE_ENDPOINT_OFFSET
    endX = toCenter.x
    endY = dy >= 0 ? to.y - EDGE_ENDPOINT_OFFSET : to.y + to.height + EDGE_ENDPOINT_OFFSET
    const control = Math.max(42, Math.abs(endY - startY) * 0.42)
    controlX1 = startX
    controlY1 = startY + (dy >= 0 ? control : -control)
    controlX2 = endX
    controlY2 = endY - (dy >= 0 ? control : -control)
  }

  return {
    path: `M ${roundCanvasValue(startX)} ${roundCanvasValue(startY)} C ${roundCanvasValue(controlX1)} ${roundCanvasValue(controlY1)}, ${roundCanvasValue(controlX2)} ${roundCanvasValue(controlY2)}, ${roundCanvasValue(endX)} ${roundCanvasValue(endY)}`,
    startX,
    startY,
    controlX1,
    controlY1,
    controlX2,
    controlY2,
    endX,
    endY,
    midX: (startX + endX) / 2,
    midY: (startY + endY) / 2,
  }
}

export function getDistanceToEdge(point: { x: number; y: number }, edge: MapEdgeRender): number {
  let previous = { x: edge.startX, y: edge.startY }
  let closest = Number.POSITIVE_INFINITY

  for (let index = 1; index <= 24; index += 1) {
    const current = getCubicBezierPoint(edge, index / 24)
    closest = Math.min(closest, getDistanceToSegment(point, previous, current))
    previous = current
  }

  return closest
}

export function getCubicBezierPoint(edge: MapEdgeRender, t: number): { x: number; y: number } {
  const inverse = 1 - t
  const startWeight = inverse ** 3
  const controlOneWeight = 3 * inverse ** 2 * t
  const controlTwoWeight = 3 * inverse * t ** 2
  const endWeight = t ** 3

  return {
    x:
      edge.startX * startWeight
      + edge.controlX1 * controlOneWeight
      + edge.controlX2 * controlTwoWeight
      + edge.endX * endWeight,
    y:
      edge.startY * startWeight
      + edge.controlY1 * controlOneWeight
      + edge.controlY2 * controlTwoWeight
      + edge.endY * endWeight,
  }
}

export function getDistanceToSegment(
  point: { x: number; y: number },
  start: { x: number; y: number },
  end: { x: number; y: number },
): number {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const lengthSquared = dx * dx + dy * dy

  if (lengthSquared === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y)
  }

  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared))
  const projection = {
    x: start.x + dx * t,
    y: start.y + dy * t,
  }

  return Math.hypot(point.x - projection.x, point.y - projection.y)
}

export function getViewportRect(startX: number, startY: number, currentX: number, currentY: number): ViewportRect {
  return {
    left: Math.min(startX, currentX),
    top: Math.min(startY, currentY),
    right: Math.max(startX, currentX),
    bottom: Math.max(startY, currentY),
  }
}

export function getDefaultMapPan(documentUpdate: MindmapDocument, zoom: number): { x: number; y: number } {
  const layout = computeMindmapLayout(documentUpdate, null)
  const rootId = documentUpdate.rootId ?? documentUpdate.rootIds[0]
  const rootLayout = rootId ? layout.get(rootId) : null
  const viewportWidth = typeof window === 'undefined' ? 1500 : window.innerWidth
  const viewportHeight = typeof window === 'undefined' ? 838 : window.innerHeight

  if (!rootLayout) {
    return { x: viewportWidth / 2 - 110, y: viewportHeight / 2 - 56 }
  }

  return {
    x: viewportWidth / 2 - (rootLayout.x + rootLayout.width / 2) * zoom,
    y: viewportHeight / 2 - (rootLayout.y + rootLayout.height / 2) * zoom,
  }
}

export function clampZoom(value: number): number {
  return Math.min(3.5, Math.max(0.2, value))
}

export function getDisplayZoomPercent(zoom: number): number {
  return Math.round((zoom / MAP_ZOOM_BASE) * 100)
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function roundCanvasValue(value: number): number {
  return Math.round(value * 100) / 100
}
