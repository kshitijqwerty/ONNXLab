interface IndexedValue {
  index: number;
  value: number;
}

export function topK(values: ArrayLike<number>, k = 5) {
  if (k <= 0) return [];
  if (k >= values.length) {
    const indexed: IndexedValue[] = [];
    for (let i = 0; i < values.length; i++) {
      indexed.push({ index: i, value: values[i] });
    }
    return indexed.sort((a, b) => b.value - a.value);
  }

  // Min-heap by keeping array sorted ascending; heap[heap.length - 1] is min
  const heap: IndexedValue[] = [];

  for (let i = 0; i < values.length; i++) {
    const entry: IndexedValue = { index: i, value: values[i] };

    if (heap.length < k) {
      heap.push(entry);
      if (heap.length === k) {
        heap.sort((a, b) => b.value - a.value);
      }
    } else if (entry.value > heap[heap.length - 1].value) {
      heap[heap.length - 1] = entry;
      heap.sort((a, b) => b.value - a.value);
    }
  }

  return heap;
}
