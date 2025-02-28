import React, { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { CREATE_PROJECT_MUTATION } from "../../graphql/maneger/createProject";
import AssignTeamLead from "../../components/tasks/AssignTeamLead";

function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAssignLead, setShowAssignLead] = useState(false);
  const navigate = useNavigate();

  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT_MUTATION);

  const handleCreateProject = async () => {
    try {
      const { data } = await createProject({
        variables: {
          title: projectName,
          startDate,
          endDate,
          description: projectDescription,
        },
      });

      if (data) {
        alert("Project created successfully!");
        setShowAssignLead(true);
      }
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {!showAssignLead ? (
        <div className="max-w-6xl p-8 mx-auto bg-white shadow-sm rounded-xl">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">Create New Project</h2>
          <div className="space-y-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Project Description</label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe your project"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
                <div className="relative">
                  <Calendar className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Project Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="marketing">Marketing</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
              </select>
            </div>

            {error && <p className="text-red-500">Error: {error.message}</p>}

            <button
              className="w-full px-4 py-2 mt-6 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleCreateProject}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>
      ) : (
        <AssignTeamLead />
      )}
    </div>
  );
}

export default CreateProject;
