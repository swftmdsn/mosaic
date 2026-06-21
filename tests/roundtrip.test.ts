import assert from 'node:assert/strict'
import test from 'node:test'

import {
  addNodeLink,
  computeMindmapLayout,
  createSampleMindmap,
  detachNodeAsRoot,
  deleteNode,
  deleteNodes,
  deleteNodesPreservingChildren,
  indentNode,
  insertSiblingAfter,
  insertRootNode,
  moveNode,
  moveNodes,
  parseFilePropertiesYaml,
  parseMindmapJson,
  parseMindmapMarkdown,
  serializeCleanMarkdown,
  serializeFilePropertiesYaml,
  serializeMindmapJson,
  serializeMindmapMarkdown,
  getVisibleNodeIds,
  setCollapsedToDepth,
  setNodeSubtreeColor,
  setNodeLinkArrows,
  setTreeEdgeArrows,
  toggleNodeCollapsed,
  updateNodeMarkdown,
} from '../src/core/mindmap.ts'
import type { CanvasItem, MindmapDocument } from '../src/core/mindmap.ts'

const sample = `---
mindmap:
  version: 1
  defaultView: list
  layout: horizontal
  root: node-root
nodes:
  node-root:
    collapsed: false
    color: neutral
    x: 0
    y: 0
  node-product:
    collapsed: true
    color: blue
    x: 320
    y: 120
assets:
  folder: ./assets
---

- # Ideal product {#node-root}
  - Vision {#node-product}
    - Create a local-first visual thinking tool {#node-local}
    - Compatible Markdown {#node-markdown}
  - Interface {#node-interface}
    - Outline view {#node-list}
    - Mindmap view {#node-map}
`

function createFreeCanvasItems(): CanvasItem[] {
  return [
    {
      id: 'canvas-image-reference',
      type: 'image',
      x: 420,
      y: 180,
      width: 320,
      src: './assets/reference.heic',
      alt: 'Reference',
    },
    {
      id: 'canvas-link-reference',
      type: 'link',
      x: 780,
      y: 220,
      width: 286,
      height: 188,
      url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'YouTube video',
      description: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      provider: 'YouTube',
      image: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      favicon: 'https://www.youtube.com/favicon.ico',
      previewKind: 'video',
    },
  ]
}

function createDocumentWithFreeCanvasItems(): MindmapDocument {
  const document = addNodeLink(parseMindmapMarkdown(sample), 'node-product', 'node-interface')

  return {
    ...document,
    title: 'Reference workspace',
    defaultView: 'mindmap',
    layout: 'vertical',
    assetsFolder: './references',
    canvasItems: createFreeCanvasItems(),
    fileProperties: [
      {
        id: 'property-owner',
        key: 'owner',
        type: 'text',
        value: 'research',
      },
    ],
  }
}

function assertEmptyMindmapPreservingCanvas(source: MindmapDocument, document: MindmapDocument): void {
  assert.deepEqual(document.rootIds, [])
  assert.equal(document.rootId, null)
  assert.deepEqual(document.nodes, {})
  assert.deepEqual(document.links, [])
  assert.equal(document.title, source.title)
  assert.equal(document.defaultView, source.defaultView)
  assert.equal(document.layout, source.layout)
  assert.equal(document.assetsFolder, source.assetsFolder)
  assert.deepEqual(document.fileProperties, source.fileProperties)
  assert.deepEqual(document.canvasItems, source.canvasItems)
  assert.notStrictEqual(document.canvasItems, source.canvasItems)
  assert.notStrictEqual(document.canvasItems[0], source.canvasItems[0])
}

test('parses Markdown mindmap structure and frontmatter metadata', () => {
  const document = parseMindmapMarkdown(sample)

  assert.equal(document.rootId, 'node-root')
  assert.equal(document.defaultView, 'list')
  assert.equal(document.layout, 'horizontal')
  assert.equal(document.nodes['node-product'].collapsed, true)
  assert.deepEqual(document.nodes['node-product'].position, { x: 320, y: 120 })
  assert.deepEqual(document.nodes['node-root'].children, ['node-product', 'node-interface'])
})

