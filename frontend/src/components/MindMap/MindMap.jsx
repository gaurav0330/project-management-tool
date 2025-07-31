import React from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { 
      label: (
        <div className="text-center p-2">
          <div className="font-bold text-sm">🚀 Test Project</div>
          <div className="text-xs opacity-90">(Manager)</div>
        </div>
      )
    },
    position: { x: 300, y: 50 },
    className: 'bg-red-500 text-white border-2 border-red-600 rounded-lg shadow-lg',
    style: { width: 180, height: 80 },
  },
  {
    id: '2',
    data: { 
      label: (
        <div className="text-center p-2">
          <div className="font-bold text-sm">📦 Frontend Module</div>
          <div className="text-xs opacity-90">(Lead A)</div>
        </div>
      )
    },
    position: { x: 100, y: 200 },
    className: 'bg-teal-500 text-white border-2 border-teal-600 rounded-lg shadow-lg',
    style: { width: 180, height: 80 },
  },
  {
    id: '3',
    data: { 
      label: (
        <div className="text-center p-2">
          <div className="font-bold text-sm">🧠 Backend Module</div>
          <div className="text-xs opacity-90">(Lead B)</div>
        </div>
      )
    },
    position: { x: 500, y: 200 },
    className: 'bg-teal-500 text-white border-2 border-teal-600 rounded-lg shadow-lg',
    style: { width: 180, height: 80 },
  },
  {
    id: '4',
    data: { 
      label: (
        <div className="text-center p-2">
          <div className="font-bold text-xs">🖥️ Login Page</div>
          <div className="text-xs opacity-90">(Member A)</div>
        </div>
      )
    },
    position: { x: 20, y: 380 },
    className: 'bg-blue-500 text-white border-2 border-blue-600 rounded-lg shadow-md',
    style: { width: 140, height: 70 },
  },
  {
    id: '5',
    data: { 
      label: (
        <div className="text-center p-2">
          <div className="font-bold text-xs">📱 Dashboard</div>
          <div className="text-xs opacity-90">(Member A)</div>
        </div>
      )
    },
    position: { x: 180, y: 380 },
    className: 'bg-blue-500 text-white border-2 border-blue-600 rounded-lg shadow-md',
    style: { width: 140, height: 70 },
  },
  {
    id: '6',
    data: { 
      label: (
        <div className="text-center p-2">
          <div className="font-bold text-xs">📊 API Gateway</div>
          <div className="text-xs opacity-90">(Member B)</div>
        </div>
      )
    },
    position: { x: 420, y: 380 },
    className: 'bg-blue-500 text-white border-2 border-blue-600 rounded-lg shadow-md',
    style: { width: 140, height: 70 },
  },
  {
    id: '7',
    data: { 
      label: (
        <div className="text-center p-2">
          <div className="font-bold text-xs">🔐 Auth Service</div>
          <div className="text-xs opacity-90">(Member B)</div>
        </div>
      )
    },
    position: { x: 580, y: 380 },
    className: 'bg-blue-500 text-white border-2 border-blue-600 rounded-lg shadow-md',
    style: { width: 140, height: 70 },
  },
];

const initialEdges = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    animated: true,
    style: { stroke: '#ef4444', strokeWidth: 2 }
  },
  { 
    id: 'e1-3', 
    source: '1', 
    target: '3', 
    animated: true,
    style: { stroke: '#ef4444', strokeWidth: 2 }
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4',
    style: { stroke: '#14b8a6', strokeWidth: 2 }
  },
  { 
    id: 'e2-5', 
    source: '2', 
    target: '5',
    style: { stroke: '#14b8a6', strokeWidth: 2 }
  },
  { 
    id: 'e3-6', 
    source: '3', 
    target: '6',
    style: { stroke: '#14b8a6', strokeWidth: 2 }
  },
  { 
    id: 'e3-7', 
    source: '3', 
    target: '7',
    style: { stroke: '#14b8a6', strokeWidth: 2 }
  },
];

const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = (event, node) => {
    console.log('Node clicked:', node);
    // Add functionality here like editing node, showing details, etc.
  };

  const addNewNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      data: { 
        label: (
          <div className="text-center p-2">
            <div className="font-bold text-xs">➕ New Task</div>
            <div className="text-xs opacity-90">(Click to edit)</div>
          </div>
        )
      },
      position: { x: Math.random() * 400, y: Math.random() * 200 + 300 },
      className: 'bg-gray-500 text-white border-2 border-gray-600 rounded-lg shadow-md',
      style: { width: 140, height: 70 },
    };
    
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Panel position="top-left">
          <div className="bg-white p-4 rounded-lg shadow-lg mb-3 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              🧭 Project Mind Map
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span>Manager</span>
                <span className="w-3 h-3 bg-teal-500 rounded-full ml-2"></span>
                <span>Lead</span>
                <span className="w-3 h-3 bg-blue-500 rounded-full ml-2"></span>
                <span>Member</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Drag nodes to reorganize
              </div>
            </div>
            <button 
              onClick={addNewNode}
              className="mt-3 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              ➕ Add Node
            </button>
          </div>
        </Panel>

        <Panel position="top-right">
          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors">
                💾 Save Layout
              </button>
              <button className="w-full px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition-colors">
                📤 Export PNG
              </button>
              <button className="w-full px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors">
                🔄 Auto Layout
              </button>
            </div>
          </div>
        </Panel>
        
        <MiniMap 
          nodeColor={(node) => {
            if (node.className?.includes('bg-red-500')) return '#ef4444';
            if (node.className?.includes('bg-teal-500')) return '#14b8a6';
            if (node.className?.includes('bg-blue-500')) return '#3b82f6';
            return '#6b7280';
          }}
          className="bg-white border border-gray-300 rounded-lg"
        />
        
        <Controls className="bg-white border border-gray-300 rounded-lg" />
        
        <Background 
          variant="dots" 
          gap={20} 
          size={1} 
          className="bg-gray-50"
        />
      </ReactFlow>
    </div>
  );
};

export default MindMap;
