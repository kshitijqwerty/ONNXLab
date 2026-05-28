"use client";

import * as ort from "onnxruntime-web";
import { useState, useEffect } from "react";
import { parseOnnxModel } from "@/lib/onnx/parser";
import type { ParsedModel, ParsedInput } from "@/lib/onnx/parser";
import { buildGraph } from "@/lib/onnx/graph";
import type { GraphResult } from "@/lib/onnx/graph";
import ModelGraph from "@/components/graph/ModelGraph";
import { parseGraph } from "@/lib/onnx/graphParser";
import { createSession } from "@/lib/onnx/inference";
import InputPanel from "@/components/inference/InputPanel";
import { checkWebGPU } from "@/lib/onnx/checkWebGpu";

export default function OnnxUploader() {
  const [fileName, setFileName] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [modelInfo, setModelInfo] = useState<ParsedModel | null>(null);
  const [graph, setGraph] = useState<GraphResult | null>(null);
  const [session, setSession] = useState<ort.InferenceSession | null>(null);
  const [gpuEnabled, setGpuEnabled] = useState(false);

  // GPU check
  useEffect(() => {
    async function check() {
      const supported = await checkWebGPU();

      setGpuEnabled(supported);
    }

    check();
  }, []);

  async function handleFile(file: File) {
    setError("");

    if (!file.name.endsWith(".onnx")) {
      setError("Please upload a valid ONNX file");
      return;
    }

    try {
      setLoading(true);

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      const runtimeSession = await createSession(arrayBuffer);

      setSession(runtimeSession);

      setFileName(file.name);

      const parsed = await parseOnnxModel(arrayBuffer);
      setModelInfo(parsed);

      const realGraph = await parseGraph(arrayBuffer);
      const generatedGraph = buildGraph(realGraph);

      setGraph(generatedGraph);
    } catch (err) {
      console.error(err);
      setError("Failed to read ONNX file");
    } finally {
      setLoading(false);
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file) {
      handleFile(file);
    }
  }

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div
        className="
            mt-3
            inline-flex
            items-center
            rounded-full
            border
            border-cyan-400/20
            bg-cyan-400/10
            px-4
            py-2
            text-sm
            text-cyan-300
          "
      >
        {gpuEnabled ? "WebGPU Enabled" : "Running on WASM"}
      </div>
      {/* Upload Section */}
      <div
        className="
      w-full
      rounded-3xl
      border
      border-white/10
      bg-white/5
      p-10
      backdrop-blur-xl
    "
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Upload ONNX Model
          </h2>

          <p className="mb-8 text-gray-400">Drag and drop your ONNX file</p>

          <input
            type="file"
            accept=".onnx"
            onChange={onSelect}
            className="hidden"
            id="onnx-upload"
          />

          <label
            htmlFor="onnx-upload"
            className="
            cursor-pointer
            rounded-2xl
            bg-blue-600
            px-8
            py-4
            font-medium
            text-white
            transition
            hover:bg-blue-500
          "
          >
            Select File
          </label>

          {fileName && (
            <p className="mt-4 text-green-400">Loaded: {fileName}</p>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div
        className="
      flex
      w-full
      gap-6
      items-start
    "
      >
        {/* Left Side */}
        <div className="flex-1 space-y-6">
          {/* Model Info */}
          {modelInfo && (
            <div
              className="
            rounded-3xl
            border
            border-white/10
            bg-white/5
            p-6
            text-white
            backdrop-blur-xl
          "
            >
              <h3 className="mb-6 text-2xl font-bold">Model Information</h3>

              {/* Inputs */}
              <div className="mb-6">
                <h4 className="mb-3 text-lg font-semibold">Inputs</h4>

                <div className="space-y-3">
                  {modelInfo.inputs.map((input: ParsedInput) => (
                    <div
                      key={input.name}
                      className="
                      rounded-2xl
                      bg-black/20
                      p-4
                    "
                    >
                      <p>
                        <strong>Name:</strong> {input.name}
                      </p>

                      <p>
                        <strong>Type:</strong> {input.type}
                      </p>

                      <p>
                        <strong>Shape:</strong> [{input.dimensions?.join(", ")}]
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outputs */}
              <div>
                <h4 className="mb-3 text-lg font-semibold">Outputs</h4>

                <div className="space-y-3">
                  {modelInfo.outputs.map((output: ParsedInput) => (
                    <div
                      key={output.name}
                      className="
                      rounded-2xl
                      bg-black/20
                      p-4
                    "
                    >
                      <p>
                        <strong>Name:</strong> {output.name}
                      </p>

                      <p>
                        <strong>Type:</strong> {output.type}
                      </p>

                      <p>
                        <strong>Shape:</strong> [{output.dimensions?.join(", ")}
                        ]
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Graph */}
          {graph && <ModelGraph nodes={graph.nodes} edges={graph.edges} />}
          {session && <InputPanel session={session} />}
        </div>
      </div>
    </div>
  );
}
