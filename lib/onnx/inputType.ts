export function detectInputType(shape: readonly (number | string | null)[]) {
  if (!shape) {
    return "unknown";
  }

  if (shape.length === 4 && (shape[1] === 3 || shape[1] === 1)) {
    return "image";
  }

  if (shape.length === 2) {
    return "sequence";
  }

  if (shape.length === 1) {
    return "vector";
  }

  return "tensor";
}
