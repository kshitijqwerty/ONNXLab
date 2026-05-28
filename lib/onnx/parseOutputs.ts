export function parseOutputs(outputs: Record<string, any>) {
  const parsed: any[] = [];

  for (const [name, tensor] of Object.entries(outputs)) {
    const data: Float32Array | BigInt64Array | Int32Array | Uint8Array =
      tensor.data;
    parsed.push({ name, type: tensor.type, dims: tensor.dims, data });
  }

  return parsed;
}
