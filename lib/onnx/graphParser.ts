import protobuf from 'protobufjs'

export async function parseGraph(
  arrayBuffer: ArrayBuffer
) {

  // Load ONNX proto schema
  const root = await protobuf.load(
    './onnx.proto3'
  )

  const ModelProto = root.lookupType('onnx.ModelProto')

  // Decode model
  const decoded = ModelProto.decode(
    new Uint8Array(arrayBuffer)
  )

  const model = ModelProto.toObject(decoded, {
    longs: String,
    enums: String,
    bytes: String
  }) as any

  const graph = model.graph

  return graph
}