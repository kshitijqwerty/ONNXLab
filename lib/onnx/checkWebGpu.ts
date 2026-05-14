export async function checkWebGPU() {
  if (!navigator.gpu) {
    return false;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    return !!adapter;
  } catch {
    return false;
  }
}