test('round-trips supported Markdown without model loss', () => {
  const first = parseMindmapMarkdown(sample)
  const serialized = serializeMindmapMarkdown(first)
  const second = parseMindmapMarkdown(serialized)

  assert.deepEqual(second, first)
  assert.equal(serializeMindmapMarkdown(second), serialized)
})

test('keeps document title independent from the root outline line', () => {
  const document = {
    ...parseMindmapMarkdown(sample),
    title: 'Workspace title',
  }
  const updated = updateNodeMarkdown(document, 'node-root', '# Root outline line')
  const reopened = parseMindmapMarkdown(serializeMindmapMarkdown(updated))

  assert.equal(updated.title, 'Workspace title')
  assert.equal(updated.nodes['node-root'].markdown, '# Root outline line')
  assert.equal(reopened.title, 'Workspace title')
  assert.equal(reopened.nodes['node-root'].markdown, '# Root outline line')
})

test('round-trips ordered file properties through Markdown and JSON', () => {
  const source = `---
status: active
priority: 3
published: false
due: 2026-06-07
tags: [research, product]
source: https://example.com
properties:
  owner: product
  channels: [web, app]
mindmap:
  version: 1
  defaultView: list
  layout: horizontal
  root: node-root
nodes:
  node-root:
    collapsed: false
    color: neutral
assets:
  folder: ./assets
---

- Product notes {#node-root}
`

  const document = parseMindmapMarkdown(source)

  assert.deepEqual(
    document.fileProperties.map(({ key, type, value }) => ({ key, type, value })),
    [
      { key: 'status', type: 'text', value: 'active' },
      { key: 'priority', type: 'number', value: '3' },
      { key: 'published', type: 'boolean', value: 'false' },
      { key: 'due', type: 'date', value: '2026-06-07' },
      { key: 'tags', type: 'list', value: 'research, product' },
      { key: 'source', type: 'url', value: 'https://example.com' },
      { key: 'owner', type: 'text', value: 'product' },
      { key: 'channels', type: 'list', value: 'web, app' },
    ],
  )

  const markdownRoundtrip = parseMindmapMarkdown(serializeMindmapMarkdown(document))
  const jsonRoundtrip = parseMindmapJson(serializeMindmapJson(markdownRoundtrip))
  const filePropertiesYaml = serializeFilePropertiesYaml(jsonRoundtrip.fileProperties)

  assert.deepEqual(jsonRoundtrip.fileProperties, document.fileProperties)
  assert.deepEqual(parseFilePropertiesYaml(filePropertiesYaml), document.fileProperties)
  assert.ok(!filePropertiesYaml.includes('mindmap:'))
  assert.ok(!filePropertiesYaml.includes('nodes:'))
  assert.ok(!filePropertiesYaml.includes('assets:'))
  assert.equal(serializeMindmapMarkdown(jsonRoundtrip).indexOf('status: active') < serializeMindmapMarkdown(jsonRoundtrip).indexOf('priority: 3'), true)
})

test('serializes a clean Markdown export without frontmatter or node ids', () => {
  const document = parseMindmapMarkdown(sample)
  const clean = serializeCleanMarkdown(document)

  assert.ok(!clean.includes('mindmap:'))
  assert.ok(!clean.includes('{#node-root}'))
  assert.ok(clean.includes('- # Ideal product'))
  assert.ok(clean.includes('  - Vision'))
})

