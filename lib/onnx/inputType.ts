export function detectInputType(shape: readonly (number | string | null)[]) {
  if (!shape) return "unknown";

  // NCHW: [N, C, H, W] where C is 1 or 3
  if (shape.length === 4) {
    const c = Number(shape[1]);
    if (c === 3 || c === 1) return "image";
    // NHWC: [N, H, W, C] where last dim is 1 or 3
    const cLast = Number(shape[3]);
    if (cLast === 3 || cLast === 1) return "image";
  }

  if (shape.length === 2) return "sequence";
  if (shape.length === 1) return "vector";
  return "tensor";
}
