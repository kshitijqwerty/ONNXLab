export function analyzeTensor(output: any) {
  const shape = output.dims || [];

  const data = output.data || [];

  const total = data.length;

  // Prevent crashes
  if (total === 0) {
    return {
      total: 0,
      min: 0,
      max: 0,
      mean: 0,
      isClassification: false,
      isEmbedding: false,
      isDetection: false,
    };
  }

  let min = Infinity;
  let max = -Infinity;
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }

  const mean = sum / total;

  // Tensor type heuristics

  // Example:
  // [1,1000]
  const isClassification = shape.length === 2 && shape[0] === 1;

  // Example:
  // [1,768]
  const isEmbedding = shape.length === 2 && shape[1] >= 128 && shape[1] <= 4096;

  // Example:
  // [1,N,85]
  const isDetection = shape.length === 3;

  return {
    total,
    min,
    max,
    mean,
    isClassification,
    isEmbedding,
    isDetection,
  };
}