test('creates a philosophy of mind sample with two outline sublevels', () => {
  const document = createSampleMindmap()

  assert.equal(document.title, 'Philosophy of mind')
  assert.equal(document.defaultView, 'mindmap')
  assert.equal(document.rootId, 'node-root')
  assert.equal(document.nodes['node-root'].markdown, '# Philosophy of mind')
  assert.equal(document.nodes['node-root'].children.length, 4)
  assert.deepEqual(
    document.fileProperties.map(({ key, type, value }) => ({ key, type, value })),
    [
      { key: 'status', type: 'text', value: 'draft' },
      { key: 'topic', type: 'text', value: 'philosophy' },
      { key: 'tags', type: 'list', value: 'mind, consciousness, identity' },
    ],
  )

  for (const childId of document.nodes['node-root'].children) {
    const child = document.nodes[childId]

    assert.equal(child.children.length, 2)
    assert.ok(child.children.every((grandchildId) => document.nodes[grandchildId].children.length === 0))
  }

  const layout = computeMindmapLayout(document)
  const root = layout.get('node-root')
  const branchCenters = document.nodes['node-root'].children.map((childId) => {
    const node = layout.get(childId)

    assert.ok(node)

    return {
      x: node.x + node.width / 2,
      y: node.y + node.height / 2,
    }
  })

  assert.ok(root)
  assert.equal(
    root.x + root.width / 2,
    (Math.min(...branchCenters.map((center) => center.x)) + Math.max(...branchCenters.map((center) => center.x))) / 2,
  )
  assert.equal(
    root.y + root.height / 2,
    (Math.min(...branchCenters.map((center) => center.y)) + Math.max(...branchCenters.map((center) => center.y))) / 2,
  )
})

test('keeps edited tree operations round-trippable', () => {
  let document = parseMindmapMarkdown(sample)
  document = updateNodeMarkdown(document, 'node-list', 'Outline view')
  document = insertSiblingAfter(document, 'node-map', 'Clean Markdown export')
  document = indentNode(document, 'node-interface')
  document = moveNode(document, 'node-product', 1)
  document = toggleNodeCollapsed(document, 'node-product')

  const serialized = serializeMindmapMarkdown(document)
  const reopened = parseMindmapMarkdown(serialized)

  assert.deepEqual(reopened, document)
})

test('sets node background color on a whole subtree', () => {
  const document = setNodeSubtreeColor(parseMindmapMarkdown(sample), 'node-product', 'violet')

  assert.equal(document.nodes['node-product'].color, 'violet')
  assert.equal(document.nodes['node-local'].color, 'violet')
  assert.equal(document.nodes['node-markdown'].color, 'violet')
  assert.equal(document.nodes['node-interface'].color, 'neutral')
})

test('deletes a line only by promoting children when no previous sibling is available', () => {
  const document = deleteNodesPreservingChildren(parseMindmapMarkdown(sample), ['node-product'])

  assert.equal(document.nodes['node-product'], undefined)
  assert.deepEqual(document.nodes['node-root'].children, ['node-local', 'node-markdown', 'node-interface'])
  assert.equal(document.nodes['node-local'].parentId, 'node-root')
  assert.equal(document.nodes['node-markdown'].parentId, 'node-root')
})

test('deletes a line only by moving children under the previous sibling when available', () => {
  const document = deleteNodesPreservingChildren(parseMindmapMarkdown(sample), ['node-interface'])

  assert.equal(document.nodes['node-interface'], undefined)
  assert.deepEqual(document.nodes['node-product'].children, ['node-local', 'node-markdown', 'node-list', 'node-map'])
  assert.equal(document.nodes['node-list'].parentId, 'node-product')
  assert.equal(document.nodes['node-map'].parentId, 'node-product')
  assert.equal(document.nodes['node-product'].collapsed, false)
})

test('deletes a root line only by making its children roots', () => {
  const document = deleteNodesPreservingChildren(parseMindmapMarkdown(sample), ['node-root'])

  assert.equal(document.nodes['node-root'], undefined)
  assert.deepEqual(document.rootIds, ['node-product', 'node-interface'])
  assert.equal(document.rootId, 'node-product')
  assert.equal(document.nodes['node-product'].parentId, null)
  assert.equal(document.nodes['node-interface'].parentId, null)
})

test('deletes a root node and children by leaving an empty canvas', () => {
  const document = deleteNode(parseMindmapMarkdown(sample), 'node-root')

  assert.deepEqual(document.rootIds, [])
  assert.equal(document.rootId, null)
  assert.deepEqual(document.nodes, {})
})

