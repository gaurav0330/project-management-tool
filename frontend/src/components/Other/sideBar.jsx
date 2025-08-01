import React, { useState, useEffect } from "react";
import {
  Home, FolderKanban, Users, BarChart3, Settings, ChevronDown, ChevronRight,
  Menu, UserCog, ClipboardList, UserPlus, Target, CheckCircle,
  TrendingUp, Github, Calendar, Shield, Briefcase, User, Database, PanelLeftClose, PanelLeft, MessageSquare
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/Ui/sheet";
import { Button } from "@/components/UI/button";
import { Separator } from "@/components/UI/separator";
import { cn } from "../../../lib/utils";
import { useWindowSize } from "../../hooks/useWindowSize"; // Using provided hook

const Sidebar = ({ setActiveComponent, onStateChange, category, NavbarItems }) => {
  const { width } = useWindowSize();
  const isMobile = width < 1024; // Tailwind 'lg' breakpoint

  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setRole] = useState(null);
  const [activeItem, setActiveItem] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored?.role) setRole(stored.role);
  }, []);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(isCollapsed, isHovering);
    }
  }, [isCollapsed, isHovering, onStateChange]);

  const toggleSection = (sectionTitle) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setExpandedSections({});
  };

  const shouldShowFull = !isCollapsed || isHovering;

  const MENU = {
    Project_Manager: [
      {
        title: "Project Management",
        icon: FolderKanban,
        links: [
          { txt: "Project Home", icon: Briefcase, comp: "projectHome" },
          ...(category === "development" ? [{ txt: "Integrations", icon: Github, comp: "integrations" }] : []),
          { txt: "Manage Lead", icon: UserCog, comp: "managelead" },
          { txt: "Manage Tasks", icon: ClipboardList, comp: "assignedTasks" },
          { txt: "Manage Team", icon: Users, comp: "manageteam" },
          { txt: "Approve Tasks", icon: CheckCircle, comp: "approvetask" },
        ],
      },
      {
        title: "Chat & Collaboration",
        icon: MessageSquare,
        links: [{ txt: "Chat", icon: MessageSquare, comp: "chat" }],
      },
      {
        title: "Analytics & Reports",
        icon: BarChart3,
        links: [
          { txt: "Timeline", icon: Calendar, comp: "TimeLine" },
          { txt: "Analytics", icon: TrendingUp, comp: "analytics" },
        ],
      },
      {
        title: "Project Settings",
        icon: Settings,
        links: [{ txt: "Settings", icon: Shield, comp: "setting" }],
      },
    ],
    Team_Lead: [
      {
        title: "Overview",
        icon: Home,
        links: [{ txt: "Project Home", icon: Briefcase, comp: "projectHome" }],
      },
      {
        title: "My Tasks",
        icon: ClipboardList,
        links: [
          { txt: "My Tasks", icon: Target, comp: "mytasks" },
          { txt: "Task Submit", icon: CheckCircle, comp: "approvetask" },
        ],
      },
      {
        title: "Team Management",
        icon: Users,
        links: [
          { txt: "Create Team", icon: UserPlus, comp: "createteam" },
          { txt: "My Teams", icon: Users, comp: "myteams" },
        ],
      },
      {
        title: "Chat & Collaboration",
        icon: MessageSquare,
        links: [{ txt: "Chat", icon: MessageSquare, comp: "chat" }],
      },
      {
        title: "Project Settings",
        icon: Settings,
        links: [{ txt: "Settings", icon: Shield, comp: "setting" }],
      },
    ],
    Team_Member: [
      {
        title: "Overview",
        icon: Home,
        links: [{ txt: "Dashboard", icon: Database, comp: "overview" }],
      },
      {
        title: "My Tasks",
        icon: ClipboardList,
        links: [{ txt: "My Tasks", icon: Target, comp: "tasks" }],
      },
      {
        title: "Chat & Collaboration",
        icon: MessageSquare,
        links: [{ txt: "Chat", icon: MessageSquare, comp: "chat" }],
      },
      {
        title: "Project Settings",
        icon: Settings,
        links: [{ txt: "Settings", icon: Shield, comp: "settings" }],
      },
    ],
  };

  const sections = MENU[userRole] || [];

  // Sidebar content reusable for both desktop and mobile
  const MenuBlock = () => (
    <aside
      className={cn(
        "flex h-full flex-col backdrop-blur-md border-r transition-all duration-300",
        "bg-bg-secondary-light dark:bg-bg-secondary-dark",
        "border-gray-200/30 dark:border-gray-700/30",
        shouldShowFull ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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
            <Briefcase className="w-3.5 h-3.5 text-white" />
          </div>
          {shouldShowFull && (
            <h1 className="font-heading text-base font-semibold text-heading-primary-light dark:text-heading-primary-dark tracking-tight">
              YojanaDesk
            </h1>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button */}
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
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
          {shouldShowFull && (
            <span className="text-xs font-medium">{isCollapsed ? "Expand" : "Collapse"}</span>
          )}
        </Button>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
        {sections.map(({ title, icon: SectionIcon, links }, i) => (
          <div key={i} className="space-y-1">
            {/* Section Header - Clickable */}
            {shouldShowFull ? (
              <Button
                onClick={() => toggleSection(title)}
                variant="ghost"
                className={cn(
                  "w-full justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-all duration-300",
                  "bg-bg-primary-light dark:bg-bg-primary-dark",
                  "hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark",
                  "text-txt-primary-light dark:text-txt-primary-dark",
                  "border border-gray-200/20 dark:border-gray-700/20"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-brand-primary-50 dark:bg-brand-primary-900/20 flex items-center justify-center">
                    <SectionIcon className="w-3.5 h-3.5 text-brand-primary-600 dark:text-brand-primary-400" />
                  </div>
                  <span className="font-medium tracking-wide uppercase">{title}</span>
                </div>
                {expandedSections[title] ? (
                  <ChevronDown className="h-3.5 w-3.5 text-txt-secondary-light dark:text-txt-secondary-dark" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-txt-secondary-light dark:text-txt-secondary-dark" />
                )}
              </Button>
            ) : (
              // Collapsed state - show only icon
              <div className="flex justify-center mb-3">
                <div
                  className="w-10 h-10 rounded-lg bg-bg-primary-light dark:bg-bg-primary-dark flex items-center justify-center border border-gray-200/20 dark:border-gray-700/20 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition-all duration-300"
                  title={title}
                >
                  <SectionIcon className="w-5 h-5 text-brand-primary-600 dark:text-brand-primary-400" />
                </div>
              </div>
            )}

            {/* Collapsible Links */}
            {shouldShowFull && expandedSections[title] && (
              <div className="ml-3 space-y-1 border-l border-gray-300/30 dark:border-gray-600/30 pl-3 py-1">
                {links.map(({ txt, icon: Icon, comp }) => (
                  <Button
                    key={txt}
                    onClick={() => {
                      setActiveComponent(comp);
                      setActiveItem(txt);
                      setIsOpen(false);
                    }}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-300",
                      activeItem === txt
                        ? "bg-brand-primary-600 text-white shadow-lg font-medium"
                        : "text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium tracking-wide">{txt}</span>
                  </Button>
                ))}
              </div>
            )}

            {/* Show collapsed menu items as icons only */}
            {!shouldShowFull && (
              <div className="space-y-2">
                {links.map(({ txt, icon: Icon, comp }) => (
                  <div key={txt} className="flex justify-center">
                    <Button
                      onClick={() => {
                        setActiveComponent(comp);
                        setActiveItem(txt);
                        setIsOpen(false);
                      }}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-10 h-10 p-0 rounded-lg transition-all duration-300",
                        activeItem === txt
                          ? "bg-brand-primary-600 text-white shadow-lg"
                          : "text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                      )}
                      title={txt}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Separator */}
            {shouldShowFull && i !== sections.length - 1 && (
              <div className="my-3 h-px bg-gradient-to-r from-transparent via-gray-300/20 dark:via-gray-600/20 to-transparent" />
            )}
          </div>
        ))}

        {sections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 bg-bg-accent-light dark:bg-bg-accent-dark rounded-full flex items-center justify-center mb-3">
              <Settings className="w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
            </div>
            {shouldShowFull && (
              <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark font-medium">Loading menu...</p>
            )}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200/10 dark:border-gray-700/10 bg-bg-primary-light dark:bg-bg-primary-dark">
        <div
          className={cn(
            "flex items-center rounded-lg bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200/20 dark:border-gray-700/20 transition-all duration-300",
            shouldShowFull ? "gap-3 px-3 py-2.5" : "justify-center p-2.5"
          )}
        >
          <div className="w-7 h-7 bg-gradient-to-br from-brand-accent-500 to-brand-accent-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          {shouldShowFull && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-txt-primary-light dark:text-txt-primary-dark truncate tracking-wide">
                {userRole?.replace("_", " ") || "User"}
              </p>
              <p className="text-[10px] text-txt-secondary-light dark:text-txt-secondary-dark font-medium">Online</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile toggle button and Sheet from right */}
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="fixed top-4 right-4 z-[60] block lg:hidden bg-brand-primary-600 hover:bg-brand-primary-700 text-white shadow-lg border-none rounded-xl backdrop-blur-sm"
              aria-label={isOpen ? "Close sidebar menu" : "Open sidebar menu"}
            >
              {isOpen ? <PanelLeftClose size={24} /> : <Menu size={24} />}
            </Button>
          </SheetTrigger>

          {/* Sheet sliding in from right */}
          <SheetContent side="right" className="p-0 w-64 border-l border-gray-200/20 dark:border-gray-700/20 bg-bg-secondary-light dark:bg-bg-secondary-dark backdrop-blur-md flex flex-col">
            {/* Sidebar menu */}
            <MenuBlock />

            {/* Separator */}
            <Separator />

            {/* Inject Navbar items below sidebar in mobile */}
            {NavbarItems && (
              <div className="px-4 py-4 overflow-auto max-h-[calc(100vh-16rem)]">
                {NavbarItems}
              </div>
            )}
          </SheetContent>
        </Sheet>
      ) : (
        <>
          {/* Desktop sidebar on left */}
          <div
            className={cn(
              "hidden lg:block fixed top-0 left-0 h-full z-40 transition-all duration-300",
              shouldShowFull ? "w-64" : "w-24"
            )}
          >
            <MenuBlock />
          </div>
          {/* On desktop, Navbar stays separate/independent - you control it outside this Sidebar */}
        </>
      )}
    </>
  );
};

export default Sidebar;
