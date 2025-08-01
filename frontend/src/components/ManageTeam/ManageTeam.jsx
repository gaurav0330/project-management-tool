import React, { useMemo, useState, useCallback } from "react";
import { useQuery, gql, useApolloClient } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import TaskModal from "./TaskModal";
import NodeLabel from "./NodeLabel";
import { useResponsive } from "../../hooks/useResponsive";

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

const GET_TASKS_FOR_MEMBER = gql`
  query GetTasksForMember($memberId: ID!, $projectId: ID!) {
    getTasksForMember(memberId: $memberId, projectId: $projectId) {
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
      updatedAt
      remarks
    }
  }
`;

const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      username
      email
      role
    }
  }
`;

// Define nodeTypes and edgeTypes outside component to prevent re-creation
const nodeTypes = {};
const edgeTypes = {};

// Default viewport configurations for different breakpoints
const defaultViewportConfig = {
  mobile: { x: 0, y: 0, zoom: 0.4 },
  sm: { x: 0, y: 0, zoom: 0.5 },
  md: { x: 0, y: 0, zoom: 0.6 },
  lg: { x: 0, y: 0, zoom: 0.7 },
  xl: { x: 0, y: 0, zoom: 0.8 },
  desktop: { x: 0, y: 0, zoom: 0.7 }
};

const ManageTeam = ({ projectId }) => {
  const client = useApolloClient();
  const [expandedManager, setExpandedManager] = useState(false);
  const [expandedLeads, setExpandedLeads] = useState(new Set());
  const [expandedTeams, setExpandedTeams] = useState(new Set());
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedPersonName, setSelectedPersonName] = useState('');
  const [selectedPersonType, setSelectedPersonType] = useState('lead');

  // Use responsive hook for better breakpoint detection
  const { width, height, breakpoint, isMobile, isTablet, isDesktop } = useResponsive();

  // Memoize token decoding
  const managerId = useMemo(() => {
    const token = localStorage.getItem("token");
    try {
      const decodedToken = token ? jwtDecode(token) : null;
      return decodedToken?.id;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }, []);

  const { data: managerData, loading: managerLoading, error: managerError } = useQuery(GET_USER, {
    variables: { userId: managerId },
    skip: !managerId,
  });

  const manager = useMemo(() => 
    managerData?.getUser || { id: managerId, username: "Loading...", email: "", role: "" },
    [managerData, managerId]
  );

  const { loading, error, data } = useQuery(GET_LEADS_BY_PROJECT_ID, {
    variables: { projectId },
  });

  const { data: tasksData } = useQuery(GET_TASKS_BY_MANAGER, {
    variables: { managerId, projectId },
    skip: !managerId || !projectId,
  });

  // Memoize event handlers
  const handleManagerClick = useCallback(() => {
    setExpandedManager(!expandedManager);
    if (!expandedManager) {
      setExpandedLeads(new Set());
      setExpandedTeams(new Set());
    }
  }, [expandedManager]);

  const handleLeadClick = useCallback((leadId) => {
    const newExpandedLeads = new Set(expandedLeads);
    if (newExpandedLeads.has(leadId)) {
      newExpandedLeads.delete(leadId);
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
  }, [expandedLeads, expandedTeams, data]);

  const handleTeamClick = useCallback((teamId) => {
    const newExpandedTeams = new Set(expandedTeams);
    if (newExpandedTeams.has(teamId)) {
      newExpandedTeams.delete(teamId);
    } else {
      newExpandedTeams.add(teamId);
    }
    setExpandedTeams(newExpandedTeams);
  }, [expandedTeams]);

  const handleTaskClick = useCallback(async (personId, personType) => {
    try {
      if (personType === 'lead') {
        if (tasksData?.getTasksByManager) {
          const leadTasks = tasksData.getTasksByManager.filter(task => task.assignedTo === personId);
          const lead = data?.getLeadsByProjectId?.teamLeads?.find(l => l.user.id === personId);
          const leadName = lead?.user.username || 'Unknown Lead';
          setSelectedTasks(leadTasks);
          setSelectedPersonName(leadName);
          setSelectedPersonType('lead');
          setTaskModalOpen(true);
        }
      } else if (personType === 'member') {
        const { data: memberTasksData } = await client.query({
          query: GET_TASKS_FOR_MEMBER,
          variables: { memberId: personId, projectId },
          fetchPolicy: 'network-only',
        });
        if (memberTasksData?.getTasksForMember) {
          let memberName = 'Unknown Member';
          data?.getLeadsByProjectId?.teamLeads?.forEach(lead => {
            lead.teams.forEach(team => {
              const member = team.members.find(m => m.user.id === personId);
              if (member) {
                memberName = member.user.username;
              }
            });
          });
          setSelectedTasks(memberTasksData.getTasksForMember);
          setSelectedPersonName(memberName);
          setSelectedPersonType('member');
          setTaskModalOpen(true);
        } else {
          setSelectedTasks([]);
          setSelectedPersonName('Member');
          setSelectedPersonType('member');
          setTaskModalOpen(true);
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setSelectedTasks([]);
      setSelectedPersonName(personType === 'member' ? 'Member' : 'Lead');
      setSelectedPersonType(personType);
      setTaskModalOpen(true);
    }
  }, [tasksData, data, client, projectId]);

  // Memoize responsive configuration
  const responsiveConfig = useMemo(() => {
    const config = {
      containerHeight: Math.min(height * 0.8, 800),
      minHeight: isMobile ? 400 : 500,
      spacing: isMobile ? 200 : isTablet ? 250 : 300,
      verticalSpacing: isMobile ? 150 : isTablet ? 180 : 200,
      memberSpacing: isMobile ? 180 : isTablet ? 200 : 220,
      defaultViewport: defaultViewportConfig[breakpoint] || defaultViewportConfig.desktop,
      fitViewPadding: isMobile ? 0.1 : isTablet ? 0.12 : 0.15,
    };

    return config;
  }, [width, height, breakpoint, isMobile, isTablet]);

  // Memoize nodes and edges calculation
  const { nodes, edges } = useMemo(() => {
    if (loading || error || !data?.getLeadsByProjectId?.success) {
      return { nodes: [], edges: [] };
    }

    const teamLeads = Array.from(
      new Map(data.getLeadsByProjectId.teamLeads.map((lead) => [lead.user.id, lead])).values()
    );

    const {
      spacing,
      verticalSpacing,
      memberSpacing
    } = responsiveConfig;

    // Calculate total width based on content and screen size
    const minWidth = Math.max(teamLeads.length * spacing * 1.2, width * 0.8);
    const totalWidth = Math.min(minWidth, width * 2); // Cap at 2x screen width

    let nodes = [];
    let edges = [];

    // Project node
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

    // Manager node
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

    // Project to manager edge
    edges.push({
      id: "project-manager",
      source: "project",
      target: manager.id,
      animated: true,
      style: { stroke: "#7c3aed", strokeWidth: isMobile ? 3 : 4 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#7c3aed",
        width: isMobile ? 18 : 22,
        height: isMobile ? 18 : 22,
      },
    });

    if (expandedManager) {
      teamLeads.forEach((lead, leadIndex) => {
        const leadX = (totalWidth / (teamLeads.length + 1)) * (leadIndex + 1) - 100;
        const leadY = verticalSpacing * 2;
        const hasTeams = lead.teams.length > 0;

        // Lead node
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
                personId={lead.user.id}
                hasTaskButton={true}
              />
            ),
          },
          position: { x: leadX, y: leadY },
          style: { border: "none", background: "transparent" },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        });

        // Manager to lead edge
        edges.push({
          id: `manager-${lead.user.id}`,
          source: manager.id,
          target: lead.user.id,
          animated: true,
          style: { stroke: "#3b82f6", strokeWidth: isMobile ? 2.5 : 3 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#3b82f6",
            width: isMobile ? 16 : 18,
            height: isMobile ? 16 : 18,
          },
        });

        if (expandedLeads.has(lead.user.id)) {
          lead.teams.forEach((team, teamIndex) => {
            const teamX = leadX + (teamIndex - (lead.teams.length - 1) / 2) * spacing;
            const teamY = leadY + verticalSpacing;
            const teamNodeId = `team-${team.id}`;
            const hasMembers = team.members.length > 0;

            // Team node
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

            // Lead to team edge
            edges.push({
              id: `lead-${lead.user.id}-team-${team.id}`,
              source: lead.user.id,
              target: teamNodeId,
              animated: true,
              style: { stroke: "#f59e0b", strokeWidth: isMobile ? 2 : 2.5 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#f59e0b",
                width: isMobile ? 14 : 16,
                height: isMobile ? 14 : 16,
              },
            });

            if (expandedTeams.has(team.id)) {
              team.members.forEach((member, memberIndex) => {
                const memberX = teamX + (memberIndex - (team.members.length - 1) / 2) * memberSpacing;
                const memberY = teamY + verticalSpacing;
                const memberNodeId = `member-${member.user.id}-${team.id}`;

                // Member node
                nodes.push({
                  id: memberNodeId,
                  data: {
                    label: (
                      <NodeLabel
                        label={member.user.username}
                        email={member.user.email}
                        role={member.memberRole}
                        type="member"
                        onTaskClick={handleTaskClick}
                        personId={member.user.id}
                        hasTaskButton={true}
                      />
                    ),
                  },
                  position: { x: memberX, y: memberY },
                  style: { border: "none", background: "transparent" },
                  targetPosition: Position.Top,
                });

                // Team to member edge
                edges.push({
                  id: `team-${team.id}-member-${member.user.id}`,
                  source: teamNodeId,
                  target: memberNodeId,
                  animated: true,
                  style: { stroke: "#10b981", strokeWidth: isMobile ? 1.5 : 2 },
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: "#10b981",
                    width: isMobile ? 12 : 14,
                    height: isMobile ? 12 : 14,
                  },
                });
              });
            }
          });
        }
      });
    }

    return { nodes, edges };
  }, [
    data,
    loading,
    error,
    manager,
    expandedManager,
    expandedLeads,
    expandedTeams,
    responsiveConfig,
    handleManagerClick,
    handleLeadClick,
    handleTeamClick,
    handleTaskClick,
    isMobile
  ]);

  // Memoize ReactFlow props to prevent unnecessary re-renders
  const reactFlowProps = useMemo(() => ({
    nodes,
    edges,
    nodeTypes,
    edgeTypes,
    fitView: true,
    fitViewOptions: { padding: responsiveConfig.fitViewPadding },
    nodesDraggable: false,
    nodesConnectable: false,
    zoomOnScroll: true,
    panOnScroll: true,
    minZoom: 0.1,
    maxZoom: 2,
    defaultViewport: responsiveConfig.defaultViewport,
    onNodeClick: (event, node) => {
      event.stopPropagation();
    },
  }), [nodes, edges, responsiveConfig]);

  if (loading) {
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
  }

  if (error) {
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
  }

  if (!data?.getLeadsByProjectId?.success) {
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
  }

  return (
    <>
      <div className="max-w-full mx-auto rounded-3xl bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 shadow-2xl p-3 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6 lg:mb-8 text-center px-2 sm:px-4">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 font-heading">
            Team Structure
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-xl font-body max-w-3xl mx-auto">
            Interactive organizational diagram - Manager → Leads → Teams → Members
          </p>
          <div className="mt-3 sm:mt-4 lg:mt-6 p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl lg:rounded-2xl border border-blue-200 dark:border-blue-800 max-w-3xl mx-auto">
            <p className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm lg:text-base font-medium font-body">
              💡 <strong className="font-heading">Instructions:</strong> Click on the Manager to see Leads, click on Leads to see Teams, click on Teams to see Members. Click the 📋 button on Team Leads and Members to view their tasks.
            </p>
          </div>
        </div>
        
        <div
          className="bg-white dark:bg-slate-800 rounded-xl lg:rounded-2xl shadow-inner border-2 border-gray-200 dark:border-gray-700 mx-2 sm:mx-4 lg:mx-8"
          style={{ 
            height: responsiveConfig.containerHeight, 
            minHeight: responsiveConfig.minHeight 
          }}
        >
          <ReactFlow {...reactFlowProps}>
            <Background
              variant="dots"
              gap={isMobile ? 20 : isTablet ? 22 : 25}
              size={isMobile ? 1.5 : 2}
              color="#94a3b8"
              style={{ opacity: 0.4 }}
            />
            <Controls 
              position="bottom-right"
              showZoom={!isMobile}
              showFitView={!isMobile}
              showInteractive={!isMobile}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #e2e8f0',
                borderRadius: isMobile ? '8px' : '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
          </ReactFlow>
        </div>
      </div>
      
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        tasks={selectedTasks}
        personName={selectedPersonName}
        personType={selectedPersonType}
      />
    </>
  );
};

export default ManageTeam;
