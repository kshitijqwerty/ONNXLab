"use client";

import { Handle, Position } from "reactflow";
import type { OperatorNodeData } from "@/lib/onnx/graph";
import type { NodeIO } from "@/lib/onnx/types";

interface Props {
  data: OperatorNodeData;
}

const OP_COLORS: Record<string, string> = {
  conv: "bg-blue-500",
  relu: "bg-green-500",
  matmul: "bg-purple-500",
  attention: "bg-orange-500",
  softmax: "bg-pink-500",
  reshape: "bg-teal-500",
  add: "bg-yellow-500",
  mul: "bg-amber-500",
  maxpool: "bg-rose-500",
  averagepool: "bg-rose-400",
  concat: "bg-indigo-500",
  gemm: "bg-violet-500",
  batchnormalization: "bg-cyan-500",
  layernormalization: "bg-cyan-400",
  sigmoid: "bg-emerald-500",
  tanh: "bg-emerald-400",
  transpose: "bg-sky-500",
  gather: "bg-fuchsia-500",
  pad: "bg-lime-500",
  clip: "bg-stone-500",
  flatten: "bg-slate-500",
  unsqueeze: "bg-slate-400",
  squeeze: "bg-slate-400",
};

function getNodeColor(opType: string) {
  return OP_COLORS[opType.toLowerCase()] ?? "bg-gray-700";
}

function ShapeBadge({ shape }: { shape: (number | string)[] | null | undefined }) {
  if (!shape || shape.length === 0) return null;
  return (
    <span className="font-mono text-[10px] text-cyan-300">
      [{shape.join(", ")}]
    </span>
  );
}

export default function OperatorNode({ data }: Props) {
  const color = getNodeColor(data.opType);

  return (
    <div
      className="
      min-w-[140px]
      rounded-xl
      border
      border-white/10
      bg-[#111827]
      shadow-xl
      transition
      duration-150
      hover:scale-[1.03]
      hover:border-white/20
      hover:shadow-2xl
      hover:shadow-black/40
    "
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-2 !border-[#111827] !bg-cyan-400"
      />

      {/* Header */}
      <div className="flex items-center gap-2.5 p-3 pb-1">
        <div className={`h-3 w-3 shrink-0 rounded-full ${color}`} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {data.opType}
          </div>
        </div>
      </div>

      {/* Shapes */}
      {data.outputs && data.outputs.length > 0 && (
        <div className="mt-1 space-y-0.5 px-3">
          {data.outputs.slice(0, 2).map((output: NodeIO, index: number) => (
            <div
              key={index}
              className="truncate rounded bg-black/30 px-2 py-0.5"
            >
              <ShapeBadge shape={output.tensor?.shape} />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-2 border-t border-white/5 px-3 py-1.5">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>IN {data.inputs?.length ?? 0}</span>
          <span className="text-gray-600">|</span>
          <span>OUT {data.outputs?.length ?? 0}</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-2 !border-[#111827] !bg-pink-400"
      />
    </div>
  );
}
