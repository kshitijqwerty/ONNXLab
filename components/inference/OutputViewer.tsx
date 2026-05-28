"use client";

import { topK } from "@/lib/onnx/topK";
import { analyzeTensor } from "@/lib/onnx/analyzeTensor";
import type { OutputTensor } from "@/lib/onnx/types";

interface Props {
  outputs: OutputTensor[];
  labels: string[];
  inputName?: string;
  inputShape?: readonly (string | number | null)[];
}

export default function OutputViewer({
  outputs,
  labels,
  inputName,
  inputShape,
}: Props) {
  return (
    <div
      className="
        mt-6
        rounded-3xl
        border
        border-green-400/20
        bg-green-400/5
        p-6
      "
    >
      {/* Header */}
      <div className="mb-6">
        <h2
          className="
            text-2xl
            font-bold
            text-green-300
          "
        >
          Inference Outputs
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-gray-400
          "
        >
          Parsed ONNX Runtime output tensors
        </p>
      </div>

      {/* Inference Info */}
      <div
        className="
          mb-6
          grid
          grid-cols-2
          gap-4
        "
      >
        {/* Input */}
        <div
          className="
            rounded-2xl
            bg-black/30
            p-4
          "
        >
          <div
            className="
              mb-2
              text-xs
              uppercase
              tracking-wide
              text-gray-500
            "
          >
            Input Tensor
          </div>

          <div
            className="
              mb-2
              overflow-x-auto
              whitespace-nowrap
              font-mono
              text-sm
              text-cyan-300
            "
          >
            {inputName || "unknown"}
          </div>

          <div
            className="
              font-mono
              text-xs
              text-gray-400
            "
          >
            Shape: [{inputShape?.join(", ") || "unknown"}]
          </div>
        </div>

        {/* Labels */}
        <div
          className="
            rounded-2xl
            bg-black/30
            p-4
          "
        >
          <div
            className="
              mb-2
              text-xs
              uppercase
              tracking-wide
              text-gray-500
            "
          >
            Labels
          </div>

          <div
            className="
              font-mono
              text-sm
              text-green-300
            "
          >
            {labels.length > 0 ? `${labels.length} loaded` : "No labels loaded"}
          </div>
        </div>
      </div>

      {/* Outputs */}
      <div className="space-y-6">
        {outputs.map((output, index) => {
          const predictions = topK(output.data, 5);

          const analysis = analyzeTensor(output);

          return (
            <div
              key={index}
              className="
                  rounded-2xl
                  border
                  border-white/5
                  bg-black/30
                  p-5
                "
            >
              {/* Tensor Name */}
              <div className="mb-4">
                <div
                  className="
                      mb-2
                      text-xs
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                >
                  Output Tensor
                </div>

                <div
                  className="
                      overflow-x-auto
                      whitespace-nowrap
                      rounded-xl
                      bg-black/40
                      p-3
                      font-mono
                      text-sm
                      text-cyan-300
                    "
                >
                  {output.name}
                </div>
              </div>

              {/* Metadata */}
              <div
                className="
                    mb-6
                    grid
                    grid-cols-2
                    gap-4
                  "
              >
                {/* Type */}
                <div
                  className="
                      rounded-xl
                      bg-black/40
                      p-4
                    "
                >
                  <div
                    className="
                        mb-2
                        text-xs
                        uppercase
                        tracking-wide
                        text-gray-500
                      "
                  >
                    Tensor Type
                  </div>

                  <div
                    className="
                        font-mono
                        text-sm
                        text-green-300
                      "
                  >
                    {output.type}
                  </div>
                </div>

                {/* Shape */}
                <div
                  className="
                      rounded-xl
                      bg-black/40
                      p-4
                    "
                >
                  <div
                    className="
                        mb-2
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
                    [{output.dims.join(", ")}]
                  </div>
                </div>
              </div>

              {/* Tensor Analysis */}
              <div className="mb-6">
                <div
                  className="
                      mb-3
                      text-xs
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                >
                  Tensor Analysis
                </div>

                <div
                  className="
                      grid
                      grid-cols-2
                      gap-3
                    "
                >
                  {/* Total */}
                  <div
                    className="
                        rounded-xl
                        bg-black/30
                        p-4
                      "
                  >
                    <div
                      className="
                          mb-1
                          text-xs
                          text-gray-500
                        "
                    >
                      Total Values
                    </div>

                    <div
                      className="
                          font-mono
                          text-cyan-300
                        "
                    >
                      {analysis.total}
                    </div>
                  </div>

                  {/* Min */}
                  <div
                    className="
                        rounded-xl
                        bg-black/30
                        p-4
                      "
                  >
                    <div
                      className="
                          mb-1
                          text-xs
                          text-gray-500
                        "
                    >
                      Min Value
                    </div>

                    <div
                      className="
                          font-mono
                          text-green-300
                        "
                    >
                      {analysis.min.toFixed(4)}
                    </div>
                  </div>

                  {/* Max */}
                  <div
                    className="
                        rounded-xl
                        bg-black/30
                        p-4
                      "
                  >
                    <div
                      className="
                          mb-1
                          text-xs
                          text-gray-500
                        "
                    >
                      Max Value
                    </div>

                    <div
                      className="
                          font-mono
                          text-yellow-300
                        "
                    >
                      {analysis.max.toFixed(4)}
                    </div>
                  </div>

                  {/* Mean */}
                  <div
                    className="
                        rounded-xl
                        bg-black/30
                        p-4
                      "
                  >
                    <div
                      className="
                          mb-1
                          text-xs
                          text-gray-500
                        "
                    >
                      Mean Value
                    </div>

                    <div
                      className="
                          font-mono
                          text-pink-300
                        "
                    >
                      {analysis.mean.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Predictions */}
              <div className="mb-6">
                <div
                  className="
                      mb-3
                      text-xs
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                >
                  Top Predictions
                </div>

                <div className="space-y-2">
                  {predictions.map((pred, idx) => (
                    <div
                      key={idx}
                      className="
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            border
                            border-white/5
                            bg-black/30
                            px-4
                            py-3
                          "
                    >
                      {/* Label */}
                      <div
                        className="
                              overflow-x-auto
                              whitespace-nowrap
                              font-mono
                              text-sm
                              text-cyan-300
                            "
                      >
                        {labels[pred.index] || `Class ${pred.index}`}
                      </div>

                      {/* Value */}
                      <div
                        className="
                              font-mono
                              text-sm
                              text-green-300
                            "
                      >
                        {pred.value.toFixed(4)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw Tensor Data */}
              <div>
                <div
                  className="
                      mb-3
                      text-xs
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                >
                  Raw Tensor Data
                </div>

                <pre
                  className="
                      max-h-[300px]
                      overflow-auto
                      rounded-2xl
                      bg-black/50
                      p-4
                      font-mono
                      text-xs
                      text-white
                    "
                >
                  {JSON.stringify(output.data, null, 2)}
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
