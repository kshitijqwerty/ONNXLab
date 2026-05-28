"use client";

import { useState } from "react";

import { detectInputType } from "@/lib/onnx/inputType";
import { imageToTensor } from "@/lib/onnx/imageTensor";
import { runInference } from "@/lib/onnx/runInference";
import { parseOutputs } from "@/lib/onnx/parseOutputs";

import OutputViewer from "./OutputViewer";
import type { OutputTensor } from "@/lib/onnx/types";

interface InputMetadata {
  name: string;
  shape?: readonly (number | string | null)[];
  isTensor: boolean;
  type?: string;
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
}

export default function InputPanel({ session }: Props) {
  const [outputs, setOutputs] = useState<OutputTensor[] | null>(null);
  const [running, setRunning] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);

  if (!session) {
    return null;
  }

  async function handleImageInference(file: File, meta: InputMetadata) {
    try {
      setRunning(true);

      const shape = meta.shape ?? [];

      const height = Number(shape[2]) || 224;

      const width = Number(shape[3]) || 224;

      // Convert image -> tensor
      const tensor = await imageToTensor(file, width, height);

      // Run inference
      const results = await runInference(session, meta.name, tensor);

      // Parse outputs
      const parsed = parseOutputs(results);

      setOutputs(parsed);
    } catch (error) {
      console.error(error);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div
      className="
        mt-6
        rounded-3xl
        border
        border-white/10
        bg-[#111827]
        p-6
        text-white
        shadow-2xl
      "
    >
      {/* Header */}
      <div className="mb-6">
        <h2
          className="
            text-2xl
            font-bold
          "
        >
          Model Inputs
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-gray-400
          "
        >
          Runtime-detected ONNX model inputs
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        {session.inputMetadata?.map((meta: InputMetadata, index: number) => {
          const shape = meta.shape || [];

          const inputType = detectInputType(shape);

          return (
            <div
              key={index}
              className="
                  rounded-2xl
                  border
                  border-white/5
                  bg-black/20
                  p-5
                "
            >
              {/* Name */}
              <div className="mb-4">
                <div
                  className="
                      mb-2
                      text-xs
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                >
                  Input Name
                </div>

                <div
                  className="
                      overflow-x-auto
                      whitespace-nowrap
                      rounded-lg
                      bg-black/40
                      p-3
                      font-mono
                      text-sm
                      text-cyan-300
                    "
                >
                  {meta.name}
                </div>
              </div>

              {/* Metadata */}
              <div
                className="
                    mb-4
                    grid
                    grid-cols-2
                    gap-4
                  "
              >
                {/* Type */}
                <div
                  className="
                      rounded-xl
                      bg-black/30
                      p-3
                    "
                >
                  <div
                    className="
                        mb-1
                        text-xs
                        uppercase
                        tracking-wide
                        text-gray-500
                      "
                  >
                    Type
                  </div>

                  <div
                    className="
                        font-mono
                        text-sm
                        text-green-300
                      "
                  >
                    {meta.type || "unknown"}
                  </div>
                </div>

                {/* Shape */}
                <div
                  className="
                      rounded-xl
                      bg-black/30
                      p-3
                    "
                >
                  <div
                    className="
                        mb-1
                        text-xs
                        uppercase
                        tracking-wide
                        text-gray-500
                      "
                  >
                    Shape
                  </div>

                  <div
                    className="
                        overflow-x-auto
                        whitespace-nowrap
                        font-mono
                        text-sm
                        text-blue-300
                      "
                  >
                    [{shape.length ? shape.join(", ") : "unknown"}]
                  </div>
                </div>
              </div>

              {/* INPUT UI */}
              <div>
                <div
                  className="
                      mb-2
                      text-xs
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                >
                  Input Method
                </div>

                {/* IMAGE INPUT */}
                {inputType === "image" && (
                  <div
                    className="
                        rounded-2xl
                        border
                        border-dashed
                        border-cyan-400/30
                        bg-cyan-400/5
                        p-6
                      "
                  >
                    {/* Image Upload */}
                    <div className="mb-5">
                      <div
                        className="
                            mb-2
                            text-xs
                            uppercase
                            tracking-wide
                            text-gray-500
                          "
                      >
                        Upload Image
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];

                          if (!file) {
                            return;
                          }

                          await handleImageInference(file, meta);
                        }}
                        className="
                            block
                            w-full
                            text-sm
                          "
                      />
                    </div>

                    {/* Labels Upload */}
                    <div>
                      <div
                        className="
                            mb-2
                            text-xs
                            uppercase
                            tracking-wide
                            text-gray-500
                          "
                      >
                        Optional Labels JSON
                      </div>

                      <input
                        type="file"
                        accept=".json"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];

                          if (!file) {
                            return;
                          }

                          const text = await file.text();

                          const parsed = JSON.parse(text);

                          setLabels(parsed);
                        }}
                        className="
                            block
                            w-full
                            text-sm
                          "
                      />
                      {/* Labels Status */}
                      {labels.length > 0 && (
                        <div
                          className="
                            mt-3
                            rounded-xl
                            border
                            border-green-400/20
                            bg-green-400/10
                            px-4
                            py-3
                            text-sm
                            text-green-300
                          "
                        >
                          Loaded{" "}
                          <span className="font-semibold">{labels.length}</span>{" "}
                          labels
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* VECTOR INPUT */}
                {inputType === "vector" && (
                  <textarea
                    placeholder="
0.1, 0.2, 0.3 ...
                      "
                    rows={4}
                    className="
                        w-full
                        rounded-2xl
                        border
                        border-white/10
                        bg-black/40
                        p-4
                        font-mono
                        text-sm
                        text-white
                        outline-none
                      "
                  />
                )}

                {/* GENERIC TENSOR */}
                {inputType === "tensor" && (
                  <textarea
                    placeholder="
Tensor values...
                      "
                    rows={6}
                    className="
                        w-full
                        rounded-2xl
                        border
                        border-white/10
                        bg-black/40
                        p-4
                        font-mono
                        text-sm
                        text-white
                        outline-none
                      "
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading */}
      {running && (
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-cyan-400/20
            bg-cyan-400/5
            p-4
            text-sm
            text-cyan-300
          "
        >
          Running inference...
        </div>
      )}

      {/* Outputs */}
      {outputs && (
        <OutputViewer
          outputs={outputs}
          labels={labels}
          inputName={session.inputMetadata?.[0]?.name}
          inputShape={session.inputMetadata?.[0]?.shape}
        />
      )}
    </div>
  );
}
