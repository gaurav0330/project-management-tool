import React, { useMemo } from "react";
import { useQuery, gql } from "@apollo/client";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

const GET_LEADS_BY_PROJECT_ID = gql`
  query GetLeadsByProjectId($projectId: ID!) {
    getLeadsByProjectId(projectId: $projectId) {
      success
      message
      teamLeads {
        teamLeadId
        leadRole
        user {
          id
          username
          email
          role
        }
      }
    }
  }
`;


const NodeLabel = ({ label, email, role, type }) => {
  const getNodeStyle = () => {
    switch (type) {
      case "manager":
        return {
          bg: "bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600",
          icon: "👨‍💼",
          border: "border-blue-200 dark:border-blue-800",
        };
      case "project":
        return {
          bg: "bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-600",
          icon: "📋",
          border: "border-purple-200 dark:border-purple-800",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-green-500 to-green-700 dark:from-green-400 dark:to-green-600",
          icon: "👥",
          border: "border-green-200 dark:border-green-800",
        };
    }
  };

  const { bg, icon, border } = getNodeStyle();

  return (
    <div
      className={`${bg} ${border} text-white p-4 rounded-xl shadow-lg border-2 w-52 min-w-[200px] font-sans transition-all duration-200 hover:shadow-xl hover:scale-105`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <div className="font-bold text-lg truncate">{label}</div>
      </div>
      {role && (
        <div className="text-sm opacity-90 bg-white/20 rounded-md px-2 py-1 mb-1">
          {role.replaceAll("_", " ")}
        </div>
      )}
      {email && (
        <div className="text-xs opacity-80 break-all bg-black/20 rounded-md px-2 py-1">
          {email}
        </div>
      )}
    </div>
  );
};

const ManageTeam = ({ projectId }) => {
  const manager = {
    id: "project-manager",
    username: "John Doe",
    email: "john.doe@company.com",
    role: "Project_Manager",
  };

  const { loading, error, data } = useQuery(GET_LEADS_BY_PROJECT_ID, {
    variables: { projectId },
  });

  const { nodes, edges } = useMemo(() => {
    if (loading || error || !data?.getLeadsByProjectId?.success)
      return { nodes: [], edges: [] };

    const teamLeads = Array.from(
      new Map(data.getLeadsByProjectId.teamLeads.map((lead) => [lead.user.id, lead])).values()
    );

    // Better positioning logic
    const leadCount = teamLeads.length;
    const spacing = 280; // Increased spacing between nodes
    const totalWidth = Math.max(leadCount * spacing, 800);
    const startX = leadCount > 0 ? (totalWidth - (leadCount - 1) * spacing) / 2 : totalWidth / 2;

    const nodes = [
      {
        id: "project",
        data: {
          label: (
            <NodeLabel
              label="Project Dashboard"
              role="Main Project"
              type="project"
            />
          ),
        },
        position: { x: totalWidth / 2 - 100, y: 0 },
        style: { 
          border: "none",
          background: "transparent",
        },
        sourcePosition: Position.Bottom,
      },
      {
        id: manager.id,
        data: {
          label: (
            <NodeLabel
              label={manager.username}
              email={manager.email}
              role={manager.role}
              type="manager"
            />
          ),
        },
        position: { x: totalWidth / 2 - 100, y: 180 },
        style: { 
          border: "none",
          background: "transparent",
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      ...teamLeads.map((lead, index) => ({
        id: lead.user.id,
        data: {
          label: (
            <NodeLabel
              label={lead.user.username}
              email={lead.user.email}
              role={lead.leadRole}
              type="lead"
            />
          ),
        },
        position: { x: startX + index * spacing - 100, y: 380 },
        style: { 
          border: "none",
          background: "transparent",
        },
        targetPosition: Position.Top,
      })),
    ];

    const edges = [
      {
        id: "project-manager",
        source: "project",
        target: manager.id,
        animated: true,
        style: { 
          stroke: "#8b5cf6", 
          strokeWidth: 3,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#8b5cf6",
          width: 20,
          height: 20,
        },
      },
      ...teamLeads.map((lead) => ({
        id: `manager-${lead.user.id}`,
        source: manager.id,
        target: lead.user.id,
        animated: true,
        style: { 
          stroke: "#10b981", 
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#10b981",
          width: 16,
          height: 16,
        },
      })),
    ];

    return { nodes, edges };
  }, [data, loading, error, manager]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Loading team structure...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="text-red-600 dark:text-red-400 text-4xl mb-2">⚠️</div>
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold">
            Error loading team data
          </p>
          <p className="text-red-500 dark:text-red-300 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );

  if (!data?.getLeadsByProjectId?.success)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="text-yellow-600 dark:text-yellow-400 text-4xl mb-2">⚠️</div>
          <p className="text-yellow-600 dark:text-yellow-400 text-lg font-semibold">
            {data.getLeadsByProjectId.message}
          </p>
        </div>
      </div>
    );

  if (nodes.length <= 2) // Only project and manager nodes
    return (
      <div className="h-[600px] w-full max-w-6xl mx-auto rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl p-8">
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          Team Structure
        </h2>
        <div className="flex items-center justify-center h-96">
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-600 dark:text-gray-400 text-xl font-medium mb-2">
              No team leads assigned yet
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Add team leads to see the organizational structure
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="h-[700px] w-full max-w-7xl mx-auto rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl p-8">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Team Structure
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Interactive organizational diagram
        </p>
      </div>
      
      <div className="h-[550px] bg-white dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll={true}
          panOnScroll={true}
          minZoom={0.5}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Background
            variant="dots"
            gap={20}
            size={1}
            color="#94a3b8"
            style={{ opacity: 0.3 }}
          />
          <Controls 
            position="bottom-right"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ManageTeam;
