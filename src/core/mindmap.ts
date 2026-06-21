export type ViewMode = 'list' | 'mindmap'
export type LayoutMode = 'horizontal' | 'vertical'
export type NodeColor = 'neutral' | 'blue' | 'green' | 'amber' | 'rose' | 'violet'
export type EdgeArrowMode = 'none' | 'start' | 'end' | 'both'
export type FilePropertyType = 'boolean' | 'date' | 'list' | 'number' | 'object' | 'text' | 'url'

export type FileProperty = {
  id: string
  key: string
  type: FilePropertyType
  value: string
}

export type MindNode = {
  id: string
  parentId: string | null
  children: string[]
  markdown: string
  collapsed: boolean
  color?: NodeColor
  edgeLabel?: string
  edgeColor?: string
  edgeArrows?: EdgeArrowMode
  position?: {
    x: number
    y: number
  }
  createdAt?: string
  updatedAt?: string
}

export type MindLink = {
  id: string
  from: string
  to: string
  label?: string
  color?: string
  arrows?: EdgeArrowMode
}

export type CanvasImageItem = {
  id: string
  type: 'image'
  x: number
  y: number
  width: number
  src: string
  alt?: string
}

export type CanvasLinkItem = {
  id: string
  type: 'link'
  x: number
  y: number
  width: number
  height?: number
  url: string
  title?: string
  description?: string
  provider?: string
  image?: string
  favicon?: string
  previewKind?: 'bookmark' | 'article' | 'video'
}

export type CanvasItem = CanvasImageItem | CanvasLinkItem

export type MindmapDocument = {
  title: string
  rootId: string | null
  rootIds: string[]
  nodes: Record<string, MindNode>
  links: MindLink[]
  canvasItems: CanvasItem[]
  fileProperties: FileProperty[]
  defaultView: ViewMode
  layout: LayoutMode
  assetsFolder: string
}

export type MindmapLayoutNode = {
  id: string
  x: number
  y: number
  width: number
  height: number
}

type JsonRecord = Record<string, unknown>

type ParsedFrontmatter = {
  title?: string
  fileProperties: FileProperty[]
  mindmap: {
    defaultView?: ViewMode
    layout?: LayoutMode
    root?: string
  }
  nodes: Record<
    string,
    {
      collapsed?: boolean
      color?: NodeColor
      edgeLabel?: string
      edgeColor?: string
      edgeArrows?: EdgeArrowMode
      x?: number
      y?: number
    }
  >
  assets: {
    folder?: string
  }
  links: MindLink[]
  canvasItems: CanvasItem[]
}

type ParsedCanvasFrontmatterItem = {
  id?: string
  type?: CanvasItem['type']
  x?: number
  y?: number
  width?: number
  src?: string
  alt?: string
  url?: string
  title?: string
  description?: string
  height?: number
  provider?: string
  image?: string
  favicon?: string
  previewKind?: CanvasLinkItem['previewKind']
}

