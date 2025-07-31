import React, { useState } from "react";
import { Video, Users, X, Trash2 } from "lucide-react";
import { useMutation, gql } from "@apollo/client";
import toast from "react-hot-toast";

const REMOVE_MEMBER_FROM_GROUP = gql`
  mutation RemoveMemberFromGroup($groupId: ID!, $memberId: ID!) {
    removeMemberFromGroup(groupId: $groupId, memberId: $memberId) {
      name
      type
    }
  }
`;

const ChatHeader = ({
  selectedGroup,
  userRole,
  handleStartVideoCall,
  getGroupTypeLabel,
  canStartVideoCall,
  currentUser,
  refetchGroups,
  refetchMessages,
}) => {
  const [showMembers, setShowMembers] = useState(false);

  const [removeMemberFromGroup, { loading: removing }] = useMutation(
    REMOVE_MEMBER_FROM_GROUP,
    {
      onCompleted: () => {
        toast.success("Member removed successfully!");
        refetchGroups?.();
        setShowMembers(false);
      },
      onError: (error) => {
        console.error("Error removing member:", error);
        toast.error("Failed to remove member");
      },
    }
  );

  const handleRemoveMember = (memberId, memberName) => {
    if (!selectedGroup?.id || !memberId) return;

    const toastId = toast(
      (t) => (
        <div className="flex flex-col gap-3 p-3 max-w-xs bg-white dark:bg-gray-800 rounded shadow-lg text-sm text-gray-900 dark:text-gray-100">
          <div>Are you sure you want to remove <strong>{memberName}</strong> from the group?</div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                removeMemberFromGroup({
                  variables: {
                    groupId: selectedGroup.id,
                    memberId,
                  },
                });
                toast.dismiss(t.id);
              }}
              disabled={removing}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-70"
            >
              Remove
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        duration: 10000,
      }
    );
  };

  return (
    <>
      <header
        className="top-0 z-10 flex items-center gap-6 bg-bg-secondary-light/90 dark:bg-bg-secondary-dark/95 backdrop-blur-xl
        border-b border-brand-primary-100/50 dark:border-brand-primary-900/50 px-6 md:px-8 py-4 md:py-5 shadow-sm rounded-b-3xl"
        style={{ height: "84px" }}
      >
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark truncate tracking-tight">
            {selectedGroup.name}
          </h2>
          <span className="text-xs md:text-sm text-txt-secondary-light dark:text-txt-secondary-dark opacity-90">
            {getGroupTypeLabel(selectedGroup.type)} &bull; {selectedGroup.members?.length || 0} members
          </span>
        </div>

        {canStartVideoCall && (
          <button
            onClick={handleStartVideoCall}
            className="hidden md:flex items-center gap-2 rounded-full px-5 py-2.5 text-bg-primary-light bg-gradient-to-r from-brand-primary-600 to-brand-primary-800 hover:brightness-105 shadow-md font-button font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:ring-offset-2 transition-all duration-200"
            aria-label="Start Video Call"
          >
            <Video className="w-5 h-5" />
            <span>Start Video Call</span>
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setShowMembers(true)}
            className="flex items-center gap-2 text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark opacity-90 hover:opacity-100 transition-all duration-200"
            title="View group members"
            aria-haspopup="dialog"
            aria-expanded={showMembers}
          >
            <Users className="w-6 h-6" />
            <span className="text-sm font-medium">{selectedGroup.members?.length || 0}</span>
          </button>
        </div>
      </header>

      {showMembers && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="group-members-title"
          onClick={() => setShowMembers(false)}
        >
          <div
            className="relative w-full max-w-sm mx-auto bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl shadow-2xl border border-brand-primary-100/50 dark:border-brand-primary-900/50 max-h-80 overflow-y-auto py-2 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-3 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              onClick={() => setShowMembers(false)}
              title="Close"
              aria-label="Close Group Members"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="px-4 py-2 border-b border-brand-primary-100/50 dark:border-brand-primary-900/50">
              <h4 id="group-members-title" className="text-sm font-heading font-semibold text-heading-accent-light dark:text-heading-accent-dark">
                Group Members ({selectedGroup.members?.length || 0})
              </h4>
            </div>
            {selectedGroup.members?.length === 0 ? (
              <p className="px-4 py-3 text-txt-secondary-light dark:text-txt-secondary-dark text-sm italic">
                No members in this group.
              </p>
            ) : (
              selectedGroup.members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-brand-primary-50/30 dark:hover:bg-brand-primary-900/20 transition-all duration-150"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary-100 dark:bg-brand-primary-900 text-brand-primary-700 dark:text-brand-primary-200 font-heading font-bold text-sm shadow-sm">
                    {m.username
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "?"}
                  </span>
                  <div className="flex-1">
                    <span className="text-txt-primary-light dark:text-txt-primary-dark font-medium">{m.username}</span>
                    <span className="block text-xs text-txt-secondary-light dark:text-txt-secondary-dark opacity-80">({m.role})</span>
                  </div>

                  {/* Remove button only for custom groups and not current user */}
                  {selectedGroup.type === "custom" && currentUser?.id !== m.id && (
                    <button
                      onClick={() => handleRemoveMember(m.id, m.username)}
                      title={`Remove ${m.username}`}
                      className="text-error hover:text-error-dark p-1 rounded-full transition"
                      disabled={removing}
                      aria-label={`Remove member ${m.username}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
