import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { gql } from "@apollo/client";
import { X } from "lucide-react";

const GET_USERS_BY_PROJECT_ID = gql`
  query GetUsersByProjectId($projectId: ID!) {
    getUsersByProjectId(projectId: $projectId) {
      id
      username
      email
      role
    }
  }
`;

const CREATE_CUSTOM_GROUP = gql`
  mutation CreateCustomGroup($name: String!, $projectId: ID!, $memberIds: [ID!]!, $creatorId: ID!) {
    createCustomGroup(name: $name, projectId: $projectId, memberIds: $memberIds, creatorId: $creatorId) {
      id
      name
      type
      project
    }
  }
`;

const CreateGroupModal = ({ isOpen, onClose, projectId, currentUser, refetchGroups }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS_BY_PROJECT_ID, {
    variables: { projectId },
    skip: !isOpen || !projectId,
  });

  const [createCustomGroup] = useMutation(CREATE_CUSTOM_GROUP, {
    onCompleted: () => {
      toast.success("Custom group created successfully!");
      setGroupName("");
      setSelectedMembers([]);
      onClose();
      refetchGroups();
    },
    onError: (error) => {
      toast.error(`Failed to create group: ${error.message}`);
    },
  });

  const handleMemberToggle = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      toast.error("Group name and at least one member are required.");
      return;
    }
    await createCustomGroup({
      variables: {
        name: groupName.trim(),
        projectId,
        memberIds: selectedMembers,
        creatorId: currentUser.id,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-group-title"
    >
      <div className="bg-bg-secondary-light dark:bg-bg-secondary-dark p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 font-body text-txt-primary-light dark:text-txt-primary-dark relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark opacity-70 hover:opacity-100 transition"
          aria-label="Close Create Group Modal"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 id="create-group-title" className="text-2xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark mb-6">
          Create Custom Group
        </h3>

        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          className="w-full px-4 py-3 rounded-lg border border-brand-primary-100 dark:border-brand-primary-900 bg-bg-primary-light/90 dark:bg-bg-primary-dark/80 text-txt-primary-light dark:text-txt-primary-dark placeholder-txt-muted-light dark:placeholder-txt-muted-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-300 dark:focus:ring-brand-primary-500 focus:ring-offset-1 shadow-sm mb-6 transition-all"
          autoFocus
        />

        <div className="mb-6">
          <h4 className="font-heading font-semibold text-lg text-heading-accent-light dark:text-heading-accent-dark mb-3">
            Select Members:
          </h4>
          {usersLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-interactive-primary-light dark:border-interactive-primary-dark"></div>
            </div>
          ) : usersData?.getUsersByProjectId?.filter(user => user.id !== currentUser.id).length === 0 ? (
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-center py-4">No users available in this project.</p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {usersData?.getUsersByProjectId
                ?.filter(user => user.id !== currentUser.id)
                .map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-primary-50/50 dark:hover:bg-brand-primary-900/30 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(user.id)}
                      onChange={() => handleMemberToggle(user.id)}
                      className="w-5 h-5 rounded border-brand-primary-300 dark:border-brand-primary-700 text-brand-primary-600 focus:ring-brand-primary-500 dark:focus:ring-brand-primary-400"
                    />
                    <span className="flex-1 text-txt-primary-light dark:text-txt-primary-dark">
                      {user.username} <span className="text-txt-secondary-light dark:text-txt-secondary-dark">({user.role})</span>
                    </span>
                  </label>
                ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark rounded-lg font-button font-medium shadow hover:brightness-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-6 py-2.5 bg-gradient-to-r from-brand-primary-500 to-brand-primary-700 text-bg-primary-light rounded-lg font-button font-medium shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
            disabled={!groupName.trim() || selectedMembers.length === 0}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
