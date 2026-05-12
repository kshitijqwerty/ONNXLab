import * as protobuf from "protobufjs";

function extractTensorShape(tensorType: any) {
  if (!tensorType) {
    return null;
  }

  const dims = tensorType.shape?.dim || [];

  if (!dims.length) {
    return null;
  }

  return dims.map((d: any) => {
    if (d.dimValue !== undefined && d.dimValue !== null) {
      return d.dimValue;
    }

    if (d.dimParam) {
      return d.dimParam;
    }

    return "?";
  });
}

function buildTensorMap(tensors: any[]) {
  const map = new Map();

  tensors.forEach((tensor: any) => {
    const tensorType = tensor.type?.tensorType;

    map.set(tensor.name, {
      name: tensor.name,

      elemType: tensorType?.elemType,

      shape: extractTensorShape(tensorType) || null,
    });
  });

  return map;
}

export async function parseGraph(arrayBuffer: ArrayBuffer) {
  const root = await protobuf.load("/onnx.proto3");

  const ModelProto = root.lookupType("onnx.ModelProto");

  const decoded = ModelProto.decode(new Uint8Array(arrayBuffer)) as any;

  const graph = decoded.graph;

  const allTensors = [
    ...(graph.input || []),

    ...(graph.output || []),

    ...(graph.valueInfo || []),
  ];

  const tensorMap = buildTensorMap(allTensors);

  return {
    name: graph.name,

    tensorMap,

    nodes: (graph.node || []).map((node: any) => ({
      name: node.name,

      opType: node.opType,

      domain: node.domain,

      inputs: (node.input || []).map((name: string) => ({
        name,

        tensor: tensorMap.get(name),
      })),

      outputs: (node.output || []).map((name: string) => ({
        name,

        tensor: tensorMap.get(name),
      })),

      attributes: node.attribute || [],
    })),
  };
}
