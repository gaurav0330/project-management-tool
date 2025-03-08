import React, { useState, useEffect } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion"; // ✅ Import for animations
import { Loader2 } from "lucide-react"; // ✅ Loading spinner icon

// Define GraphQL Queries & Mutations
const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!, $teamLeadId: ID!, $memberIds: [ID!]!) {
    createGroup(name: $name, teamLeadId: $teamLeadId, memberIds: $memberIds) {
      id
      name
      teamLead {
        id
        username
      }
      members {
        id
        username
      }
    }
  }
`;

const GET_ALL_TEAM_MEMBERS = gql`
  query GetAllTeamMembers {
    getAllTeamMembers {
      id
      username
      email
      role
    }
  }
`;

const CreateGroupPage = ({ onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [leadId, setLeadId] = useState(null);

  // Decode token to get user ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setLeadId(decoded.id);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  // Fetch team members
  const { data: membersData, loading: membersLoading, error: membersError } = useQuery(GET_ALL_TEAM_MEMBERS);

  // Create Group Mutation
  const [createGroup, { loading: creatingGroup }] = useMutation(CREATE_GROUP);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      alert("Please enter a group name and select at least one member.");
      return;
    }

    try {
      await createGroup({
        variables: { name: groupName, teamLeadId: leadId, memberIds: selectedMembers },
      });

      setGroupName("");
      setSelectedMembers([]);
      alert("Group Created Successfully!");
      window.location.reload();
      onClose(); // ✅ Close modal after success
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group.");
    }
  };

  // Handle checkbox selection
  const handleMemberSelect = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
    >
      <div className="relative w-full max-w-lg p-6 bg-white shadow-xl rounded-2xl">
        <h2 className="mb-4 text-2xl font-semibold text-center text-gray-700">Create Group</h2>

        {/* Group Name Input */}
        <input
          type="text"
          placeholder="Enter Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Member Selection */}
        <div className="mt-4">
          <p className="mb-2 text-gray-600">Select Members:</p>
          <div className="p-2 overflow-y-auto border rounded-lg max-h-40 bg-gray-50">
            {membersLoading ? (
              <p className="text-gray-500">Loading members...</p>
            ) : membersError ? (
              <p className="text-red-500">Error fetching members.</p>
            ) : (
              membersData?.getAllTeamMembers?.map((user) => (
                <label key={user.id} className="flex items-center py-1 space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user.id)}
                    onChange={() => handleMemberSelect(user.id)}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">
                    {user.username} <span className="text-sm text-gray-500">({user.role})</span>
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white transition bg-gray-500 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={creatingGroup}
            className="flex items-center px-4 py-2 space-x-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            {creatingGroup && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{creatingGroup ? "Creating..." : "Create Group"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateGroupPage;
