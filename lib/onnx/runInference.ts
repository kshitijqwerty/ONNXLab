import * as ort from "onnxruntime-web";

export async function runInference(
  session: ort.InferenceSession,
  inputName: string,
  tensor: ort.Tensor,
) {
  const feeds: Record<string, ort.Tensor> = {
    [inputName]: tensor,
  };

  const results = await session.run(feeds);

  return results;
}
