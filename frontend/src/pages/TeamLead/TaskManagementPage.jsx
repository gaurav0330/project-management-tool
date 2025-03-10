import React, { useState, useEffect } from "react";
import { useQuery, gql,useMutation } from "@apollo/client";
import {jwtDecode} from "jwt-decode";
import TaskTable from "../../components/TeamLeadComponent/TaskTable";
import SearchBar from "../../components/TeamLeadComponent/SearchBar";
import AddTaskButton from "../../components/TeamLeadComponent/AddtaskButton";
 
const GET_TASKS_BY_TEAM_LEAD = gql`
  query GetTasksByTeamLead($teamLeadId: ID!, $projectId: ID!) {
    getTasksByTeamLead(teamLeadId: $teamLeadId, projectId: $projectId) {
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
      attachments
      updatedAt
      assignName
      remarks
    }
  }
`;


// GraphQL Mutation
const DELETE_TASK = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId)
  }
`;

// Use the DELETE_TASK mutation


// Function to handle task deletion


const TaskManagementPage = ({ projectId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teamLeadId, setTeamLeadId] = useState(null);
 const [deleteTask] = useMutation(DELETE_TASK);

 const onHandleDeleteTask = async (taskId) => {
  try {
    const { data } = await deleteTask({ variables: { taskId } });

    if (data.deleteTask) {
      alert("Task deleted successfully!");
      refetch();
    } else {
      alert("Failed to delete task.");
    }
  } catch (error) {
    console.error("❌ Error deleting task:", error);
  }
};


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setTeamLeadId(decoded.id);
    }
  }, []);

  const { loading, error, data,refetch } = useQuery(GET_TASKS_BY_TEAM_LEAD, {
    variables: { teamLeadId, projectId },
    skip: !teamLeadId,
  });


  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (data && data.getTasksByTeamLead) {
      setTasks(
        data.getTasksByTeamLead.map((task) => ({
          id: task.id,
          name: task.title,
          assignName:task.assignName,
          assignedTo: {
            name: "Unassigned", // You may replace this with actual user data
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          },
          status: task.status,
          dueDate: task.dueDate,
        }))
      );
    }
  }, [data]);



  const handleEditTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, name: `${task.name} (Edited)` } : task
    );
    setTasks(updatedTasks);
  };


  const handleCommentTask = (taskId) => {
    alert(`Comment on Task ID: ${taskId}`);
  };

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error fetching tasks!</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Task Management</h2>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <TaskTable tasks={filteredTasks} onEdit={handleEditTask} onComment={handleCommentTask}  handleDeleteTask={onHandleDeleteTask} />
    </div>
  );
};

export default TaskManagementPage;