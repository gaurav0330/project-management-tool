import React, { useState, useEffect } from "react";
import {
  House,
  UsersFour,
  ClipboardText,
  ListChecks,
  ChartBar,
  UserPlus,
  ArrowsLeftRight,
  CaretDown,
  CaretUp,
  List,
  X,
} from "phosphor-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../lib/utils";
import { useWindowSize } from "../../hooks/useWindowSize";

const TEAM_MENU = [
  {
    title: "Project Overview",
    icon: House,
    items: [
      { label: "Project Home", icon: House, component: "projectHome" },
    ],
  },
  {
    title: "Task Management",
    icon: ClipboardText,
    items: [
      { label: "Create Tasks", icon: ClipboardText, component: "createtasks" },
      { label: "Manage Tasks", icon: ListChecks, component: "managetasks" },
      { label: "Approve Tasks", icon: ChartBar, component: "approvetasks" },
    ],
  },
  {
    title: "Team & Reports",
    icon: UsersFour,
    items: [
      { label: "Add Members", icon: UserPlus, component: "addmembers" },
      { label: "Task Distribution", icon: ArrowsLeftRight, component: "taskDistribution" },
      { label: "Team Tasks", icon: ListChecks, component: "teamtasks" },
    ],
  },
];

const TeamSidebar = ({ setActiveComponent, onStateChange, teamId, projectId }) => {
  const { width } = useWindowSize();
  const isMobile = width < 1024; // Tailwind 'lg' breakpoint

  const [activeItem, setActiveItem] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const shouldShowFull = !isCollapsed || isHovering;

  useEffect(() => {
    if (onStateChange) onStateChange(isCollapsed, isHovering);
  }, [isCollapsed, isHovering, onStateChange]);

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setExpandedSections({});
  };

  // Desktop Sidebar Menu Block
  const MenuBlock = () => (
    <aside
      className={cn(
        "flex h-full flex-col border-r transition-all duration-300 backdrop-blur-md",
        "bg-bg-secondary-light dark:bg-bg-secondary-dark",
        "border-gray-200/30 dark:border-gray-700/30",
        shouldShowFull ? "w-64" : "w-16"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200/20 dark:border-gray-700/20 bg-bg-primary-light dark:bg-bg-primary-dark px-3">
        <div
          className={cn(
            "flex items-center transition-all duration-300",
            shouldShowFull ? "gap-2.5" : "justify-center"
          )}
        >
          <div className="w-7 h-7 bg-brand-primary-600 rounded-lg flex items-center justify-center shadow-sm">
            <House className="w-4 h-4 text-white" weight="fill" />
          </div>
          {shouldShowFull && (
            <h1 className="font-heading text-base font-semibold text-heading-primary-light dark:text-heading-primary-dark">
              Team Dashboard
            </h1>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="px-3 py-2 border-b border-gray-200/10 dark:border-gray-700/10">
        <Button
          onClick={toggleCollapse}
          variant="ghost"
          size="sm"
          className={cn(
            "transition-all duration-300 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark",
            shouldShowFull ? "w-full justify-start gap-2" : "w-10 h-10 p-0 justify-center"
          )}
        >
          {isCollapsed ? <List className="h-4 w-4" /> : <X className="h-4 w-4" />}
          {shouldShowFull && (
            <span className="text-xs font-medium">{isCollapsed ? "Expand" : "Collapse"}</span>
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
        {TEAM_MENU.map(({ title, icon: SectionIcon, items }, index) => (
          <div key={index} className="space-y-1">
            {shouldShowFull ? (
              <Button
                onClick={() => toggleSection(title)}
                variant="ghost"
                className="w-full justify-between px-3 py-2.5 text-xs font-medium rounded-lg bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border border-gray-200/20 dark:border-gray-700/20 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-brand-primary-50 dark:bg-brand-primary-900/20 flex items-center justify-center">
                    <SectionIcon className="w-4 h-4 text-brand-primary-600 dark:text-brand-primary-400" weight="duotone" />
                  </div>
                  <span className="font-medium tracking-wide uppercase">{title}</span>
                </div>
                {expandedSections[title] ? (
                  <CaretUp className="w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
                ) : (
                  <CaretDown className="w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
                )}
              </Button>
            ) : (
              <div className="flex justify-center mb-3">
                <div
                  className="w-10 h-10 rounded-lg bg-bg-primary-light dark:bg-bg-primary-dark flex items-center justify-center border border-gray-200/20 dark:border-gray-700/20 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition-all duration-300"
                  title={title}
                >
                  <SectionIcon className="w-5 h-5 text-brand-primary-600 dark:text-brand-primary-400" weight="fill" />
                </div>
              </div>
            )}

            {/* Expanded Links */}
            {shouldShowFull && expandedSections[title] && (
              <div className="ml-3 border-l border-gray-300/30 dark:border-gray-600/30 pl-3 py-1 space-y-1">
                {items.map((item) => (
                  <Button
                    key={item.label}
                    onClick={() => {
                      setActiveComponent(item.component);
                      setActiveItem(item.label);
                    }}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-300",
                      activeItem === item.label
                        ? "bg-brand-primary-600 text-white shadow-lg font-medium"
                        : "text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" weight="duotone" />
                    <span className="font-medium tracking-wide">{item.label}</span>
                  </Button>
                ))}
              </div>
            )}

            {/* Collapsed icon-only view */}
            {!shouldShowFull && (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.label} className="flex justify-center">
                    <Button
                      onClick={() => {
                        setActiveComponent(item.component);
                        setActiveItem(item.label);
                      }}
                      variant="ghost"
                      size="sm"
                      title={item.label}
                      className={cn(
                        "w-10 h-10 p-0 rounded-lg transition-all duration-300",
                        activeItem === item.label
                          ? "bg-brand-primary-600 text-white shadow-lg"
                          : "hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark text-txt-secondary-light dark:text-txt-secondary-dark"
                      )}
                    >
                      <item.icon className="h-4 w-4" weight="fill" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Divider between sections */}
            {shouldShowFull && index !== TEAM_MENU.length - 1 && (
              <div className="my-3 h-px bg-gradient-to-r from-transparent via-gray-300/20 dark:via-gray-600/20 to-transparent" />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200/10 dark:border-gray-700/10 bg-bg-primary-light dark:bg-bg-primary-dark">
        <div
          className={cn(
            "flex items-center rounded-lg bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200/20 dark:border-gray-700/20 transition-all duration-300",
            shouldShowFull ? "gap-3 px-3 py-2.5" : "justify-center p-2.5"
          )}
        >
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
            <UsersFour className="w-3.5 h-3.5 text-white" weight="fill" />
          </div>
          {shouldShowFull && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-txt-primary-light dark:text-txt-primary-dark truncate tracking-wide">
                Team Management
              </p>
              <p className="text-[10px] text-txt-secondary-light dark:text-txt-secondary-dark font-medium">Active</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar only - Mobile is handled by parent component */}
      {!isMobile && (
        <div
          className={cn(
            "fixed top-0 left-0 h-full z-40 transition-all duration-300",
            shouldShowFull ? "w-64" : "w-16"
          )}
        >
          <MenuBlock />
        </div>
      )}
    </>
  );
};

export default TeamSidebar;