const NODE_ID_PATTERN = /\s*\{#([A-Za-z0-9_-]+)\}\s*$/
const DEFAULT_ASSETS_FOLDER = './assets'
const NODE_COLORS: NodeColor[] = ['neutral', 'blue', 'green', 'amber', 'rose', 'violet']
const EDGE_ARROW_MODES: EdgeArrowMode[] = ['none', 'start', 'end', 'both']
const RESERVED_FRONTMATTER_SECTIONS = new Set(['assets', 'canvas', 'links', 'mindmap', 'nodes', 'title'])

export function createNewMindmap(): MindmapDocument {
  return {
    title: '',
    rootId: 'node-root',
    rootIds: ['node-root'],
    defaultView: 'list',
    layout: 'horizontal',
    assetsFolder: DEFAULT_ASSETS_FOLDER,
    links: [],
    canvasItems: [],
    fileProperties: [],
    nodes: {
      'node-root': {
        id: 'node-root',
        parentId: null,
        children: [],
        markdown: '',
        collapsed: false,
        color: 'neutral',
        position: { x: 0, y: 0 },
      },
    },
  }
}

export function createSampleMindmap(): MindmapDocument {
  return {
    title: 'Philosophy of mind',
    rootId: 'node-root',
    rootIds: ['node-root'],
    defaultView: 'mindmap',
    layout: 'horizontal',
    assetsFolder: DEFAULT_ASSETS_FOLDER,
    links: [],
    canvasItems: [],
    fileProperties: [
      {
        id: 'property-status',
        key: 'status',
        type: 'text',
        value: 'draft',
      },
      {
        id: 'property-topic',
        key: 'topic',
        type: 'text',
        value: 'philosophy',
      },
      {
        id: 'property-tags',
        key: 'tags',
        type: 'list',
        value: 'mind, consciousness, identity',
      },
    ],
    nodes: {
      'node-root': {
        id: 'node-root',
        parentId: null,
        children: ['node-mind-body', 'node-consciousness', 'node-intentionality', 'node-identity'],
        markdown: '# Philosophy of mind',
        collapsed: false,
        color: 'neutral',
        position: { x: 584, y: 285 },
      },
      'node-mind-body': {
        id: 'node-mind-body',
        parentId: 'node-root',
        children: ['node-dualism', 'node-physicalism'],
        markdown: 'Mind-body problem',
        collapsed: false,
        color: 'blue',
        edgeColor: '#3b82f6',
        position: { x: 292, y: 95 },
      },
      'node-dualism': {
        id: 'node-dualism',
        parentId: 'node-mind-body',
        children: [],
        markdown: 'Dualism: mind and body are distinct',
        collapsed: false,
        color: 'blue',
        edgeColor: '#3b82f6',
        position: { x: 0, y: 0 },
      },
      'node-physicalism': {
        id: 'node-physicalism',
        parentId: 'node-mind-body',
        children: [],
        markdown: 'Physicalism: mental states depend on physical states',
        collapsed: false,
        color: 'blue',
        edgeColor: '#3b82f6',
        position: { x: 0, y: 190 },
      },
      'node-consciousness': {
        id: 'node-consciousness',
        parentId: 'node-root',
        children: ['node-qualia', 'node-hard-problem'],
        markdown: 'Consciousness',
        collapsed: false,
        color: 'violet',
        edgeColor: '#8b5cf6',
        position: { x: 876, y: 95 },
      },
      'node-qualia': {
        id: 'node-qualia',
        parentId: 'node-consciousness',
        children: [],
        markdown: 'Qualia: what experience feels like from the inside',
        collapsed: false,
        color: 'violet',
        edgeColor: '#8b5cf6',
        position: { x: 1168, y: 0 },
      },
      'node-hard-problem': {
        id: 'node-hard-problem',
        parentId: 'node-consciousness',
        children: [],
        markdown: 'Hard problem: why physical processes have subjective feel',
        collapsed: false,
        color: 'violet',
        edgeColor: '#8b5cf6',
        position: { x: 1168, y: 190 },
      },
      'node-intentionality': {
        id: 'node-intentionality',
        parentId: 'node-root',
        children: ['node-aboutness', 'node-content'],
        markdown: 'Intentionality',
        collapsed: false,
        color: 'green',
        edgeColor: '#22c55e',
        position: { x: 876, y: 475 },
      },
      'node-aboutness': {
        id: 'node-aboutness',
        parentId: 'node-intentionality',
        children: [],
        markdown: 'Aboutness: thoughts represent objects and states of affairs',
        collapsed: false,
        color: 'green',
        edgeColor: '#22c55e',
        position: { x: 1168, y: 380 },
      },
      'node-content': {
        id: 'node-content',
        parentId: 'node-intentionality',
        children: [],
        markdown: 'Content: meaning, reference, and truth conditions',
        collapsed: false,
        color: 'green',
        edgeColor: '#22c55e',
        position: { x: 1168, y: 570 },
      },
      'node-identity': {
        id: 'node-identity',
        parentId: 'node-root',
        children: ['node-continuity', 'node-embodiment'],
        markdown: 'Personal identity',
        collapsed: false,
        color: 'neutral',
        position: { x: 292, y: 475 },
      },
      'node-continuity': {
        id: 'node-continuity',
        parentId: 'node-identity',
        children: [],
        markdown: 'Psychological continuity: memory, character, and agency over time',
        collapsed: false,
        color: 'neutral',
        position: { x: 0, y: 380 },
      },
      'node-embodiment': {
        id: 'node-embodiment',
        parentId: 'node-identity',
        children: [],
        markdown: 'Embodiment: cognition shaped by body and environment',
        collapsed: false,
        color: 'neutral',
        position: { x: 0, y: 570 },
      },
    },
  }
}

function createEmptyMindmap(options?: Partial<Pick<
  MindmapDocument,
  'title' | 'defaultView' | 'layout' | 'assetsFolder' | 'canvasItems' | 'fileProperties'
>>): MindmapDocument {
  return {
    title: options?.title ?? '',
    rootId: null,
    rootIds: [],
    nodes: {},
    links: [],
    canvasItems: (options?.canvasItems ?? []).map((item) => ({ ...item })),
    fileProperties: (options?.fileProperties ?? []).map((property) => ({ ...property })),
    defaultView: options?.defaultView ?? 'list',
    layout: options?.layout ?? 'horizontal',
    assetsFolder: options?.assetsFolder || DEFAULT_ASSETS_FOLDER,
  }
}

function createEmptyMindmapPreservingCanvas(document: MindmapDocument): MindmapDocument {
  return createEmptyMindmap({
    title: document.title,
    defaultView: document.defaultView,
    layout: document.layout,
    assetsFolder: document.assetsFolder,
    canvasItems: document.canvasItems,
    fileProperties: document.fileProperties,
  })
}

export function parseMindmapMarkdown(source: string): MindmapDocument {
  const { frontmatter, body } = splitFrontmatter(source.replace(/\r\n?/g, '\n'))
  const meta = parseFrontmatter(frontmatter)
  const nodes: Record<string, MindNode> = {}
  const rootIds: string[] = []
  const stack: string[] = []
  let lastNodeId: string | null = null

  for (const line of body.split('\n')) {
    const item = parseListItem(line)

    if (!item) {
      if (lastNodeId && line.trim().length > 0) {
        nodes[lastNodeId] = {
          ...nodes[lastNodeId],
          markdown: `${nodes[lastNodeId].markdown}\n${unescapeContinuationLine(line.trim())}`,
        }
      }

      continue
    }

    const parsedId = extractNodeId(item.content)
    const markdown = parsedId.content.trim() || 'Untitled'
    const id = ensureUniqueId(parsedId.id ?? createNodeId(markdown), nodes)
    const parentId = item.level > 0 ? stack[item.level - 1] ?? null : null
    const nodeMeta = meta.nodes[id]
    const position =
      typeof nodeMeta?.x === 'number' && typeof nodeMeta.y === 'number'
        ? { x: nodeMeta.x, y: nodeMeta.y }
        : undefined

    const nextNode: MindNode = {
      id,
      parentId,
      children: [],
      markdown,
      collapsed: nodeMeta?.collapsed ?? false,
      color: nodeMeta?.color ?? 'neutral',
      position,
    }

    if (nodeMeta?.edgeLabel) {
      nextNode.edgeLabel = nodeMeta.edgeLabel
    }

    if (nodeMeta?.edgeColor) {
      nextNode.edgeColor = nodeMeta.edgeColor
    }

    if (nodeMeta?.edgeArrows && nodeMeta.edgeArrows !== 'none') {
      nextNode.edgeArrows = nodeMeta.edgeArrows
    }

    nodes[id] = nextNode

    if (parentId && nodes[parentId]) {
      nodes[parentId].children.push(id)
    } else {
      nodes[id].parentId = null
      rootIds.push(id)
    }

    stack[item.level] = id
    stack.length = item.level + 1
    lastNodeId = id
  }

  if (rootIds.length === 0) {
    return createEmptyMindmap({
      title: meta.title || 'Mindmap',
      defaultView: meta.mindmap.defaultView ?? 'list',
      layout: meta.mindmap.layout ?? 'horizontal',
      assetsFolder: meta.assets.folder ?? DEFAULT_ASSETS_FOLDER,
      canvasItems: meta.canvasItems,
      fileProperties: meta.fileProperties,
    })
  }

  const rootId = meta.mindmap.root && nodes[meta.mindmap.root] ? meta.mindmap.root : rootIds[0]
  const rootTitle = rootId ? stripMarkdown(nodes[rootId].markdown) : 'Mindmap'

  return {
    title: meta.title || rootTitle || 'Mindmap',
    rootId,
    rootIds,
    nodes,
    links: meta.links.filter((link) => Boolean(nodes[link.from] && nodes[link.to])),
    canvasItems: meta.canvasItems,
    fileProperties: meta.fileProperties,
    defaultView: meta.mindmap.defaultView ?? 'list',
    layout: meta.mindmap.layout ?? 'horizontal',
    assetsFolder: meta.assets.folder ?? DEFAULT_ASSETS_FOLDER,
  }
}

export function serializeMindmapMarkdown(document: MindmapDocument): string {
  const orderedIds = getDepthFirstIds(document)
  const body = serializeOutline(document, { includeIds: true })
  const frontmatter = [
    '---',
    ...(document.title.trim() ? [`title: ${formatYamlScalar(document.title)}`] : []),
    ...serializeFileProperties(document.fileProperties ?? []),
    'mindmap:',
    '  version: 1',
    `  defaultView: ${document.defaultView}`,
    `  layout: ${document.layout}`,
    ...(document.rootId ?? document.rootIds[0] ? [`  root: ${document.rootId ?? document.rootIds[0]}`] : []),
    'nodes:',
    ...orderedIds.flatMap((id) => {
      const node = document.nodes[id]
      const lines = [
        `  ${id}:`,
        `    collapsed: ${String(node.collapsed)}`,
        `    color: ${node.color ?? 'neutral'}`,
      ]

      if (node.edgeLabel) {
        lines.push(`    edgeLabel: ${node.edgeLabel}`)
      }

      if (node.edgeColor) {
        lines.push(`    edgeColor: ${node.edgeColor}`)
      }

      if (node.edgeArrows && node.edgeArrows !== 'none') {
        lines.push(`    edgeArrows: ${node.edgeArrows}`)
      }

      if (node.position) {
        lines.push(`    x: ${roundPosition(node.position.x)}`)
        lines.push(`    y: ${roundPosition(node.position.y)}`)
      }

      return lines
    }),
    ...(document.links.length > 0
      ? [
          'links:',
          ...document.links.flatMap((link) => [
            `  - id: ${link.id}`,
            `    from: ${link.from}`,
            `    to: ${link.to}`,
            ...(link.label ? [`    label: ${link.label}`] : []),
            ...(link.color ? [`    color: ${link.color}`] : []),
            ...(link.arrows && link.arrows !== 'none' ? [`    arrows: ${link.arrows}`] : []),
          ]),
        ]
      : []),
    ...(document.canvasItems.length > 0
      ? [
          'canvas:',
          ...document.canvasItems.flatMap((item) => [
            `  - id: ${item.id}`,
            `    type: ${item.type}`,
            `    x: ${roundPosition(item.x)}`,
            `    y: ${roundPosition(item.y)}`,
            `    width: ${Math.round(item.width)}`,
            ...(item.type === 'image'
              ? [
                  `    src: ${item.src}`,
                  ...(item.alt ? [`    alt: ${item.alt}`] : []),
                ]
              : [
                  ...(item.height ? [`    height: ${Math.round(item.height)}`] : []),
                  `    url: ${item.url}`,
                  ...(item.title ? [`    title: ${item.title}`] : []),
                  ...(item.description ? [`    description: ${item.description}`] : []),
                  ...(item.provider ? [`    provider: ${item.provider}`] : []),
                  ...(item.image ? [`    image: ${item.image}`] : []),
                  ...(item.favicon ? [`    favicon: ${item.favicon}`] : []),
                  ...(item.previewKind ? [`    previewKind: ${item.previewKind}`] : []),
                ]),
          ]),
        ]
      : []),
    'assets:',
    `  folder: ${document.assetsFolder || DEFAULT_ASSETS_FOLDER}`,
    '---',
    '',
    body,
  ]

  return `${frontmatter.join('\n').trimEnd()}\n`
}

function serializeFileProperties(properties: FileProperty[]): string[] {
  return properties.flatMap((property) => {
    const key = normalizeFilePropertyKey(property.key)

    if (!key) {
      return []
    }

    if (property.type === 'list') {
      const items = property.value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)

      return [`${key}: [${items.map(formatYamlScalar).join(', ')}]`]
    }

    if (property.type === 'boolean') {
      return [`${key}: ${property.value === 'true' ? 'true' : 'false'}`]
    }

    if (property.type === 'number') {
      return [`${key}: ${/^-?\d+(\.\d+)?$/u.test(property.value.trim()) ? property.value.trim() : '0'}`]
    }

    if (property.type === 'object') {
      return property.value.trim()
        ? [`${key}: ${property.value.trim()}`]
        : [`${key}: {}`]
    }

    return [`${key}: ${formatYamlScalar(property.value)}`]
  })
}

