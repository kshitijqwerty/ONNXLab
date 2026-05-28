import * as ort from "onnxruntime-web";

export async function imageToTensor(
  file: File,
  width = 224,
  height = 224,
  format: "nchw" | "nhwc" = "nchw",
) {
  const image = await createImageBitmap(file);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context failed");

  ctx.drawImage(image, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  const pixels = width * height;

  if (format === "nhwc") {
    const floatData = new Float32Array(1 * height * width * 3);
    for (let i = 0; i < pixels; i++) {
      floatData[i * 3] = data[i * 4] / 255.0;
      floatData[i * 3 + 1] = data[i * 4 + 1] / 255.0;
      floatData[i * 3 + 2] = data[i * 4 + 2] / 255.0;
    }
    return new ort.Tensor("float32", floatData, [1, height, width, 3]);
  }

  // NCHW (channel-first)
  const floatData = new Float32Array(1 * 3 * pixels);
  for (let i = 0; i < pixels; i++) {
    floatData[i] = data[i * 4] / 255.0;
    floatData[pixels + i] = data[i * 4 + 1] / 255.0;
    floatData[2 * pixels + i] = data[i * 4 + 2] / 255.0;
  }
  return new ort.Tensor("float32", floatData, [1, 3, height, width]);
}
