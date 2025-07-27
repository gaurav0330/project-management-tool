// ChatHeader.jsx (Updated to Use canStartVideoCall Prop for Conditional Button)
import React, { useState } from "react";
import { Video, Users } from "lucide-react"; // Users icon for the group members trigger

const ChatHeader = ({ selectedGroup, userRole, handleStartVideoCall, getGroupTypeLabel, canStartVideoCall }) => {
  const [showMembers, setShowMembers] = useState(false); // State to toggle member list dropdown

  return (
    <header className="sticky top-0 z-10 flex items-center gap-6 bg-bg-secondary-light/90 dark:bg-bg-secondary-dark/95 backdrop-blur-xl border-b border-brand-primary-100/50 dark:border-brand-primary-900/50 px-8 py-5 shadow-sm">
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <h2 className="text-2xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark truncate tracking-tight">
          {selectedGroup.name}
        </h2>
        <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark opacity-90">
          {getGroupTypeLabel(selectedGroup.type)} • {selectedGroup.members?.length || 0} members
        </span>
      </div>

      {/* ✅ Updated: Video Call Button - Shown conditionally based on canStartVideoCall prop */}
      {canStartVideoCall && (
        <button
          onClick={handleStartVideoCall}
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-bg-primary-light bg-gradient-to-r from-brand-primary-600 to-brand-primary-800 hover:brightness-105 shadow-md font-button font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:ring-offset-2 transition-all duration-200"
        >
          <Video className="w-5 h-5" />
          Start Video Call
        </button>
      )}

      {/* Single Icon for Members - Click to Toggle Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowMembers(!showMembers)}
          className="flex items-center gap-2 text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark opacity-90 hover:opacity-100 transition-all duration-200"
          title="View group members"
        >
          <Users className="w-6 h-6" />
          <span className="text-sm font-medium">{selectedGroup.members?.length || 0}</span>
        </button>

        {/* Dropdown List of Members - Classy and Scrollable */}
        {showMembers && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl shadow-2xl border border-brand-primary-100/50 dark:border-brand-primary-900/50 max-h-80 overflow-y-auto z-20 py-2 transition-all duration-300">
            <div className="px-4 py-2 border-b border-brand-primary-100/50 dark:border-brand-primary-900/50">
              <h4 className="text-sm font-heading font-semibold text-heading-accent-light dark:text-heading-accent-dark">Group Members ({selectedGroup.members?.length || 0})</h4>
            </div>
            {selectedGroup.members?.length === 0 ? (
              <p className="px-4 py-3 text-txt-secondary-light dark:text-txt-secondary-dark text-sm italic">No members in this group.</p>
            ) : (
              selectedGroup.members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-brand-primary-50/30 dark:hover:bg-brand-primary-900/20 transition-all duration-150"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary-100 dark:bg-brand-primary-900 text-brand-primary-700 dark:text-brand-primary-200 font-heading font-bold text-sm shadow-sm">
                    {m.username?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?"}
                  </span>
                  <div className="flex-1">
                    <span className="text-txt-primary-light dark:text-txt-primary-dark font-medium">{m.username}</span>
                    <span className="block text-xs text-txt-secondary-light dark:text-txt-secondary-dark opacity-80">({m.role})</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;