function normalizeFilePropertyKey(key: string): string {
  return key.trim().replace(/:/g, '').replace(/\s+/g, ' ')
}

function formatYamlScalar(value: string): string {
  const trimmed = value.trim()

  if (!trimmed) {
    return "''"
  }

  if (/^[A-Za-z0-9_./@+-]+(?: [A-Za-z0-9_./@+-]+)*$/u.test(trimmed)) {
    return trimmed
  }

  return JSON.stringify(trimmed)
}

export function serializeCleanMarkdown(document: MindmapDocument): string {
  return `${serializeOutline(document, { includeIds: false }).trimEnd()}\n`
}

export function serializeFilePropertiesYaml(properties: FileProperty[]): string {
  return serializeFileProperties(properties).join('\n')
}

export function parseFilePropertiesYaml(source: string): FileProperty[] {
  const normalized = source.replace(/\r\n?/g, '\n').trim()

  if (!normalized) {
    return []
  }

  return parseFrontmatterFileProperties(splitFrontmatter(normalized).frontmatter || normalized)
}

export function parseMindmapJson(source: string): MindmapDocument {
  const payload = JSON.parse(source) as unknown

  if (!isJsonRecord(payload)) {
    throw new Error('Invalid mindmap JSON: expected an object at the root.')
  }

  const mindmap = isJsonRecord(payload.mindmap) ? payload.mindmap : {}
  const assets = isJsonRecord(payload.assets) ? payload.assets : {}
  const nodes = parseJsonNodes(payload.nodes)
  const rootIdsFromPayload = Array.isArray(payload.rootIds)
    ? payload.rootIds.filter((id): id is string => typeof id === 'string' && Boolean(nodes[id]))
    : []
  const inferredRootIds = Object.values(nodes)
    .filter((node) => !node.parentId)
    .map((node) => node.id)
  const rootIds = rootIdsFromPayload.length > 0 ? rootIdsFromPayload : inferredRootIds

  if (rootIds.length === 0) {
    if (Object.keys(nodes).length > 0) {
      throw new Error('Invalid mindmap JSON: no root node found.')
    }

    return createEmptyMindmap({
      title: typeof payload.title === 'string' && payload.title.trim() ? payload.title : 'Mindmap',
      defaultView: isViewMode(mindmap.defaultView) ? mindmap.defaultView : 'list',
      layout: isLayoutMode(mindmap.layout) ? mindmap.layout : 'horizontal',
      assetsFolder:
        typeof assets.folder === 'string'
          ? assets.folder
          : typeof payload.assetsFolder === 'string'
            ? payload.assetsFolder
            : DEFAULT_ASSETS_FOLDER,
      canvasItems: parseJsonCanvasItems(payload.canvasItems ?? payload.canvas),
      fileProperties: parseJsonFileProperties(payload.fileProperties),
    })
  }

  for (const node of Object.values(nodes)) {
    node.children = node.children.filter((childId) => Boolean(nodes[childId]))

    for (const childId of node.children) {
      nodes[childId].parentId = node.id
    }
  }

  const rootId =
    typeof mindmap.root === 'string' && nodes[mindmap.root]
      ? mindmap.root
      : typeof payload.rootId === 'string' && nodes[payload.rootId]
        ? payload.rootId
        : rootIds[0]
  const rootTitle = rootId ? stripMarkdown(nodes[rootId].markdown) : 'Mindmap'
  const title = typeof payload.title === 'string' && payload.title.trim() ? payload.title : rootTitle

  return {
    title: title || 'Mindmap',
    rootId,
    rootIds,
    nodes,
    links: parseJsonLinks(payload.links, nodes),
    canvasItems: parseJsonCanvasItems(payload.canvasItems ?? payload.canvas),
    fileProperties: parseJsonFileProperties(payload.fileProperties),
    defaultView: isViewMode(mindmap.defaultView) ? mindmap.defaultView : 'list',
    layout: isLayoutMode(mindmap.layout) ? mindmap.layout : 'horizontal',
    assetsFolder:
      typeof assets.folder === 'string'
        ? assets.folder
        : typeof payload.assetsFolder === 'string'
          ? payload.assetsFolder
          : DEFAULT_ASSETS_FOLDER,
  }
}

export function serializeMindmapJson(document: MindmapDocument): string {
  const orderedIds = getDepthFirstIds(document)
  const payload = {
    mindmap: {
      version: 1,
      defaultView: document.defaultView,
      layout: document.layout,
      root: document.rootId ?? document.rootIds[0] ?? null,
    },
    title: document.title,
    assets: {
      folder: document.assetsFolder || DEFAULT_ASSETS_FOLDER,
    },
    rootIds: document.rootIds,
    links: document.links,
    canvasItems: document.canvasItems.map((item) => ({ ...item })),
    fileProperties: (document.fileProperties ?? []).map((property) => ({ ...property })),
    nodes: orderedIds.map((id) => {
      const node = document.nodes[id]

      return {
        id: node.id,
        parentId: node.parentId,
        children: node.children,
        markdown: node.markdown,
        collapsed: node.collapsed,
        color: node.color ?? 'neutral',
        edgeLabel: node.edgeLabel,
        edgeColor: node.edgeColor,
        edgeArrows: node.edgeArrows,
        position: node.position,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
      }
    }),
  }

  return `${JSON.stringify(payload, null, 2)}\n`
}

export function cloneDocument(document: MindmapDocument): MindmapDocument {
  return {
    ...document,
    rootIds: [...document.rootIds],
    links: document.links.map((link) => ({ ...link })),
    canvasItems: document.canvasItems.map((item) => ({ ...item })),
    fileProperties: (document.fileProperties ?? []).map((property) => ({ ...property })),
    nodes: Object.fromEntries(
      Object.entries(document.nodes).map(([id, node]) => [
        id,
        {
          ...node,
          children: [...node.children],
          position: node.position ? { ...node.position } : undefined,
        },
      ]),
    ),
  }
}

export function updateNodeMarkdown(
  document: MindmapDocument,
  id: string,
  markdown: string,
): MindmapDocument {
  const next = cloneDocument(document)
  const node = next.nodes[id]

  if (!node) {
    return next
  }

  next.nodes[id] = {
    ...node,
    markdown,
  }

  return next
}

export function insertSiblingAfter(
  document: MindmapDocument,
  id: string,
  markdown = '',
): MindmapDocument {
  const next = cloneDocument(document)
  const node = next.nodes[id]

  if (!node) {
    return next
  }

  const newNode = createNode(markdown, node.parentId, next.nodes)
  next.nodes[newNode.id] = newNode

  const siblings = getMutableSiblings(next, node)
  const index = siblings.indexOf(id)
  siblings.splice(index + 1, 0, newNode.id)

  return next
}

export function insertChild(
  document: MindmapDocument,
  parentId: string,
  markdown = '',
): MindmapDocument {
  const next = cloneDocument(document)
  const parent = next.nodes[parentId]

  if (!parent) {
    return next
  }

  const newNode = createNode(markdown, parentId, next.nodes)
  next.nodes[newNode.id] = newNode
  parent.children.push(newNode.id)
  parent.collapsed = false

  return next
}

export function insertRootNode(
  document: MindmapDocument,
  markdown = '',
  position?: { x: number; y: number },
): MindmapDocument {
  const next = cloneDocument(document)
  const newNode = createNode(markdown, null, next.nodes)

  if (position) {
    newNode.position = { ...position }
  }

  next.nodes[newNode.id] = newNode
  next.rootIds.push(newNode.id)
  next.rootId = next.rootId && next.nodes[next.rootId] ? next.rootId : newNode.id

  return next
}

