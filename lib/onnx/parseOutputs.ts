export function parseOutputs(outputs: any) {
  const parsed: any[] = [];

  Object.entries(outputs).forEach(([name, tensor]: any) => {
    parsed.push({
      name,
      type: tensor.type,
      dims: tensor.dims,
      data: Array.from(tensor.data),
    });
  });

  return parsed;
}
