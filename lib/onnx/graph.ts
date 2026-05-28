import dagre from "dagre";
import { MarkerType, Position } from "reactflow";
import type { Node, Edge } from "reactflow";
import type { ParsedGraph, GraphNode, Attribute } from "./types";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 180;
const NODE_HEIGHT = 90;

export interface OperatorNodeData {
  label: string;
  opType: string;
  domain: string;
  inputs: GraphNode["inputs"];
  outputs: GraphNode["outputs"];
  attributes: Attribute[];
  originalNode: GraphNode;
}

export interface GraphResult {
  nodes: Node<OperatorNodeData>[];
  edges: Edge[];
}

export function buildGraph(graph: ParsedGraph): GraphResult {
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 120, ranksep: 180 });

  const nodes: Node<OperatorNodeData>[] = graph.nodes.map(
    (node: GraphNode, index: number) => {
      const nodeId = node.name || `${node.opType}-${index}`;

      dagreGraph.setNode(nodeId, { width: NODE_WIDTH, height: NODE_HEIGHT });

      return {
        id: nodeId,
        type: "operator",
        position: { x: 0, y: 0 },
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
    }
  );

  const tensorMap = new Map<string, string>();

  for (const node of graph.nodes) {
    const nodeId = node.name || `${node.opType}`;
    for (const output of node.outputs) {
      tensorMap.set(output.name, nodeId);
    }
  }

  const edges: Edge[] = [];

  for (const node of graph.nodes) {
    const targetId = node.name || `${node.opType}`;

    for (const input of node.inputs) {
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
          markerEnd: { type: MarkerType.ArrowClosed },
        });

        dagreGraph.setEdge(sourceId, targetId);
      }
    }
  }

  dagre.layout(dagreGraph);

  for (const node of nodes) {
    const pos = dagreGraph.node(node.id);
    node.position = {
      x: pos.x - NODE_WIDTH / 2,
      y: pos.y - NODE_HEIGHT / 2,
    };
  }

  return { nodes, edges };
}