export function deleteNode(document: MindmapDocument, id: string): MindmapDocument {
  const next = cloneDocument(document)
  const node = next.nodes[id]

  if (!node) {
    return next
  }

  const idsToDelete = new Set([id, ...getDescendantIds(next, id)])

  if (idsToDelete.size >= Object.keys(next.nodes).length) {
    return createEmptyMindmapPreservingCanvas(document)
  }

  const siblings = getMutableSiblings(next, node)
  const index = siblings.indexOf(id)

  if (index >= 0) {
    siblings.splice(index, 1)
  }

  for (const deletedId of idsToDelete) {
    delete next.nodes[deletedId]
  }

  next.rootIds = next.rootIds.filter((rootId) => Boolean(next.nodes[rootId]))
  next.links = next.links.filter((link) => next.nodes[link.from] && next.nodes[link.to])
  next.rootId = next.rootId && next.nodes[next.rootId] ? next.rootId : next.rootIds[0] ?? null

  return next
}

export function deleteNodes(document: MindmapDocument, ids: string[]): MindmapDocument {
  const next = cloneDocument(document)
  const requestedIds = [...new Set(ids)].filter((id) => Boolean(next.nodes[id]))

  if (requestedIds.length === 0) {
    return next
  }

  const idsToDelete = new Set<string>()

  for (const id of requestedIds) {
    idsToDelete.add(id)

    for (const descendantId of getDescendantIds(next, id)) {
      idsToDelete.add(descendantId)
    }
  }

  if (idsToDelete.size >= Object.keys(next.nodes).length) {
    return createEmptyMindmapPreservingCanvas(document)
  }

  for (const id of idsToDelete) {
    const node = next.nodes[id]

    if (!node) {
      continue
    }

    const siblings = getMutableSiblings(next, node)
    const index = siblings.indexOf(id)

    if (index >= 0) {
      siblings.splice(index, 1)
    }
  }

  for (const id of idsToDelete) {
    delete next.nodes[id]
  }

  next.rootIds = next.rootIds.filter((id) => Boolean(next.nodes[id]))
  next.links = next.links.filter((link) => next.nodes[link.from] && next.nodes[link.to])
  next.rootId = next.rootId && next.nodes[next.rootId] ? next.rootId : next.rootIds[0] ?? null

  return next
}

export function deleteNodesPreservingChildren(document: MindmapDocument, ids: string[]): MindmapDocument {
  const next = cloneDocument(document)
  const idsToDelete = new Set([...new Set(ids)].filter((id) => Boolean(next.nodes[id])))

  if (idsToDelete.size === 0) {
    return next
  }

  if (idsToDelete.size >= Object.keys(next.nodes).length) {
    return createEmptyMindmapPreservingCanvas(document)
  }

  const attachChildrenToParent = (childIds: string[], parentId: string | null) => {
    for (const childId of childIds) {
      const child = next.nodes[childId]

      if (child) {
        child.parentId = parentId
      }
    }
  }

  const rebuildSiblings = (siblingIds: string[]): string[] => {
    const rebuiltIds: string[] = []

    for (const id of siblingIds) {
      const node = next.nodes[id]

      if (!node) {
        continue
      }

      const rebuiltChildren = rebuildSiblings(node.children)

      if (idsToDelete.has(id)) {
        const previousSiblingId = rebuiltIds[rebuiltIds.length - 1]

        if (previousSiblingId && next.nodes[previousSiblingId]) {
          next.nodes[previousSiblingId].children.push(...rebuiltChildren)
          next.nodes[previousSiblingId].collapsed = false
          attachChildrenToParent(rebuiltChildren, previousSiblingId)
        } else {
          rebuiltIds.push(...rebuiltChildren)
        }

        continue
      }

      node.children = rebuiltChildren
      attachChildrenToParent(node.children, id)
      rebuiltIds.push(id)
    }

    return rebuiltIds
  }

  next.rootIds = rebuildSiblings(next.rootIds)
  attachChildrenToParent(next.rootIds, null)

  for (const id of idsToDelete) {
    delete next.nodes[id]
  }

  next.links = next.links.filter((link) => next.nodes[link.from] && next.nodes[link.to])
  next.rootId = next.rootId && next.nodes[next.rootId] ? next.rootId : next.rootIds[0] ?? null

  return next
}

export function indentNode(document: MindmapDocument, id: string): MindmapDocument {
  const next = cloneDocument(document)
  const node = next.nodes[id]

  if (!node) {
    return next
  }

  const siblings = getMutableSiblings(next, node)
  const index = siblings.indexOf(id)
  const previousSiblingId = siblings[index - 1]

  if (index <= 0 || !previousSiblingId) {
    return next
  }

  siblings.splice(index, 1)
  const newParent = next.nodes[previousSiblingId]
  node.parentId = previousSiblingId
  newParent.children.push(id)
  newParent.collapsed = false

  return next
}

export function outdentNode(document: MindmapDocument, id: string): MindmapDocument {
  const next = cloneDocument(document)
  const node = next.nodes[id]

  if (!node?.parentId) {
    return next
  }

  const parent = next.nodes[node.parentId]
  const grandParentId = parent.parentId
  const parentSiblings = getMutableSiblings(next, parent)
  const parentIndex = parentSiblings.indexOf(parent.id)

  parent.children = parent.children.filter((childId) => childId !== id)
  node.parentId = grandParentId
  parentSiblings.splice(parentIndex + 1, 0, id)

  return next
}

export function detachNodeAsRoot(document: MindmapDocument, id: string): MindmapDocument {
  const next = cloneDocument(document)
  const node = next.nodes[id]

  if (!node?.parentId) {
    return next
  }

  const parent = next.nodes[node.parentId]

  if (parent) {
    parent.children = parent.children.filter((childId) => childId !== id)
  }

  node.parentId = null
  node.edgeLabel = undefined
  node.edgeColor = undefined
  node.edgeArrows = undefined

  if (!next.rootIds.includes(id)) {
    next.rootIds.push(id)
  }

  next.rootId = next.rootId && next.nodes[next.rootId] ? next.rootId : next.rootIds[0] ?? id

  return next
}

export function moveNode(document: MindmapDocument, id: string, direction: -1 | 1): MindmapDocument {
  const next = cloneDocument(document)
  const node = next.nodes[id]

  if (!node) {
    return next
  }

  const siblings = getMutableSiblings(next, node)
  const index = siblings.indexOf(id)
  const targetIndex = index + direction

  if (index < 0 || targetIndex < 0 || targetIndex >= siblings.length) {
    return next
  }

  const [movedId] = siblings.splice(index, 1)
  siblings.splice(targetIndex, 0, movedId)

  return next
}

export function moveNodes(document: MindmapDocument, ids: string[], direction: -1 | 1): MindmapDocument {
  const selectedIds = new Set([...new Set(ids)].filter((id) => Boolean(document.nodes[id])))

  if (selectedIds.size === 0) {
    return document
  }

  const next = cloneDocument(document)
  let changed = false
  const reorderSiblings = (siblingIds: string[]): string[] => {
    const reorderedIds = [...siblingIds]

    if (direction < 0) {
      for (let index = 1; index < reorderedIds.length; index += 1) {
        if (selectedIds.has(reorderedIds[index]) && !selectedIds.has(reorderedIds[index - 1])) {
          const previousId = reorderedIds[index - 1]
          reorderedIds[index - 1] = reorderedIds[index]
          reorderedIds[index] = previousId
          changed = true
        }
      }
    } else {
      for (let index = reorderedIds.length - 2; index >= 0; index -= 1) {
        if (selectedIds.has(reorderedIds[index]) && !selectedIds.has(reorderedIds[index + 1])) {
          const nextId = reorderedIds[index + 1]
          reorderedIds[index + 1] = reorderedIds[index]
          reorderedIds[index] = nextId
          changed = true
        }
      }
    }

    return reorderedIds
  }

  next.rootIds = reorderSiblings(next.rootIds)

  for (const node of Object.values(next.nodes)) {
    node.children = reorderSiblings(node.children)
  }

  return changed ? next : document
}

export function moveNodesBefore(document: MindmapDocument, movedIds: string[], targetId: string): MindmapDocument {
  return moveNodesToOutlinePosition(document, movedIds, targetId, 'before')
}