test('keeps free canvas images and link previews when deleting the central node', () => {
  const source = createDocumentWithFreeCanvasItems()

  const document = deleteNode(source, 'node-root')

  assertEmptyMindmapPreservingCanvas(source, document)
})

test('keeps free canvas images and link previews when deleting all selected nodes', () => {
  const source = createDocumentWithFreeCanvasItems()

  const document = deleteNodes(source, ['node-root'])

  assertEmptyMindmapPreservingCanvas(source, document)
})

test('keeps free canvas images and link previews when removing every selected line', () => {
  const source = createDocumentWithFreeCanvasItems()

  const document = deleteNodesPreservingChildren(source, Object.keys(source.nodes))

  assertEmptyMindmapPreservingCanvas(source, document)
})

test('round-trips free canvas after deleting every node', () => {
  const source = createDocumentWithFreeCanvasItems()
  const document = deleteNodes(source, Object.keys(source.nodes))
  const fromMarkdown = parseMindmapMarkdown(serializeMindmapMarkdown(document))
  const fromJson = parseMindmapJson(serializeMindmapJson(document))

  assertEmptyMindmapPreservingCanvas(source, document)
  assert.deepEqual(fromMarkdown.rootIds, [])
  assert.equal(fromMarkdown.rootId, null)
  assert.deepEqual(fromMarkdown.nodes, {})
  assert.deepEqual(fromMarkdown.links, [])
  assert.deepEqual(fromMarkdown.canvasItems, source.canvasItems)
  assert.deepEqual(fromJson, document)
  assert.ok(serializeMindmapMarkdown(document).includes('canvas:'))
})

test('creates a first central node on an empty canvas', () => {
  const empty = deleteNode(parseMindmapMarkdown(sample), 'node-root')
  const document = insertRootNode(empty, 'New central node', { x: 120, y: 80 })
  const rootId = document.rootId

  assert.ok(rootId)
  assert.deepEqual(document.rootIds, [rootId])
  assert.equal(document.nodes[rootId].markdown, 'New central node')
  assert.deepEqual(document.nodes[rootId].position, { x: 120, y: 80 })
})

test('detaches a tree node as a new root', () => {
  const document = parseMindmapMarkdown(sample)
  document.nodes['node-local'].edgeLabel = 'branch'
  document.nodes['node-local'].edgeColor = '#ef4444'
  document.nodes['node-local'].edgeArrows = 'end'

  const detached = detachNodeAsRoot(document, 'node-local')

  assert.deepEqual(detached.nodes['node-product'].children, ['node-markdown'])
  assert.deepEqual(detached.rootIds, ['node-root', 'node-local'])
  assert.equal(detached.nodes['node-local'].parentId, null)
  assert.equal(detached.nodes['node-local'].edgeLabel, undefined)
  assert.equal(detached.nodes['node-local'].edgeColor, undefined)
  assert.equal(detached.nodes['node-local'].edgeArrows, undefined)
})

test('moves selected sibling lines as a block', () => {
  const document = moveNodes(parseMindmapMarkdown(sample), ['node-product', 'node-interface'], 1)

  assert.deepEqual(document.nodes['node-root'].children, ['node-product', 'node-interface'])

  const moved = moveNodes(parseMindmapMarkdown(sample), ['node-interface'], -1)

  assert.deepEqual(moved.nodes['node-root'].children, ['node-interface', 'node-product'])
})

test('moves selected lines independently inside their own parent groups', () => {
  const document = moveNodes(parseMindmapMarkdown(sample), ['node-markdown', 'node-map'], -1)

  assert.deepEqual(document.nodes['node-product'].children, ['node-markdown', 'node-local'])
  assert.deepEqual(document.nodes['node-interface'].children, ['node-map', 'node-list'])
})

