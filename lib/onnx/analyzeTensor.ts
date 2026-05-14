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

  // Stats
  const min = Math.min(...data);

  const max = Math.max(...data);

  const mean = data.reduce((a: number, b: number) => a + b, 0) / total;

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
