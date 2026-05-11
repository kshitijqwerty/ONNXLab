'use client'

import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge
} from 'reactflow'


import 'reactflow/dist/style.css'

interface Props {
    nodes: Node[]
    edges: Edge[]
}

export default function ModelGraph({
    nodes,
    edges
}: Props) {
    return (
        <div className='h-[700px] w-full rounded-2xl border bg-white'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
            >
                <Background/>
                <Controls/>
                <MiniMap/>
            </ReactFlow>
        </div>
    )
}