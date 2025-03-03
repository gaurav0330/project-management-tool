import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { Loader2 } from "lucide-react"; // ✅ Ensure `lucide-react` is installed

// ✅ GraphQL Mutation for Creating a Team
const CREATE_TEAM = gql`
  mutation CreateTeam($projectId: ID!, $teamName: String!, $description: String!) {
    createTeam(projectId: $projectId, teamName: $teamName, description: $description) {
      success
      message
      team {
        id
        teamName
        description
      }
    }
  }
`;

const CreateTeam = ({ projectId }) => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🛠️ Debug: Check if projectId is received from props
  useEffect(() => {
    console.log("🔍 Debug: Received projectId:", projectId);
    if (!projectId) {
      console.error("❌ Error: projectId is undefined or null!");
    }
  }, [projectId]);

  const [createTeam] = useMutation(CREATE_TEAM);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      console.log("🔍 Debug: projectId before mutation:", projectId);
      console.log("🔍 Debug: projectId before mutation:", teamName);
      console.log("🔍 Debug: projectId before mutation:", description);
  
      const { data } = await createTeam({
        variables: {
          projectId: projectId.toString(),
          teamName,
          description,
        },
      });
  
      console.log("✅ Mutation response:", data);
    } catch (err) {
      console.error("❌ GraphQL Request Failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-2 text-2xl font-semibold">Create New Team</h2>
        <p className="mb-4 text-gray-600">Set up your team and invite members to collaborate</p>

        {/* ✅ Success/Error Message */}
        {message && <p className="mb-4 text-sm text-center text-red-600">{message}</p>}

        <form onSubmit={handleSubmit}>
          {/* Team Name Input */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Team Name*</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              className="w-full p-2 border rounded-md"
              placeholder="Describe your team’s purpose"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button
              type="submit"
              className={`px-4 py-2 text-white bg-blue-600 rounded ${loading ? "opacity-50" : ""}`}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
