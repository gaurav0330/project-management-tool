import React, { useMemo, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
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
        teams {
          id
          projectId
          leadId
          teamName
          description
          createdAt
          members {
            teamMemberId
            memberRole
            user {
              id
              username
              email
              role
            }
          }
        }
      }
    }
  }
`;

const GET_TASKS_BY_MANAGER = gql`
  query GetTasksByManager($managerId: ID!, $projectId: ID!) {
    getTasksByManager(managerId: $managerId, projectId: $projectId) {
      id
      title
      description
      project
      createdBy
      assignedTo
      status
      priority
      dueDate
      createdAt
      attachments {
        name
        size
        type
      }
      updatedAt
      remarks
      assignName
    }
  }
`;

// Task Modal Component
const TaskModal = ({ isOpen, onClose, tasks, leadName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-heading">
              Tasks for {leadName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No tasks assigned to this lead yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 font-heading">
                      {task.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'Completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : task.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-3 font-body">
                    {task.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500 dark:text-gray-400">Priority:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${
                          task.priority === 'High'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                            : task.priority === 'Medium'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200'
                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500 dark:text-gray-400">Due Date:</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </span>
                    </div>
                  </div>
                  
                  {task.assignName && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-gray-500 dark:text-gray-400">Assigned to:</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{task.assignName}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NodeLabel = ({ 
  label, 
  email, 
  role, 
  type, 
  isExpandable = false, 
  isExpanded = false, 
  onClick,
  onTaskClick,
  leadId,
  hasTaskButton = false
}) => {
  const getNodeStyle = () => {
    switch (type) {
      case "manager":
        return {
          bg: "bg-gradient-to-br from-indigo-600 to-blue-700 dark:from-indigo-500 dark:to-blue-600",
          icon: "👨‍💼",
          border: "border-indigo-300 dark:border-indigo-700",
          shadow: "shadow-indigo-200 dark:shadow-indigo-900",
        };
      case "project":
        return {
          bg: "bg-gradient-to-br from-purple-600 to-violet-700 dark:from-purple-500 dark:to-violet-600",
          icon: "📋",
          border: "border-purple-300 dark:border-purple-700",
          shadow: "shadow-purple-200 dark:shadow-purple-900",
        };
      case "team":
        return {
          bg: "bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500",
          icon: "🏗️",
          border: "border-amber-300 dark:border-amber-700",
          shadow: "shadow-amber-200 dark:shadow-amber-900",
        };
      case "member":
        return {
          bg: "bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500",
          icon: "👤",
          border: "border-emerald-300 dark:border-emerald-700",
          shadow: "shadow-emerald-200 dark:shadow-emerald-900",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-green-500 to-green-700 dark:from-green-400 dark:to-green-600",
          icon: "👥",
          border: "border-green-300 dark:border-green-700",
          shadow: "shadow-green-200 dark:shadow-green-900",
        };
    }
  };

  const { bg, icon, border, shadow } = getNodeStyle();

  const handleTaskClick = (e) => {
    e.stopPropagation();
    if (onTaskClick && leadId) {
      onTaskClick(leadId);
    }
  };

  return (
    <div
      className={`${bg} ${border} ${shadow} text-white p-4 rounded-2xl shadow-xl border-2 w-52 min-w-[200px] font-sans transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
        isExpandable ? 'cursor-pointer hover:ring-2 hover:ring-white/30' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{icon}</span>
        <div className="font-bold text-base truncate font-heading">{label}</div>
        <div className="ml-auto flex gap-1">
          {hasTaskButton && (
            <button
              onClick={handleTaskClick}
              className="text-sm font-bold bg-white/30 hover:bg-white/40 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
              title="View Tasks"
            >
              📋
            </button>
          )}
          {isExpandable && (
            <span className="text-lg font-bold bg-white/20 rounded-full w-6 h-6 flex items-center justify-center">
              {isExpanded ? "−" : "+"}
            </span>
          )}
        </div>
      </div>
      {role && (
        <div className="text-sm font-medium opacity-95 bg-white/25 rounded-lg px-3 py-1 mb-2 font-body">
          {role.replaceAll("_", " ")}
        </div>
      )}
      {email && (
        <div className="text-xs opacity-85 break-all bg-black/25 rounded-lg px-2 py-1 font-body">
          {email}
        </div>
      )}
    </div>
  );
};