export function moveNodesToOutlinePosition(
  document: MindmapDocument,
  movedIds: string[],
  targetId: string,
  position: 'before' | 'after' | 'inside',
): MindmapDocument {
  const next = cloneDocument(document)
  const target = next.nodes[targetId]

  if (!target) {
    return next
  }

  const uniqueMovedIds = [...new Set(movedIds)].filter((id) => Boolean(next.nodes[id]) && id !== targetId)
  const movedSet = new Set(uniqueMovedIds)
  const topMovedIds = uniqueMovedIds.filter((id) => {
    let parentId = next.nodes[id]?.parentId ?? null

    while (parentId) {
      if (movedSet.has(parentId)) {
        return false
      }

      parentId = next.nodes[parentId]?.parentId ?? null
    }

    return true
  })

  if (topMovedIds.length === 0 || topMovedIds.some((id) => getDescendantIds(next, id).includes(targetId))) {
    return next
  }

  for (const id of topMovedIds) {
    const node = next.nodes[id]
    const siblings = getMutableSiblings(next, node)
    const index = siblings.indexOf(id)

    if (index >= 0) {
      siblings.splice(index, 1)
    }
  }

  const targetSiblings = getMutableSiblings(next, target)
  const targetIndex = targetSiblings.indexOf(targetId)

  if (targetIndex < 0) {
    return next
  }

  for (const id of topMovedIds) {
    next.nodes[id].parentId = position === 'inside' ? target.id : target.parentId
  }

  if (position === 'inside') {
    target.children.push(...topMovedIds)
    target.collapsed = false
    return next
  }

  targetSiblings.splice(position === 'after' ? targetIndex + 1 : targetIndex, 0, ...topMovedIds)
  return next
}

export function toggleNodeCollapsed(document: MindmapDocument, id: string): MindmapDocument {
  const next = cloneDocument(document)
  const node = next.nodes[id]

  if (!node) {
    return next
  }

  next.nodes[id] = {
    ...node,
    collapsed: !node.collapsed,
  }

  return next
}

export function setCollapsedToDepth(
  document: MindmapDocument,
  visibleLevel: number,
  rootId?: string | null,
): MindmapDocument {
  const next = cloneDocument(document)
  const targetDepth = Math.max(0, Math.floor(visibleLevel) - 1)
  const roots = rootId ? [rootId] : document.rootIds
  let changed = false

  const visit = (id: string, depth: number) => {
    const node = next.nodes[id]

    if (!node) {
      return
    }

    const collapsed = node.children.length > 0 && depth >= targetDepth

    if (node.collapsed !== collapsed) {
      next.nodes[id] = {
        ...node,
        collapsed,
      }
      changed = true
    }

    next.nodes[id].children.forEach((childId) => visit(childId, depth + 1))
  }

  roots.forEach((id) => visit(id, 0))
  return changed ? next : document
}

export function setNodeColor(document: MindmapDocument, id: string, color: NodeColor): MindmapDocument {
  const next = cloneDocument(document)
  const node = next.nodes[id]

  if (!node) {
    return next
  }

  next.nodes[id] = {
    ...node,
    color,
  }

  return next
}

export function setNodeSubtreeColor(document: MindmapDocument, id: string, color: NodeColor): MindmapDocument {
  const next = cloneDocument(document)

  const visit = (nodeId: string) => {
    const node = next.nodes[nodeId]

    if (!node) {
      return
    }

    next.nodes[nodeId] = {
      ...node,
      color,
    }

    node.children.forEach(visit)
  }

  visit(id)
  return next
}

export function setNodePosition(
  document: MindmapDocument,
  id: string,
  position: { x: number; y: number },
): MindmapDocument {
  const next = cloneDocument(document)
  const node = next.nodes[id]

  if (!node) {
    return next
  }

  next.nodes[id] = {
    ...node,
    position: {
      x: roundPosition(position.x),
      y: roundPosition(position.y),
    },
  }

  return next
}

export function setNodePositions(
  document: MindmapDocument,
  positions: Record<string, { x: number; y: number }>,
): MindmapDocument {
  const next = cloneDocument(document)

  for (const [id, position] of Object.entries(positions)) {
    const node = next.nodes[id]

    if (!node) {
      continue
    }

    next.nodes[id] = {
      ...node,
      position: {
        x: roundPosition(position.x),
        y: roundPosition(position.y),
      },
    }
  }

  return next
}

export function setTreeEdgeLabel(document: MindmapDocument, childId: string, label: string): MindmapDocument {
  const next = cloneDocument(document)
  const node = next.nodes[childId]

  if (!node) {
    return next
  }

  const trimmed = label.trim()
  next.nodes[childId] = {
    ...node,
    edgeLabel: trimmed || undefined,
  }

  return next
}

export function setTreeEdgeColor(document: MindmapDocument, childId: string, color: string): MindmapDocument {
  const next = cloneDocument(document)
  const node = next.nodes[childId]

  if (!node) {
    return next
  }

  next.nodes[childId] = {
    ...node,
    edgeColor: color || undefined,
  }

  return next
}

export function setTreeEdgeArrows(
  document: MindmapDocument,
  childId: string,
  arrows: EdgeArrowMode,
): MindmapDocument {
  const next = cloneDocument(document)
  const node = next.nodes[childId]

  if (!node) {
    return next
  }

  next.nodes[childId] = {
    ...node,
    edgeArrows: arrows === 'none' ? undefined : arrows,
  }

  return next
}

export function setNodeLinkLabel(document: MindmapDocument, linkId: string, label: string): MindmapDocument {
  const next = cloneDocument(document)
  const link = next.links.find((candidate) => candidate.id === linkId)

  if (!link) {
    return next
  }

  const trimmed = label.trim()
  link.label = trimmed || undefined
  return next
}

export function setNodeLinkColor(document: MindmapDocument, linkId: string, color: string): MindmapDocument {
  const next = cloneDocument(document)
  const link = next.links.find((candidate) => candidate.id === linkId)

  if (!link) {
    return next
  }

  link.color = color || undefined
  return next
}

export function setNodeLinkArrows(
  document: MindmapDocument,
  linkId: string,
  arrows: EdgeArrowMode,
): MindmapDocument {
  const next = cloneDocument(document)
  const link = next.links.find((candidate) => candidate.id === linkId)

  if (!link) {
    return next
  }

  link.arrows = arrows === 'none' ? undefined : arrows
  return next
}

export function setLayout(document: MindmapDocument, layout: LayoutMode): MindmapDocument {
  return {
    ...cloneDocument(document),
    layout,
  }
}

export function addNodeLink(document: MindmapDocument, from: string, to: string): MindmapDocument {
  const next = cloneDocument(document)

  if (!next.nodes[from] || !next.nodes[to] || from === to) {
    return next
  }

  const existing = next.links.some((link) => link.from === from && link.to === to)

  if (existing) {
    return next
  }

  next.links.push({
    id: ensureUniqueLinkId(`link-${from}-${to}`, next.links),
    from,
    to,
  })

  return next
}

export function removeNodeLink(document: MindmapDocument, id: string): MindmapDocument {
  const next = cloneDocument(document)
  next.links = next.links.filter((link) => link.id !== id)

  return next
}

export function setDefaultView(document: MindmapDocument, defaultView: ViewMode): MindmapDocument {
  return {
    ...cloneDocument(document),
    defaultView,
  }
}

export function getDepth(document: MindmapDocument, id: string): number {
  let depth = 0
  let parentId = document.nodes[id]?.parentId ?? null

  while (parentId) {
    depth += 1
    parentId = document.nodes[parentId]?.parentId ?? null
  }

  return depth
}

export function getBreadcrumbs(document: MindmapDocument, id: string | null): MindNode[] {
  if (!id || !document.nodes[id]) {
    return []
  }

  const crumbs: MindNode[] = []
  let currentId: string | null = id

  while (currentId) {
    const node: MindNode | undefined = document.nodes[currentId]

    if (!node) {
      break
    }

    crumbs.unshift(node)
    currentId = node.parentId
  }

  return crumbs
}

export function getVisibleNodeIds(document: MindmapDocument, rootId?: string | null): string[] {
  const ids: string[] = []
  const roots = rootId ? [rootId] : document.rootIds

  const visit = (id: string) => {
    const node = document.nodes[id]

    if (!node) {
      return
    }

    ids.push(id)

    if (!node.collapsed) {
      node.children.forEach(visit)
    }
  }

  roots.forEach(visit)
  return ids
}

export function getDepthFirstIds(document: MindmapDocument): string[] {
  const ids: string[] = []

  const visit = (id: string) => {
    const node = document.nodes[id]

    if (!node) {
      return
    }

    ids.push(id)
    node.children.forEach(visit)
  }

  document.rootIds.forEach(visit)
  return ids
}

