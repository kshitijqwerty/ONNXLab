import type { OutputTensor, NumericArray } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TensorLike = Record<string, any>;

export function parseOutputs(outputs: TensorLike): OutputTensor[] {
  const parsed: OutputTensor[] = [];

  for (const [name, tensor] of Object.entries(outputs)) {
    parsed.push({
      name,
      type: tensor.type,
      dims: tensor.dims,
      data: tensor.data as NumericArray,
    });
  }

  return parsed;
}