const ManageTeam = ({ projectId }) => {
  // State for controlling what's expanded
  const [expandedManager, setExpandedManager] = useState(false);
  const [expandedLeads, setExpandedLeads] = useState(new Set());
  const [expandedTeams, setExpandedTeams] = useState(new Set());
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedLeadTasks, setSelectedLeadTasks] = useState([]);
  const [selectedLeadName, setSelectedLeadName] = useState('');

  // Get manager ID from JWT token
  const token = localStorage.getItem("token");
  let managerId = null;

  try {
    const decodedToken = token ? jwtDecode(token) : null;
    managerId = decodedToken?.id;
  } catch (error) {
    console.error("Invalid token:", error);
  }

  // Constant manager data
  const manager = {
    id: "project-manager",
    username: "John Doe",
    email: "john.doe@company.com",
    role: "Project_Manager",
  };

  const { loading, error, data } = useQuery(GET_LEADS_BY_PROJECT_ID, {
    variables: { projectId },
  });

  const { data: tasksData, refetch: refetchTasks } = useQuery(GET_TASKS_BY_MANAGER, {
    variables: { managerId, projectId },
    skip: !managerId || !projectId,
  });

  // Handle clicks
  const handleManagerClick = () => {
    setExpandedManager(!expandedManager);
    if (!expandedManager) {
      setExpandedLeads(new Set());
      setExpandedTeams(new Set());
    }
  };

  const handleLeadClick = (leadId) => {
    const newExpandedLeads = new Set(expandedLeads);
    if (newExpandedLeads.has(leadId)) {
      newExpandedLeads.delete(leadId);
      // Also close all teams under this lead
      const newExpandedTeams = new Set(expandedTeams);
      data?.getLeadsByProjectId?.teamLeads?.forEach(lead => {
        if (lead.user.id === leadId) {
          lead.teams.forEach(team => {
            newExpandedTeams.delete(team.id);
          });
        }
      });
      setExpandedTeams(newExpandedTeams);
    } else {
      newExpandedLeads.add(leadId);
    }
    setExpandedLeads(newExpandedLeads);
  };

  const handleTeamClick = (teamId) => {
    const newExpandedTeams = new Set(expandedTeams);
    if (newExpandedTeams.has(teamId)) {
      newExpandedTeams.delete(teamId);
    } else {
      newExpandedTeams.add(teamId);
    }
    setExpandedTeams(newExpandedTeams);
  };

  const handleTaskClick = (leadId) => {
    if (tasksData?.getTasksByManager) {
      // Filter tasks assigned to this specific lead
      const leadTasks = tasksData.getTasksByManager.filter(task => task.assignedTo === leadId);
      
      // Find lead name
      const lead = data?.getLeadsByProjectId?.teamLeads?.find(l => l.user.id === leadId);
      const leadName = lead?.user.username || 'Unknown Lead';
      
      setSelectedLeadTasks(leadTasks);
      setSelectedLeadName(leadName);
      setTaskModalOpen(true);
    }
  };

  const { nodes, edges } = useMemo(() => {
    if (loading || error || !data?.getLeadsByProjectId?.success)
      return { nodes: [], edges: [] };

    const teamLeads = Array.from(
      new Map(data.getLeadsByProjectId.teamLeads.map((lead) => [lead.user.id, lead])).values()
    );

    // Improved spacing calculations
    const spacing = 300; // Increased spacing between nodes
    const verticalSpacing = 200; // Increased vertical spacing
    const memberSpacing = 220; // Specific spacing for members
    const totalWidth = Math.max(teamLeads.length * spacing * 1.5, 1200);

    let nodes = [];
    let edges = [];

    // Project node (always visible)
    nodes.push({
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
      style: { border: "none", background: "transparent" },
      sourcePosition: Position.Bottom,
    });

    // Manager node (always visible, clickable)
    nodes.push({
      id: manager.id,
      data: {
        label: (
          <NodeLabel
            label={manager.username}
            email={manager.email}
            role={manager.role}
            type="manager"
            isExpandable={true}
            isExpanded={expandedManager}
            onClick={handleManagerClick}
          />
        ),
      },
      position: { x: totalWidth / 2 - 100, y: verticalSpacing },
      style: { border: "none", background: "transparent" },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    });

    // Edge from project to manager (always visible)
    edges.push({
      id: "project-manager",
      source: "project",
      target: manager.id,
      animated: true,
      style: { stroke: "#7c3aed", strokeWidth: 4 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#7c3aed",
        width: 22,
        height: 22,
      },
    });

    // Only show leads if manager is expanded
    if (expandedManager) {
      teamLeads.forEach((lead, leadIndex) => {
        const leadX = (totalWidth / (teamLeads.length + 1)) * (leadIndex + 1) - 100;
        const leadY = verticalSpacing * 2;

        // Lead node
        const hasTeams = lead.teams.length > 0;
        nodes.push({
          id: lead.user.id,
          data: {
            label: (
              <NodeLabel
                label={lead.user.username}
                email={lead.user.email}
                role={lead.leadRole}
                type="lead"
                isExpandable={hasTeams}
                isExpanded={expandedLeads.has(lead.user.id)}
                onClick={() => hasTeams && handleLeadClick(lead.user.id)}
                onTaskClick={handleTaskClick}
                leadId={lead.user.id}
                hasTaskButton={true}
              />
            ),
          },
          position: { x: leadX, y: leadY },
          style: { border: "none", background: "transparent" },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        });

        // Edge from manager to lead
        edges.push({
          id: `manager-${lead.user.id}`,
          source: manager.id,
          target: lead.user.id,
          animated: true,
          style: { stroke: "#3b82f6", strokeWidth: 3 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#3b82f6",
            width: 18,
            height: 18,
          },
        });

        // Only show teams if this lead is expanded
        if (expandedLeads.has(lead.user.id)) {
          lead.teams.forEach((team, teamIndex) => {
            const teamX = leadX + (teamIndex - (lead.teams.length - 1) / 2) * spacing;
            const teamY = leadY + verticalSpacing;

            // Team node
            const teamNodeId = `team-${team.id}`;
            const hasMembers = team.members.length > 0;
            nodes.push({
              id: teamNodeId,
              data: {
                label: (
                  <NodeLabel
                    label={team.teamName}
                    role={`${team.description}`}
                    type="team"
                    isExpandable={hasMembers}
                    isExpanded={expandedTeams.has(team.id)}
                    onClick={() => hasMembers && handleTeamClick(team.id)}
                  />
                ),
              },
              position: { x: teamX, y: teamY },
              style: { border: "none", background: "transparent" },
              sourcePosition: Position.Bottom,
              targetPosition: Position.Top,
            });

            // Edge from lead to team
            edges.push({
              id: `lead-${lead.user.id}-team-${team.id}`,
              source: lead.user.id,
              target: teamNodeId,
              animated: true,
              style: { stroke: "#f59e0b", strokeWidth: 2.5 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#f59e0b",
                width: 16,
                height: 16,
              },
            });

            // Only show members if this team is expanded
            if (expandedTeams.has(team.id)) {
              team.members.forEach((member, memberIndex) => {
                // Improved member positioning with proper spacing
                const memberX = teamX + (memberIndex - (team.members.length - 1) / 2) * memberSpacing;
                const memberY = teamY + verticalSpacing; // Increased distance for members

                // Member node
                const memberNodeId = `member-${member.user.id}-${team.id}`;
                nodes.push({
                  id: memberNodeId,
                  data: {
                    label: (
                      <NodeLabel
                        label={member.user.username}
                        email={member.user.email}
                        role={member.memberRole}
                        type="member"
                      />
                    ),
                  },
                  position: { x: memberX, y: memberY },
                  style: { border: "none", background: "transparent" },
                  targetPosition: Position.Top,
                });

                // Edge from team to member
                edges.push({
                  id: `team-${team.id}-member-${member.user.id}`,
                  source: teamNodeId,
                  target: memberNodeId,
                  animated: true,
                  style: { stroke: "#10b981", strokeWidth: 2 },
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: "#10b981",
                    width: 14,
                    height: 14,
                  },
                });
              });
            }
          });
        }
      });
    }

    return { nodes, edges };
  }, [data, loading, error, manager, expandedManager, expandedLeads, expandedTeams]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium font-body">
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
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold font-heading">
            Error loading team data
          </p>
          <p className="text-red-500 dark:text-red-300 text-sm mt-1 font-body">{error.message}</p>
        </div>
      </div>
    );

  if (!data?.getLeadsByProjectId?.success)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="text-yellow-600 dark:text-yellow-400 text-4xl mb-2">⚠️</div>
          <p className="text-yellow-600 dark:text-yellow-400 text-lg font-semibold font-heading">
            {data.getLeadsByProjectId.message}
          </p>
        </div>
      </div>
    );

  return (
    <>
      <div className="h-[900px] w-full max-w-full mx-auto rounded-3xl bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 shadow-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3 font-heading">
            Team Structure
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xl font-body">
            Interactive organizational diagram - Manager → Leads → Teams → Members
          </p>
          
          {/* Enhanced Instructions */}
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200 text-base font-medium font-body">
              💡 <strong className="font-heading">Instructions:</strong> Click on the Manager to see Leads, click on Leads to see Teams, click on Teams to see Members. Click the 📋 button on Team Leads to view their tasks.
            </p>
          </div>
        </div>
        
        <div className="h-[700px] bg-white dark:bg-slate-800 rounded-2xl shadow-inner border-2 border-gray-200 dark:border-gray-700">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            nodesDraggable={false}
            nodesConnectable={false}
            zoomOnScroll={true}
            panOnScroll={true}
            minZoom={0.2}
            maxZoom={1.5}
            defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
            onNodeClick={(event, node) => {
              event.stopPropagation();
            }}
          >
            <Background
              variant="dots"
              gap={25}
              size={2}
              color="#94a3b8"
              style={{ opacity: 0.4 }}
            />
            <Controls 
              position="bottom-right"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
          </ReactFlow>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        tasks={selectedLeadTasks}
        leadName={selectedLeadName}
      />
    </>
  );
};

export default ManageTeam;