export function computeMindmapLayout(
  document: MindmapDocument,
  rootId?: string | null,
): Map<string, MindmapLayoutNode> {
  const layout = new Map<string, MindmapLayoutNode>()
  const columnGap = 292
  const rowGap = 190
  const width = 232
  const height = 112
  let cursor = 0

  const place = (id: string, depth: number): number => {
    const node = document.nodes[id]

    if (!node) {
      return cursor * rowGap
    }

    const visibleChildren = node.collapsed ? [] : node.children.filter((childId) => document.nodes[childId])
    let branchY = cursor * rowGap

    if (visibleChildren.length === 0) {
      cursor += 1
    } else {
      const childYPositions = visibleChildren.map((childId) => place(childId, depth + 1))
      branchY = (childYPositions[0] + childYPositions[childYPositions.length - 1]) / 2
    }

    const autoPosition =
      document.layout === 'horizontal'
        ? { x: depth * columnGap, y: branchY }
        : { x: branchY, y: depth * rowGap }
    const position = node.position ?? autoPosition

    layout.set(id, {
      id,
      x: position.x,
      y: position.y,
      width,
      height,
    })

    return branchY
  }

  const roots = rootId ? [rootId] : document.rootIds

  roots.forEach((id, index) => {
    if (index > 0) {
      cursor += 1
    }

    place(id, 0)
  })

  return layout
}

