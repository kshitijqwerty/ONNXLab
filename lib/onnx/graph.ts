import dagre from "dagre";

import { MarkerType, Position } from "reactflow";

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 180;
const NODE_HEIGHT = 90;

export function buildGraph(graph: any) {
  dagreGraph.setGraph({
    rankdir: "TB",

    nodesep: 120,

    ranksep: 180,
  });

  const nodes = graph.nodes.map((node: any, index: number) => {
    const nodeId = node.name || `${node.opType}-${index}`;

    dagreGraph.setNode(nodeId, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });

    return {
      id: nodeId,

      type: "operator",

      position: {
        x: 0,
        y: 0,
      },

      targetPosition: Position.Top,

      sourcePosition: Position.Bottom,

      data: {
        label: node.opType,

        opType: node.opType,

        domain: node.domain,

        inputs: node.inputs,

        outputs: node.outputs,

        attributes: node.attributes,

        originalNode: node,
      },
    };
  });

  const tensorMap = new Map<string, string>();

  graph.nodes.forEach((node: any, index: number) => {
    const nodeId = node.name || `${node.opType}-${index}`;

    node.outputs.forEach((output: any) => {
      tensorMap.set(output.name, nodeId);
    });
  });

  const edges: any[] = [];

  graph.nodes.forEach((node: any, index: number) => {
    const targetId = node.name || `${node.opType}-${index}`;

    node.inputs.forEach((input: any) => {
      const sourceId = tensorMap.get(input.name);

      if (sourceId && sourceId !== targetId) {
        edges.push({
          id: `${sourceId}-${targetId}-${input.name}`,

          source: sourceId,

          target: targetId,

          label: input.tensor?.shape
            ? `[${input.tensor.shape.join(", ")}]`
            : "",

          type: "smoothstep",

          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        });

        dagreGraph.setEdge(sourceId, targetId);
      }
    });
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node: any) => {
    const pos = dagreGraph.node(node.id);

    node.position = {
      x: pos.x - NODE_WIDTH / 2,
      y: pos.y - NODE_HEIGHT / 2,
    };
  });

  return {
    nodes,
    edges,
  };
}
