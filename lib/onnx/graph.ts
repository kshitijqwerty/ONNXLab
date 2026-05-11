import { Edge, Node } from 'reactflow'

export function buildGraph(graph: any) {

  const nodes: Node[] = []
  const edges: Edge[] = []

  graph.node.forEach((node: any, index: number) => {

    nodes.push({
      id: `node-${index}`,
      position: {
        x: index * 250,
        y: 100
      },
      data: {
        label: node.opType
      },
      type: 'default'
    })

    // Connect sequentially
    if (index > 0) {
      edges.push({
        id: `edge-${index}`,
        source: `node-${index - 1}`,
        target: `node-${index}`
      })
    }
  })

  return {
    nodes,
    edges
  }
}