export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/^#{1,6}(?:\s+|(?=\S))/, '')
    .replace(/[*_`~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .trim()
}

export function getNodeColors(): NodeColor[] {
  return [...NODE_COLORS]
}

function splitFrontmatter(source: string): { frontmatter: string; body: string } {
  if (!source.startsWith('---\n')) {
    return { frontmatter: '', body: source }
  }

  const closeIndex = source.indexOf('\n---', 4)

  if (closeIndex < 0) {
    return { frontmatter: '', body: source }
  }

  return {
    frontmatter: source.slice(4, closeIndex),
    body: source.slice(closeIndex + 4).replace(/^\n/, ''),
  }
}

function parseFrontmatter(frontmatter: string): ParsedFrontmatter {
  const parsed: ParsedFrontmatter = {
    fileProperties: parseFrontmatterFileProperties(frontmatter),
    mindmap: {},
    nodes: {},
    assets: {},
    links: [],
    canvasItems: [],
  }
  let section: 'mindmap' | 'nodes' | 'assets' | 'links' | 'canvas' | null = null
  let currentNodeId: string | null = null
  let currentLink: Partial<MindLink> | null = null
  let currentCanvasItem: ParsedCanvasFrontmatterItem | null = null

  for (const line of frontmatter.split('\n')) {
    if (line.trim().length === 0) {
      continue
    }

    const indent = countIndent(line)
    const trimmed = line.trim()

    if (indent === 0) {
      const pair = parseYamlPair(trimmed)

      if (pair?.key === 'title' && typeof pair.value === 'string') {
        parsed.title = pair.value.trim()
        section = null
        currentNodeId = null
        currentLink = null
        currentCanvasItem = null
        continue
      }
    }

    if (indent === 0 && trimmed.endsWith(':')) {
      const key = trimmed.slice(0, -1)
      section = key === 'mindmap' || key === 'nodes' || key === 'assets' || key === 'links' || key === 'canvas' ? key : null
      currentNodeId = null
      currentLink = null
      currentCanvasItem = null
      continue
    }

    if (section === 'mindmap' && indent === 2) {
      const pair = parseYamlPair(trimmed)

      if (pair?.key === 'defaultView' && isViewMode(pair.value)) {
        parsed.mindmap.defaultView = pair.value
      }

      if (pair?.key === 'layout' && isLayoutMode(pair.value)) {
        parsed.mindmap.layout = pair.value
      }

      if (pair?.key === 'root' && typeof pair.value === 'string') {
        parsed.mindmap.root = pair.value
      }
    }

    if (section === 'nodes' && indent === 2 && trimmed.endsWith(':')) {
      currentNodeId = trimmed.slice(0, -1)
      parsed.nodes[currentNodeId] = parsed.nodes[currentNodeId] ?? {}
      continue
    }

    if (section === 'nodes' && indent === 4 && currentNodeId) {
      const pair = parseYamlPair(trimmed)

      if (!pair) {
        continue
      }

      if (pair.key === 'collapsed' && typeof pair.value === 'boolean') {
        parsed.nodes[currentNodeId].collapsed = pair.value
      }

      if (pair.key === 'color' && isNodeColor(pair.value)) {
        parsed.nodes[currentNodeId].color = pair.value
      }

      if (pair.key === 'edgeLabel' && typeof pair.value === 'string') {
        parsed.nodes[currentNodeId].edgeLabel = pair.value
      }

      if (pair.key === 'edgeColor' && typeof pair.value === 'string') {
        parsed.nodes[currentNodeId].edgeColor = pair.value
      }

      if (pair.key === 'edgeArrows' && isEdgeArrowMode(pair.value)) {
        parsed.nodes[currentNodeId].edgeArrows = pair.value
      }

      if (pair.key === 'x' && typeof pair.value === 'number') {
        parsed.nodes[currentNodeId].x = pair.value
      }

      if (pair.key === 'y' && typeof pair.value === 'number') {
        parsed.nodes[currentNodeId].y = pair.value
      }
    }

    if (section === 'assets' && indent === 2) {
      const pair = parseYamlPair(trimmed)

      if (pair?.key === 'folder' && typeof pair.value === 'string') {
        parsed.assets.folder = pair.value
      }
    }

    if (section === 'links' && indent === 2 && trimmed.startsWith('- ')) {
      const pair = parseYamlPair(trimmed.slice(2).trim())
      currentLink = {}

      if (pair?.key === 'id' && typeof pair.value === 'string') {
        currentLink.id = pair.value
      }

      parsed.links.push(currentLink as MindLink)
      continue
    }

    if (section === 'links' && indent === 4 && currentLink) {
      const pair = parseYamlPair(trimmed)

      if (!pair) {
        continue
      }

      if (pair.key === 'id' && typeof pair.value === 'string') {
        currentLink.id = pair.value
      }

      if (pair.key === 'from' && typeof pair.value === 'string') {
        currentLink.from = pair.value
      }

      if (pair.key === 'to' && typeof pair.value === 'string') {
        currentLink.to = pair.value
      }

      if (pair.key === 'label' && typeof pair.value === 'string') {
        currentLink.label = pair.value
      }

      if (pair.key === 'color' && typeof pair.value === 'string') {
        currentLink.color = pair.value
      }

      if (pair.key === 'arrows' && isEdgeArrowMode(pair.value)) {
        currentLink.arrows = pair.value
      }
    }

    if (section === 'canvas' && indent === 2 && trimmed.startsWith('- ')) {
      const pair = parseYamlPair(trimmed.slice(2).trim())
      currentCanvasItem = {}

      if (pair?.key === 'id' && typeof pair.value === 'string') {
        currentCanvasItem.id = pair.value
      }

      parsed.canvasItems.push(currentCanvasItem as CanvasItem)
      continue
    }

    if (section === 'canvas' && indent === 4 && currentCanvasItem) {
      const pair = parseYamlPair(trimmed)

      if (!pair) {
        continue
      }

      if (pair.key === 'id' && typeof pair.value === 'string') {
        currentCanvasItem.id = pair.value
      }

      if (pair.key === 'type' && (pair.value === 'image' || pair.value === 'link')) {
        currentCanvasItem.type = pair.value
      }

      if (pair.key === 'x' && typeof pair.value === 'number') {
        currentCanvasItem.x = pair.value
      }

      if (pair.key === 'y' && typeof pair.value === 'number') {
        currentCanvasItem.y = pair.value
      }

      if (pair.key === 'width' && typeof pair.value === 'number') {
        currentCanvasItem.width = pair.value
      }

      if (pair.key === 'height' && typeof pair.value === 'number') {
        currentCanvasItem.height = pair.value
      }

      if (pair.key === 'src' && typeof pair.value === 'string') {
        currentCanvasItem.src = pair.value
      }

      if (pair.key === 'alt' && typeof pair.value === 'string') {
        currentCanvasItem.alt = pair.value
      }

      if (pair.key === 'url' && typeof pair.value === 'string') {
        currentCanvasItem.url = pair.value
      }

      if (pair.key === 'title' && typeof pair.value === 'string') {
        currentCanvasItem.title = pair.value
      }

      if (pair.key === 'description' && typeof pair.value === 'string') {
        currentCanvasItem.description = pair.value
      }

      if (pair.key === 'provider' && typeof pair.value === 'string') {
        currentCanvasItem.provider = pair.value
      }

      if (pair.key === 'image' && typeof pair.value === 'string') {
        currentCanvasItem.image = pair.value
      }

      if (pair.key === 'favicon' && typeof pair.value === 'string') {
        currentCanvasItem.favicon = pair.value
      }

      if (pair.key === 'previewKind' && isCanvasLinkPreviewKind(pair.value)) {
        currentCanvasItem.previewKind = pair.value
      }
    }
  }

  parsed.links = parsed.links.filter(
    (link) => typeof link.id === 'string' && typeof link.from === 'string' && typeof link.to === 'string',
  )
  parsed.canvasItems = parseJsonCanvasItems(parsed.canvasItems)

  return parsed
}

function parseFrontmatterFileProperties(frontmatter: string): FileProperty[] {
  const properties: FileProperty[] = []
  const lines = frontmatter.split('\n')

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]

    if (!line.trim() || countIndent(line) !== 0) {
      continue
    }

    const pair = parseYamlPair(line.trim())

    if (!pair) {
      continue
    }

    const childLines: string[] = []

    for (const nextLine of lines.slice(index + 1)) {
      if (!nextLine.trim()) {
        continue
      }

      if (countIndent(nextLine) === 0) {
        break
      }

      childLines.push(nextLine)
    }

    if ((pair.key === 'properties' || pair.key === 'fileProperties') && childLines.length > 0) {
      properties.push(...parseNestedFrontmatterFileProperties(childLines, properties))
      continue
    }

    if (RESERVED_FRONTMATTER_SECTIONS.has(pair.key)) {
      continue
    }

    const parsedValue = parseFilePropertyYamlValue(pair.value, childLines)

    properties.push({
      id: createFilePropertyId(pair.key, properties),
      key: pair.key,
      type: parsedValue.type,
      value: parsedValue.value,
    })
  }

  return properties
}

function parseNestedFrontmatterFileProperties(
  lines: string[],
  existingProperties: FileProperty[],
): FileProperty[] {
  const properties: FileProperty[] = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]

    if (!line.trim() || countIndent(line) !== 2) {
      continue
    }

    const pair = parseYamlPair(line.trim())

    if (!pair) {
      continue
    }

    const childLines: string[] = []

    for (const nextLine of lines.slice(index + 1)) {
      if (!nextLine.trim()) {
        continue
      }

      if (countIndent(nextLine) <= 2) {
        break
      }

      childLines.push(nextLine.replace(/^  /, ''))
    }

    const parsedValue = parseFilePropertyYamlValue(pair.value, childLines)

    properties.push({
      id: createFilePropertyId(pair.key, [...existingProperties, ...properties]),
      key: pair.key,
      type: parsedValue.type,
      value: parsedValue.value,
    })
  }

  return properties
}

function parseFilePropertyYamlValue(
  value: string | number | boolean,
  childLines: string[],
): { type: FilePropertyType; value: string } {
  const directListItems = childLines
    .filter((line) => countIndent(line) === 2 && line.trim().startsWith('- '))
    .map((line) => line.trim().slice(2).trim())

  if (directListItems.length > 0) {
    return {
      type: 'list',
      value: directListItems.map((item) => String(parseYamlScalar(item))).join(', '),
    }
  }

  if (childLines.length > 0) {
    return {
      type: 'object',
      value: childLines.map((line) => line.replace(/^  /, '')).join('\n'),
    }
  }

  if (typeof value === 'boolean') {
    return { type: 'boolean', value: String(value) }
  }

  if (typeof value === 'number') {
    return { type: 'number', value: String(value) }
  }

  const trimmed = value.trim()

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return {
      type: 'list',
      value: parseInlineYamlList(trimmed).join(', '),
    }
  }

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return { type: 'object', value: trimmed }
  }

  if (/^\d{4}-\d{2}-\d{2}(?:[T ][\d:.+-]+Z?)?$/u.test(trimmed)) {
    return { type: 'date', value: trimmed.slice(0, 10) }
  }

  if (/^(https?:\/\/|mailto:|tel:)/iu.test(trimmed)) {
    return { type: 'url', value: trimmed }
  }

  return { type: 'text', value: trimmed }
}

function parseInlineYamlList(value: string): string[] {
  return value
    .slice(1, -1)
    .split(',')
    .map((item) => String(parseYamlScalar(item.trim())))
    .filter(Boolean)
}

function parseYamlScalar(value: string): string | number | boolean {
  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  if (/^-?\d+(\.\d+)?$/u.test(value)) {
    return Number(value)
  }

  return value.replace(/^['"]|['"]$/g, '')
}

function createFilePropertyId(key: string, properties: FileProperty[]): string {
  const base = `property-${slugifyPropertyKey(key) || 'field'}`
  let candidate = base
  let suffix = 2

  while (properties.some((property) => property.id === candidate)) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }

  return candidate
}

function slugifyPropertyKey(key: string): string {
  return key
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseYamlPair(line: string): { key: string; value: string | number | boolean } | null {
  const separatorIndex = line.indexOf(':')

  if (separatorIndex < 0) {
    return null
  }

  const key = line.slice(0, separatorIndex).trim()
  const rawValue = line.slice(separatorIndex + 1).trim()

  if (rawValue === 'true') {
    return { key, value: true }
  }

  if (rawValue === 'false') {
    return { key, value: false }
  }

  if (/^-?\d+(\.\d+)?$/.test(rawValue)) {
    return { key, value: Number(rawValue) }
  }

  return { key, value: rawValue.replace(/^['"]|['"]$/g, '') }
}

function parseListItem(line: string): { level: number; content: string } | null {
  const match = line.match(/^([ \t]*)([-*+])\s+(.+)$/)

  if (!match) {
    return null
  }

  return {
    level: Math.floor(countIndent(match[1]) / 2),
    content: match[3],
  }
}

function extractNodeId(content: string): { id: string | null; content: string } {
  const match = content.match(NODE_ID_PATTERN)

  if (!match) {
    return { id: null, content }
  }

  return {
    id: match[1],
    content: content.replace(NODE_ID_PATTERN, ''),
  }
}

function serializeOutline(
  document: MindmapDocument,
  options: {
    includeIds: boolean
  },
): string {
  const lines: string[] = []

  const visit = (id: string, level: number) => {
    const node = document.nodes[id]

    if (!node) {
      return
    }

    const indent = '  '.repeat(level)
    const markdownLines = node.markdown.split('\n')
    const idSuffix = options.includeIds ? ` {#${node.id}}` : ''
    lines.push(`${indent}- ${markdownLines[0] || 'Untitled'}${idSuffix}`)

    for (const continuationLine of markdownLines.slice(1)) {
      lines.push(`${indent}  ${escapeContinuationLine(continuationLine)}`)
    }

    node.children.forEach((childId) => visit(childId, level + 1))
  }

  document.rootIds.forEach((id) => visit(id, 0))
  return lines.join('\n')
}

function escapeContinuationLine(line: string): string {
  return line.replace(/^([ \t]*)([-*+])(\s+)/, '$1\\$2$3')
}

function unescapeContinuationLine(line: string): string {
  return line.replace(/^([ \t]*)\\([-*+])(\s+)/, '$1$2$3')
}

function createNode(
  markdown: string,
  parentId: string | null,
  existingNodes: Record<string, MindNode>,
): MindNode {
  const id = ensureUniqueId(createNodeId(markdown), existingNodes)

  return {
    id,
    parentId,
    children: [],
    markdown,
    collapsed: false,
    color: 'neutral',
  }
}

function parseJsonFileProperties(value: unknown): FileProperty[] {
  if (!Array.isArray(value)) {
    return []
  }

  const properties: FileProperty[] = []

  for (const rawProperty of value) {
    if (!isJsonRecord(rawProperty) || typeof rawProperty.key !== 'string') {
      continue
    }

    const key = rawProperty.key.trim()

    if (!key) {
      continue
    }

    const type = isFilePropertyType(rawProperty.type) ? rawProperty.type : 'text'
    const id = ensureUniqueFilePropertyId(
      typeof rawProperty.id === 'string' && rawProperty.id.trim()
        ? rawProperty.id.trim()
        : createFilePropertyId(key, properties),
      properties,
    )

    properties.push({
      id,
      key,
      type,
      value: typeof rawProperty.value === 'string' ? rawProperty.value : '',
    })
  }

  return properties
}

function ensureUniqueFilePropertyId(id: string, properties: FileProperty[]): string {
  let candidate = id
  let suffix = 2

  while (properties.some((property) => property.id === candidate)) {
    candidate = `${id}-${suffix}`
    suffix += 1
  }

  return candidate
}

function parseJsonNodes(value: unknown): Record<string, MindNode> {
  const rawNodes = Array.isArray(value)
    ? value
    : isJsonRecord(value)
      ? Object.entries(value).map(([id, rawNode]) =>
          isJsonRecord(rawNode) ? { id, ...rawNode } : rawNode,
        )
      : null

  if (!rawNodes) {
    throw new Error('Invalid mindmap JSON: expected nodes as an array or object.')
  }

  const nodes: Record<string, MindNode> = {}

  for (const rawNode of rawNodes) {
    if (!isJsonRecord(rawNode) || typeof rawNode.id !== 'string') {
      throw new Error('Invalid mindmap JSON: every node needs a string id.')
    }

    const id = ensureUniqueId(rawNode.id, nodes)
    const position = isJsonRecord(rawNode.position)
      && typeof rawNode.position.x === 'number'
      && typeof rawNode.position.y === 'number'
      ? {
          x: rawNode.position.x,
          y: rawNode.position.y,
        }
      : undefined

    const node: MindNode = {
      id,
      parentId: typeof rawNode.parentId === 'string' ? rawNode.parentId : null,
      children: Array.isArray(rawNode.children)
        ? rawNode.children.filter((childId): childId is string => typeof childId === 'string')
        : [],
      markdown: typeof rawNode.markdown === 'string' ? rawNode.markdown : 'Untitled',
      collapsed: typeof rawNode.collapsed === 'boolean' ? rawNode.collapsed : false,
      color: isNodeColor(rawNode.color) ? rawNode.color : 'neutral',
      position,
    }

    if (typeof rawNode.edgeLabel === 'string') {
      node.edgeLabel = rawNode.edgeLabel
    }

    if (typeof rawNode.edgeColor === 'string') {
      node.edgeColor = rawNode.edgeColor
    }

    if (isEdgeArrowMode(rawNode.edgeArrows)) {
      node.edgeArrows = rawNode.edgeArrows
    }

    if (typeof rawNode.createdAt === 'string') {
      node.createdAt = rawNode.createdAt
    }

    if (typeof rawNode.updatedAt === 'string') {
      node.updatedAt = rawNode.updatedAt
    }

    nodes[id] = node
  }

  return nodes
}

function parseJsonLinks(value: unknown, nodes: Record<string, MindNode>): MindLink[] {
  if (!Array.isArray(value)) {
    return []
  }

  const links: MindLink[] = []

  for (const rawLink of value) {
    if (!isJsonRecord(rawLink) || typeof rawLink.from !== 'string' || typeof rawLink.to !== 'string') {
      continue
    }

    if (!nodes[rawLink.from] || !nodes[rawLink.to] || rawLink.from === rawLink.to) {
      continue
    }

    const id = ensureUniqueLinkId(
      typeof rawLink.id === 'string' ? rawLink.id : `link-${rawLink.from}-${rawLink.to}`,
      links,
    )
    const link: MindLink = {
      id,
      from: rawLink.from,
      to: rawLink.to,
    }

    if (typeof rawLink.label === 'string') {
      link.label = rawLink.label
    }

    if (typeof rawLink.color === 'string') {
      link.color = rawLink.color
    }

    if (isEdgeArrowMode(rawLink.arrows)) {
      link.arrows = rawLink.arrows
    }

    links.push(link)
  }

  return links
}

function parseJsonCanvasItems(value: unknown): CanvasItem[] {
  if (!Array.isArray(value)) {
    return []
  }

  const items: CanvasItem[] = []

  for (const rawItem of value) {
    if (!isJsonRecord(rawItem) || typeof rawItem.id !== 'string') {
      continue
    }

    const x = typeof rawItem.x === 'number' ? rawItem.x : null
    const y = typeof rawItem.y === 'number' ? rawItem.y : null
    const width = typeof rawItem.width === 'number' ? rawItem.width : null

    if (x === null || y === null || width === null || width <= 0) {
      continue
    }

    const id = ensureUniqueCanvasItemId(rawItem.id, items)

    if (rawItem.type === 'image' && typeof rawItem.src === 'string' && rawItem.src) {
      const item: CanvasImageItem = {
        id,
        type: 'image',
        x,
        y,
        width,
        src: rawItem.src,
      }

      if (typeof rawItem.alt === 'string') {
        item.alt = rawItem.alt
      }

      items.push(item)
      continue
    }

    if (rawItem.type === 'link' && typeof rawItem.url === 'string' && rawItem.url) {
      const item: CanvasLinkItem = {
        id,
        type: 'link',
        x,
        y,
        width,
        url: rawItem.url,
      }

      if (typeof rawItem.title === 'string') {
        item.title = rawItem.title
      }

      if (typeof rawItem.description === 'string') {
        item.description = rawItem.description
      }

      if (typeof rawItem.height === 'number' && rawItem.height > 0) {
        item.height = rawItem.height
      }

      if (typeof rawItem.provider === 'string') {
        item.provider = rawItem.provider
      }

      if (typeof rawItem.image === 'string') {
        item.image = rawItem.image
      }

      if (typeof rawItem.favicon === 'string') {
        item.favicon = rawItem.favicon
      }

      if (isCanvasLinkPreviewKind(rawItem.previewKind)) {
        item.previewKind = rawItem.previewKind
      }

      items.push(item)
    }
  }

  return items
}

function createNodeId(markdown: string): string {
  const slug = stripMarkdown(markdown)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 36)

  return `node-${slug || 'item'}`
}

