import React from "react";

const GroupList = ({
  groups,
  selectedGroup,
  setSelectedGroup,
  onCreateGroupClick,
  userRole,
  projectId,
  getGroupTypeLabel,
  getInitials,
}) => (
  <aside
    className="min-w-[20rem] max-w-xs w-80 flex flex-col shadow-2xl rounded-r-3xl bg-bg-secondary-light/80 dark:bg-bg-secondary-dark/90 backdrop-blur-xl border-r border-brand-primary-100 dark:border-brand-primary-900 relative overflow-y-auto z-20
      fixed md:relative md:inset-auto inset-0 md:w-80 md:min-w-[20rem] md:max-w-xs"
    style={{ height: "100vh" }}
    aria-label="Chat Group List"
  >
    <div className="p-8 pb-4 border-b border-brand-primary-100 dark:border-brand-primary-900 bg-bg-secondary-light/80 dark:bg-bg-secondary-dark/80 flex flex-col gap-2 sticky top-0 z-20">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-brand-accent-600 dark:text-brand-accent-400 text-3xl">💬</span>
        <h1 className="font-heading font-bold text-2xl tracking-tight text-heading-primary-light dark:text-heading-primary-dark mb-0.5">
          Project Chat
        </h1>
      </div>
      <span className="text-txt-secondary-light dark:text-txt-secondary-dark text-base opacity-80">
        {userRole === "Project_Manager"
          ? "Project Manager"
          : userRole === "Team_Lead"
            ? "Team Lead"
            : "Team Member"}{" "}
        View
      </span>
    </div>

    <button
      onClick={onCreateGroupClick}
      className="mx-4 my-3 px-4 py-2 bg-brand-primary-500 text-white rounded-lg font-semibold hover:bg-brand-primary-600 transition"
      aria-label="Create Custom Group"
    >
      Create Custom Group
    </button>

    <nav className="flex-1 overflow-y-auto py-3 px-2" aria-label="Chat Groups Navigation">
      {groups.length === 0 ? (
        <div className="p-8 text-center text-txt-muted-light dark:text-txt-muted-dark">
          <p>No chat groups available</p>
          <p className="text-sm mt-2">Groups will appear when projects and teams are created</p>
        </div>
      ) : (
        groups.map((group) => {
          const isSelected = selectedGroup?.id === group.id;
          return (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`group w-full mb-2 last:mb-0 flex items-center gap-3 px-4 py-3 rounded-2xl
                hover:bg-brand-primary-50/70 dark:hover:bg-brand-primary-900/60 hover:shadow-lg border-2 transition-all duration-150
                ${isSelected
                  ? "border-brand-primary-600 dark:border-brand-primary-400 bg-brand-primary-50/80 dark:bg-brand-primary-900 shadow"
                  : "border-transparent bg-transparent"
                }
                focus:outline-none focus:ring-2 focus:ring-brand-primary-400
              `}
              aria-current={isSelected ? "true" : undefined}
            >
              <span
                className={`font-heading font-extrabold text-lg rounded-full w-10 h-10 flex items-center justify-center
                ${isSelected
                    ? "bg-brand-primary-600 text-bg-primary-light shadow"
                    : "bg-brand-secondary-100 dark:bg-brand-secondary-900 text-brand-primary-700 dark:text-brand-primary-200"
                  }
                shadow-sm
                `}
                aria-hidden="true"
              >
                {getInitials(group.name)}
              </span>
              <div className="flex flex-col flex-grow min-w-0 text-left">
                <span className="font-heading text-base truncate text-heading-primary-light dark:text-heading-primary-dark">
                  {group.name}
                </span>
                <span className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                  {getGroupTypeLabel(group.type)} &bull; {group.members?.length || 0} members
                </span>
              </div>
              <span className="ml-2 text-[10px] uppercase tracking-wide text-txt-muted-light dark:text-txt-muted-dark font-bold" aria-label={`Group type: ${group.type}`}>
                {group.type}
              </span>
            </button>
          );
        })
      )}
    </nav>
  </aside>
);

export default GroupList;
