import React from "react";

const NodeLabel = ({ 
  label, 
  email, 
  role, 
  type, 
  isExpandable = false, 
  isExpanded = false, 
  onClick,
  onTaskClick,
  personId,
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
    if (onTaskClick && personId) {
      onTaskClick(personId, type);
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

export default NodeLabel; 