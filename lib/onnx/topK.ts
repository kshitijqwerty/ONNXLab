export function topK(values: number[], k = 5) {
  return values
    .map((value, index) => ({
      index,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, k);
}