function ensureUniqueId(id: string, nodes: Record<string, MindNode>): string {
  if (!nodes[id]) {
    return id
  }

  let suffix = 2
  let candidate = `${id}-${suffix}`

  while (nodes[candidate]) {
    suffix += 1
    candidate = `${id}-${suffix}`
  }

  return candidate
}

function ensureUniqueLinkId(id: string, links: MindLink[]): string {
  if (!links.some((link) => link.id === id)) {
    return id
  }

  let suffix = 2
  let candidate = `${id}-${suffix}`

  while (links.some((link) => link.id === candidate)) {
    suffix += 1
    candidate = `${id}-${suffix}`
  }

  return candidate
}

function ensureUniqueCanvasItemId(id: string, items: CanvasItem[]): string {
  if (!items.some((item) => item.id === id)) {
    return id
  }

  let suffix = 2
  let candidate = `${id}-${suffix}`

  while (items.some((item) => item.id === candidate)) {
    suffix += 1
    candidate = `${id}-${suffix}`
  }

  return candidate
}

function getMutableSiblings(document: MindmapDocument, node: MindNode): string[] {
  return node.parentId ? document.nodes[node.parentId].children : document.rootIds
}

function getDescendantIds(document: MindmapDocument, id: string): string[] {
  const ids: string[] = []

  for (const childId of document.nodes[id]?.children ?? []) {
    ids.push(childId)
    ids.push(...getDescendantIds(document, childId))
  }

  return ids
}

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function countIndent(value: string): number {
  let count = 0

  for (const character of value) {
    if (character === ' ') {
      count += 1
      continue
    }

    if (character === '\t') {
      count += 2
      continue
    }

    break
  }

  return count
}

function isNodeColor(value: unknown): value is NodeColor {
  return typeof value === 'string' && NODE_COLORS.includes(value as NodeColor)
}

function isEdgeArrowMode(value: unknown): value is EdgeArrowMode {
  return typeof value === 'string' && EDGE_ARROW_MODES.includes(value as EdgeArrowMode)
}

function isCanvasLinkPreviewKind(value: unknown): value is CanvasLinkItem['previewKind'] {
  return value === 'bookmark' || value === 'article' || value === 'video'
}

function isFilePropertyType(value: unknown): value is FilePropertyType {
  return (
    value === 'boolean' ||
    value === 'date' ||
    value === 'list' ||
    value === 'number' ||
    value === 'object' ||
    value === 'text' ||
    value === 'url'
  )
}

function isViewMode(value: unknown): value is ViewMode {
  return value === 'list' || value === 'mindmap'
}

function isLayoutMode(value: unknown): value is LayoutMode {
  return value === 'horizontal' || value === 'vertical'
}

function roundPosition(value: number): number {
  return Math.round(value * 100) / 100
}
