 'use client'
  
  import { useState } from 'react'
  import { parseOnnxModel } from '@/lib/onnx/parser'
  import { buildGraph } from '@/lib/onnx/graph'
  import ModelGraph from '@/components/graph/ModelGraph'
  import { parseGraph } from '@/lib/onnx/graphParser'
  
  export default function OnnxUploader() {
    const [fileName, setFileName] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [modelInfo, setModelInfo] = useState<any>(null)
    const [graph, setGraph] = useState<any>(null)
  
    async function handleFile(file: File) {
      setError('')
  
      if (!file.name.endsWith('.onnx')) {
        setError('Please upload a valid ONNX file')
        return
      }
  
      try {
        setLoading(true)
  
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
  
        console.log('ONNX File Loaded')
        console.log('Filename:', file.name)
        console.log('Size:', file.size)
        console.log('ArrayBuffer:', arrayBuffer)
  
        setFileName(file.name)
        
        // Parse ONNX model
        const parsed = await parseOnnxModel(arrayBuffer)
        console.log('Parsed Model:', parsed)
        setModelInfo(parsed)

        const realGraph = await parseGraph(arrayBuffer)
        const generatedGraph = buildGraph(realGraph)

        setGraph(generatedGraph)
        // const graphData = await parseGraph(arrayBuffer)
        // console.log(graphData)

      } catch (err) {
        console.error(err)
        setError('Failed to read ONNX file')
      } finally {
        setLoading(false)
      }
    }
  
    function onDrop(e: React.DragEvent<HTMLDivElement>) {
      e.preventDefault()
  
      const file = e.dataTransfer.files[0]
  
      if (file) {
        handleFile(file)
      }
    }
  
    function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]
  
      if (file) {
        handleFile(file)
      }
    }
  
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full max-w-xl rounded-2xl border-2 border-dashed border-gray-400 p-12 text-center transition hover:border-blue-500"
        >
          <h2 className="mb-4 text-2xl font-bold">
            Upload ONNX Model
          </h2>
  
          <p className="mb-6 text-gray-500">
            Drag & drop your .onnx file here
          </p>
  
          <input
            type="file"
            accept=".onnx"
            onChange={onSelect}
            className="hidden"
            id="onnx-upload"
          />
  
          <label
            htmlFor="onnx-upload"
            className="cursor-pointer rounded-xl bg-black px-6 py-3 text-white"
          >
            Select File
          </label>
  
          {loading && (
            <p className="mt-4 text-blue-500">
              Loading model...
            </p>
          )}
          {fileName && (
            <p className="mt-4 text-green-600">
              Loaded: {fileName}
            </p>
          )}
          {modelInfo && (
            <div className="mt-6 w-full rounded-xl border border-gray-300 bg-white p-4 text-left text-black shadow-sm">
              <h3 className="mb-4 text-lg font-bold">
                Model Information
              </h3>

              <div className="mb-4">
                <h4 className="font-semibold">Inputs</h4>

                {modelInfo.inputs.map((input: any) => (
                  <div
                    key={input.name}
                    className="mt-2 rounded-lg bg-gray-100 p-3 text-black"
                  >
                    <p>
                      <strong>Name:</strong> {input.name}
                    </p>

                    <p>
                      <strong>Type:</strong> {input.type}
                    </p>

                    <p>
                      <strong>Shape:</strong>{' '}
                      [{input.dimensions.join(', ')}]
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold">Outputs</h4>

                {modelInfo.outputs.map((output: any) => (
                  <div
                    key={output.name}
                    className="mt-2 rounded-lg bg-gray-100 p-3 text-black"
                  >
                    <p>
                      <strong>Name:</strong> {output.name}
                    </p>

                    <p>
                      <strong>Type:</strong> {output.type}
                    </p>

                    <p>
                      <strong>Shape:</strong>{' '}
                      [{output.dimensions.join(', ')}]
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {graph && (
            <div className='mt-8 w-full'>
              <ModelGraph
                nodes={graph.nodes}
                edges={graph.edges}
              />
            </div>
          )}
          {error && (
            <p className="mt-4 text-red-500">
              {error}
            </p>
          )}
        </div>
      </div>
    )
  }