test('sets outline collapse state to a visible level', () => {
  const document = parseMindmapMarkdown(sample)
  const levelOne = setCollapsedToDepth(document, 1)

  assert.equal(levelOne.nodes['node-root'].collapsed, true)
  assert.equal(levelOne.nodes['node-product'].collapsed, true)
  assert.deepEqual(getVisibleNodeIds(levelOne), ['node-root'])

  const levelTwo = setCollapsedToDepth(levelOne, 2)

  assert.equal(levelTwo.nodes['node-root'].collapsed, false)
  assert.equal(levelTwo.nodes['node-product'].collapsed, true)
  assert.equal(levelTwo.nodes['node-interface'].collapsed, true)
  assert.deepEqual(getVisibleNodeIds(levelTwo), ['node-root', 'node-product', 'node-interface'])

  const levelThree = setCollapsedToDepth(levelTwo, 3)

  assert.equal(levelThree.nodes['node-product'].collapsed, false)
  assert.equal(levelThree.nodes['node-interface'].collapsed, false)
  assert.deepEqual(getVisibleNodeIds(levelThree), [
    'node-root',
    'node-product',
    'node-local',
    'node-markdown',
    'node-interface',
    'node-list',
    'node-map',
  ])
})

test('round-trips the same model through JSON without model loss', () => {
  const first = parseMindmapMarkdown(sample)
  const serialized = serializeMindmapJson(first)
  const second = parseMindmapJson(serialized)

  assert.deepEqual(second, first)
  assert.equal(serializeMindmapJson(second), serialized)
})

test('round-trips edits through Markdown and JSON together', () => {
  let document = parseMindmapMarkdown(sample)
  document = updateNodeMarkdown(document, 'node-map', 'Interactive map view')
  document = insertSiblingAfter(document, 'node-map', 'JSON compatibility')
  document = toggleNodeCollapsed(document, 'node-product')

  const fromJson = parseMindmapJson(serializeMindmapJson(document))
  const fromMarkdown = parseMindmapMarkdown(serializeMindmapMarkdown(fromJson))

  assert.deepEqual(fromJson, document)
  assert.deepEqual(fromMarkdown, document)
})

test('round-trips internal bullet lines without creating child nodes', () => {
  let document = parseMindmapMarkdown(sample)
  document = updateNodeMarkdown(document, 'node-list', 'Outline view\n- Automatic bullets\n- Toolbar toggle')

  const serialized = serializeMindmapMarkdown(document)
  const reopened = parseMindmapMarkdown(serialized)

  assert.ok(serialized.includes('\\- Automatic bullets'))
  assert.deepEqual(reopened, document)
  assert.deepEqual(reopened.nodes['node-list'].children, [])
})

test('round-trips cross-node links through Markdown and JSON', () => {
  let document = parseMindmapMarkdown(sample)
  document = addNodeLink(document, 'node-list', 'node-markdown')
  document = setNodeLinkArrows(document, document.links[0].id, 'both')
  document = setTreeEdgeArrows(document, 'node-list', 'start')

  const fromMarkdown = parseMindmapMarkdown(serializeMindmapMarkdown(document))
  const fromJson = parseMindmapJson(serializeMindmapJson(document))

  assert.deepEqual(fromMarkdown, document)
  assert.deepEqual(fromJson, document)
})

test('round-trips free canvas images and link previews through Markdown and JSON', () => {
  const document = parseMindmapMarkdown(sample)
  document.canvasItems = [
    {
      id: 'canvas-image-reference',
      type: 'image',
      x: 420,
      y: 180,
      width: 320,
      src: './assets/reference.png',
      alt: 'Reference',
    },
    {
      id: 'canvas-link-reference',
      type: 'link',
      x: 780,
      y: 220,
      width: 286,
      height: 188,
      url: 'https://example.com/research',
      title: 'example.com',
      description: 'https://example.com/research',
      provider: 'Example',
      image: 'https://example.com/cover.jpg',
      favicon: 'https://example.com/favicon.ico',
      previewKind: 'article',
    },
  ]

  const fromMarkdown = parseMindmapMarkdown(serializeMindmapMarkdown(document))
  const fromJson = parseMindmapJson(serializeMindmapJson(document))

  assert.deepEqual(fromMarkdown, document)
  assert.deepEqual(fromJson, document)
  assert.ok(serializeMindmapMarkdown(document).includes('canvas:'))
})
