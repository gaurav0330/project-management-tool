import React, { useState, useEffect } from "react";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    icon: "🚀",
    content: (
      <>
        <div className="space-y-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-primary-200/10 via-brand-secondary-500/5 to-brand-accent-500/10 rounded-3xl p-6 md:p-8 border border-brand-primary-200 dark:border-brand-primary-800">
            {/* Removed purple blur div here */}
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 bg-clip-text text-transparent">
                  Welcome to YojanaDesk
                </h3>
              </div>
              <p className="text-base md:text-lg leading-relaxed mb-4 text-txt-primary-light dark:text-txt-primary-dark">
                A modern collaboration platform designed to streamline teamwork
                through AI-powered task management, GitHub integration, and
                seamless communication.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-brand-accent-50 to-brand-accent-100 dark:from-brand-accent-900/20 dark:to-brand-accent-800/20 rounded-2xl p-4 md:p-6 border border-brand-accent-200 dark:border-brand-accent-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-brand-accent-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm">📈</span>
                </div>
                <h4 className="font-heading font-semibold text-brand-accent-700 dark:text-brand-accent-300 text-sm md:text-base">
                  Productivity Boost
                </h4>
              </div>
              <p className="text-sm md:text-base text-txt-secondary-light dark:text-txt-secondary-dark">
                Increase team productivity and transparency while delivering
                projects on time.
              </p>
            </div>

            <div className="bg-gradient-to-br from-brand-secondary-50 to-brand-secondary-100 dark:from-brand-secondary-900/20 dark:to-brand-secondary-800/20 rounded-2xl p-4 md:p-6 border border-brand-secondary-200 dark:border-brand-secondary-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-brand-secondary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <h4 className="font-heading font-semibold text-brand-secondary-700 dark:text-brand-secondary-300 text-sm md:text-base">
                  AI-Powered
                </h4>
              </div>
              <p className="text-sm md:text-base text-txt-secondary-light dark:text-txt-secondary-dark">
                Leverage state-of-the-art AI algorithms for optimal task
                allocation and team analysis.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "how-it-works",
    title: "How It Works",
    icon: "⚡",
    content: (
      <>
        <div className="space-y-8">
          <div className="text-center mb-8 px-4 md:px-0">
            <h3 className="text-xl md:text-2xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark mb-4">
              Integrated Workflow
            </h3>
            <p className="text-base md:text-lg text-txt-secondary-light dark:text-txt-secondary-dark max-w-2xl mx-auto">
              YojanaDesk combines multiple functionalities into a single,
              intuitive interface
            </p>
          </div>

          <div className="grid gap-6 px-4 md:px-0">
            {[
              {
                icon: "🎯",
                title: "AI-Enhanced Task Management",
                description:
                  "Centralized task and project management with intelligent assignments",
              },
              {
                icon: "🔗",
                title: "GitHub Integration",
                description:
                  "Synchronized repository integration for automatic task updates from commits",
              },
              {
                icon: "💬",
                title: "Real-time Communication",
                description:
                  "Integrated chat, video calls, and group discussions within project teams",
              },
              {
                icon: "📊",
                title: "Analytics Dashboard",
                description:
                  "Detailed project timelines and performance insights for managers",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl p-4 md:p-6 border border-bg-accent-light dark:border-bg-accent-dark bg-gradient-to-r from-bg-accent-light to-bg-secondary-light dark:from-bg-accent-dark dark:to-bg-secondary-dark hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-500/5 via-transparent to-brand-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg md:text-xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2 group-hover:text-brand-primary-600 dark:group-hover:text-brand-primary-400 transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-txt-secondary-light dark:text-txt-secondary-dark leading-relaxed text-sm md:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-brand-primary-50 via-brand-secondary-50 to-brand-accent-50 dark:from-brand-primary-900/10 dark:via-brand-secondary-900/10 dark:to-brand-accent-900/10 rounded-3xl p-6 md:p-8 border-2 border-dashed border-brand-primary-200 dark:border-brand-primary-700 mx-4 md:mx-0">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-primary-500 to-brand-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="text-white text-2xl">✨</span>
              </div>
              <h4 className="text-lg md:text-xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark mb-3">
                Seamless Integration
              </h4>
              <p className="text-txt-secondary-light dark:text-txt-secondary-dark max-w-md mx-auto text-sm md:text-base">
                Focus on your work rather than coordinating workflows. Automatic
                GitHub syncing keeps project statuses current without manual
                updates.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "roles",
    title: "User Roles",
    icon: "👥",
    content: null,
  },
  {
    id: "features",
    title: "Features",
    icon: "✨",
    content: null,
  },
  {
    id: "webhook",
    title: "GitHub Setup",
    icon: "🔧",
    content: null,
  },
  {
    id: "tips",
    title: "Best Practices",
    icon: "💡",
    content: (
      <div className="space-y-6 px-4 md:px-0">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-brand-accent-100 to-brand-primary-100 dark:from-brand-accent-900/30 dark:to-brand-primary-900/30 px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-brand-accent-500 rounded-full animate-pulse"></span>
            <span className="text-brand-accent-700 dark:text-brand-accent-300 font-medium text-sm">
              Pro Tips
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark">
            Maximize Your Workflow
          </h3>
        </div>

        <div className="grid gap-4">
          {[
            {
              tip: "Regularly review AI suggestions for task assignments to ensure balance and fairness.",
              icon: "⚖️",
            },
            {
              tip: "Keep your GitHub webhooks updated to maintain synchronization.",
              icon: "🔄",
            },
            {
              tip: "Utilize the timeline and analytics for identifying bottlenecks and improving project delivery.",
              icon: "📈",
            },
            {
              tip: "Encourage open communication through chats and scheduled video calls to align teams.",
              icon: "💬",
            },
            {
              tip: "Periodically audit user permissions and project settings to uphold security.",
              icon: "🔒",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group bg-gradient-to-r from-bg-primary-light to-bg-accent-light dark:from-bg-primary-dark dark:to-bg-accent-dark rounded-2xl p-4 md:p-6 border border-bg-accent-light dark:border-bg-accent-dark hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-accent-500 to-brand-primary-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-lg">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 bg-clip-text text-transparent">
                      Tip #{index + 1}
                    </span>
                  </div>
                  <p className="text-txt-primary-light dark:text-txt-primary-dark leading-relaxed text-sm md:text-base">
                    {item.tip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const roles = [
  {
    name: "Project Manager",
    icon: "👨‍💼",
    description:
      "Oversees entire projects, sets goals, and assigns leads using AI-powered insights.",
    details: [
      "Create and configure new projects with timelines and objectives",
      "Integrate projects with GitHub repositories securely",
      "Use AI to select optimal team leads for specific tasks",
      "Monitor overall progress and approve workflow stages",
      "Analyze team performance with interactive dashboards",
    ],
    gradient: "from-brand-primary-500 to-brand-primary-600",
  },
  {
    name: "Team Lead",
    icon: "🧑‍💻",
    description:
      "Manages sub-teams, delegates tasks, and ensures quality delivery on schedule.",
    details: [
      "Manage and monitor assigned tasks within projects",
      "Verify task completions via GitHub or built-in interface",
      "Create sub-teams and delegate with AI recommendations",
      "Ensure quality standards and timely completion",
    ],
    gradient: "from-brand-secondary-500 to-brand-secondary-600",
  },
  {
    name: "Team Member",
    icon: "👤",
    description:
      "Completes assigned tasks, communicates progress, and submits work for review.",
    details: [
      "Access and manage personalized task lists",
      "Complete tasks through manual input or GitHub sync",
      "Receive real-time status updates from pending to approved",
    ],
    gradient: "from-brand-accent-500 to-brand-accent-600",
  },
];

const features = [
  {
    name: "Communication Hub",
    icon: "💬",
    description:
      "Integrated tools to keep teams connected, informed, and collaborating effectively.",
    points: [
      "Auto-created group chats for leads and teams",
      "One-on-one conversations and group discussions",
      "Scheduled video calls with customizable permissions",
    ],
    gradient: "from-brand-primary-500 to-brand-primary-600",
  },
  {
    name: "GitHub Integration",
    icon: "🐙",
    description:
      "Seamless synchronization between your project tasks and GitHub repository activities.",
    points: [
      "Generate secure webhook secret keys effortlessly",
      "Real-time task updates from commits and pull requests",
      "Step-by-step setup guidance with automated instructions",
    ],
    gradient: "from-brand-secondary-500 to-brand-secondary-600",
  },
  {
    name: "Analytics Dashboard",
    icon: "📈",
    description:
      "Interactive visual insights into project progress and comprehensive team performance.",
    points: [
      "Visual timeline of project phases and deadlines",
      "Real-time analytics on task statuses and bottlenecks",
      "Team performance metrics and productivity charts",
    ],
    gradient: "from-brand-accent-500 to-brand-accent-600",
  },
];

function AccordionSection({ section, isOpen, onToggle, children }) {
  return (
    <div className="group bg-bg-primary-light dark:bg-bg-primary-dark rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 mb-6 md:mb-8 overflow-hidden border-2 border-bg-accent-light dark:border-bg-accent-dark hover:border-brand-primary-200 dark:hover:border-brand-primary-700">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex justify-between items-center px-4 md:px-8 py-6 md:py-8 text-left hover:bg-gradient-to-r hover:from-bg-secondary-light hover:to-bg-accent-light dark:hover:from-bg-secondary-dark dark:hover:to-bg-accent-dark transition-all duration-500 group"
      >
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-12 md:w-14 h-12 md:h-14 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="text-xl md:text-2xl">{section.icon}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark group-hover:bg-gradient-to-r group-hover:from-brand-primary-600 group-hover:to-brand-secondary-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {section.title}
          </h2>
        </div>
        <div
          className={`transform transition-all duration-500 ${
            isOpen ? "rotate-180 scale-110" : "rotate-0"
          } p-2 md:p-3 rounded-2xl bg-gradient-to-br from-brand-primary-100 to-brand-secondary-100 dark:from-brand-primary-900/50 dark:to-brand-secondary-900/50 shadow-lg`}
        >
          <svg
            className="w-5 md:w-6 h-5 md:h-6 text-brand-primary-600 dark:text-brand-primary-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      <div
        className={`transition-all duration-700 ease-in-out ${
          isOpen
            ? "max-h-[3000px] opacity-100 pb-6 md:pb-8"
            : "max-h-0 opacity-0 pb-0"
        } overflow-hidden`}
      >
        <div className="px-4 md:px-8 pb-6 md:pb-8">{children}</div>
      </div>
    </div>
  );
}

export default function Docs() {
  const [openSectionId, setOpenSectionId] = useState("introduction");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animateOnScroll, setAnimateOnScroll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateOnScroll(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (id) => {
    setOpenSectionId(id);
    setSidebarOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary-light via-bg-primary-light to-bg-accent-light dark:from-bg-secondary-dark dark:via-bg-primary-dark dark:to-bg-accent-dark">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed positioning */}
      <nav
        className={`fixed top-16 left-0 z-50 h-full w-72 sm:w-80 bg-bg-primary-light/98 dark:bg-bg-primary-dark/98 backdrop-blur-2xl border-r-2 border-bg-accent-light dark:border-bg-accent-dark
          transform lg:translate-x-0 transition-all duration-500 ease-out shadow-2xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-500/10 to-brand-secondary-500/10"></div>
          <div className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-6 sm:py-8 border-b-2 border-bg-accent-light dark:border-bg-accent-dark">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-brand font-bold bg-gradient-to-r from-brand-primary-600/50 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent">
                  YOJANADESK
                </h1>
                <p className="text-xs text-txt-muted-light dark:text-txt-muted-dark">
                  Documentation
                </p>
              </div>
            </div>
            <button
              type="button"
              className="lg:hidden p-2 sm:p-3 rounded-2xl hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition-all duration-300 hover:scale-110"
              onClick={() => setSidebarOpen(false)}
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-txt-primary-light dark:text-txt-primary-dark"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 sm:px-6 py-6 sm:py-8 h-full overflow-y-auto">
          <h3 className="text-xs font-semibold text-txt-muted-light dark:text-txt-muted-dark uppercase tracking-wide mb-6 flex items-center space-x-2">
            <span className="w-2 h-2 bg-brand-primary-500 rounded-full"></span>
            <span>Navigation</span>
          </h3>
          <ul className="space-y-3">
            {sections.map(({ id, title, icon }, index) => (
              <li key={id}>
                <button
                  className={`w-full text-left py-3 sm:py-4 px-4 sm:px-5 rounded-2xl font-medium transition-all duration-500 hover:scale-[1.02] group
                   ${
                     openSectionId === id
                       ? "bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 text-white shadow-xl scale-[1.02]"
                       : "text-txt-primary-light dark:text-txt-primary-dark hover:bg-gradient-to-r hover:from-bg-accent-light hover:to-bg-secondary-light dark:hover:from-bg-accent-dark dark:hover:to-bg-secondary-dark hover:shadow-lg"
                   }`}
                  onClick={() => handleNavigate(id)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">
                      {icon}
                    </span>
                    <div className="flex-1">
                      <span className="block font-semibold text-sm sm:text-base">
                        {title}
                      </span>
                      <div
                        className={`w-0 h-0.5 bg-white rounded-full transition-all duration-300 ${
                          openSectionId === id ? "w-full" : "group-hover:w-1/2"
                        }`}
                      ></div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {/* Sidebar Footer */}
          <div className="mt-10 sm:mt-12 p-4 sm:p-6 bg-gradient-to-br from-brand-primary-50 to-brand-secondary-50 dark:from-brand-primary-900/20 dark:to-brand-secondary-900/20 rounded-2xl border border-brand-primary-200 dark:border-brand-primary-800 text-center">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-accent-500 to-brand-primary-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-sm">💫</span>
            </div>
            <p className="text-xs text-txt-muted-light dark:text-txt-muted-dark">
              Need help? Check our support docs or contact the team.
            </p>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="sticky top-16 lg:hidden z-30 bg-bg-primary-light/98 dark:bg-bg-primary-dark/98 backdrop-blur-2xl border-b-2 border-bg-accent-light dark:border-bg-accent-dark">
        <div className="flex top-4 items-center justify-between px-4 sm:px-6 py-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 sm:p-3 rounded-2xl hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition-all duration-300 hover:scale-110"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 text-txt-primary-light dark:text-txt-primary-dark"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <h1 className="text-lg sm:text-xl font-brand font-bold bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 bg-clip-text text-transparent">
              YojanaDesk Docs
            </h1>
          </div>
          <div className="w-10 sm:w-12"></div>
        </div>
      </header>

      {/* Main Content - Properly offset */}
      <main className="pt-16 lg:ml-72 xl:ml-80 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 py-10 sm:py-12 lg:py-20">
          {/* Hero Section */}
          <div
            className={`text-center mb-16 sm:mb-20 px-2 md:px-0 ${
              animateOnScroll ? "animate-fade-in" : "opacity-0"
            }`}
          >
            <div className="relative">
              {/* Removed purple blur div */}
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-brand-primary-100 via-brand-secondary-100 to-brand-accent-100 dark:from-brand-primary-900/30 dark:via-brand-secondary-900/30 dark:to-brand-accent-900/30 px-6 py-3 rounded-full mb-8 border border-brand-primary-200 dark:border-brand-primary-700 mx-auto max-w-max">
                  <span className="w-3 h-3 bg-brand-primary-500 rounded-full animate-pulse"></span>
                  <span className="text-brand-primary-700 dark:text-brand-primary-300 font-semibold text-sm sm:text-base">
                    Documentation{" "}
                  </span>
                  <span
                    className="w-3 h-3 bg-brand-accent-500 rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></span>
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-brand font-bold mb-6 sm:mb-8 leading-tight">
                  <span
                    className="bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-500 bg-clip-text text-transparent"
                    style={{
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      paddingLeft: "1px",
                    }}
                  >
                    YojanaDesk
                  </span>
                </h1>

                <p className="text-base sm:text-xl text-txt-secondary-light dark:text-txt-secondary-dark max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
                  Master project collaboration with AI-driven insights, seamless
                  GitHub integration, and powerful team management tools.
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {["AI-Powered", "GitHub Ready", "Team Focused"].map(
                    (tag, index) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-gradient-to-r from-brand-primary-500/10 to-brand-secondary-500/10 border border-brand-primary-200 dark:border-brand-primary-700 rounded-full text-xs sm:text-sm font-medium text-brand-primary-700 dark:text-brand-primary-300"
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-10 sm:space-y-12">
            {sections.map(({ id, title, icon, content }, index) => (
              <section
                key={id}
                id={id}
                className={`transition-all duration-1000 px-2 md:px-0 ${
                  animateOnScroll
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <AccordionSection
                  section={{ title, icon }}
                  isOpen={openSectionId === id}
                  onToggle={() =>
                    setOpenSectionId(openSectionId === id ? null : id)
                  }
                >
                  {title === "User Roles" ? (
                    <div className="grid gap-6 md:grid-cols-3 mt-4 md:mt-6">
                      {roles.map(
                        (
                          { name, icon, description, details, gradient },
                          roleIndex
                        ) => (
                          <div
                            key={name}
                            className="group relative overflow-hidden bg-gradient-to-br from-bg-accent-light to-bg-secondary-light dark:from-bg-accent-dark dark:to-bg-secondary-dark rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-2 border-bg-accent-light dark:border-bg-accent-dark hover:border-brand-primary-200 dark:hover:border-brand-primary-700"
                            style={{ animationDelay: `${roleIndex * 100}ms` }}
                          >
                            {/* Removed purple blur div */}
                            <div className="relative z-10">
                              <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
                                <div
                                  className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${gradient} rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                                >
                                  <span className="text-2xl md:text-3xl">
                                    {icon}
                                  </span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark group-hover:bg-gradient-to-r group-hover:from-brand-primary-600 group-hover:to-brand-secondary-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                  {name}
                                </h3>
                              </div>
                              <p className="text-txt-secondary-light dark:text-txt-secondary-dark mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                                {description}
                              </p>
                              <ul className="space-y-2 md:space-y-3">
                                {details.map((item, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start space-x-2 md:space-x-3 text-sm md:text-base text-txt-primary-light dark:text-txt-primary-dark leading-relaxed"
                                  >
                                    <div className="w-2 h-2 bg-brand-primary-500 rounded-full mt-1 flex-shrink-0"></div>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : title === "Features" ? (
                    <div className="space-y-8 md:space-y-10 mt-4 md:mt-8">
                      {features.map(
                        (
                          { name, icon, description, points, gradient },
                          featureIndex
                        ) => (
                          <div
                            key={name}
                            className="group relative overflow-hidden bg-gradient-to-br from-bg-accent-light via-bg-secondary-light to-bg-primary-light dark:from-bg-accent-dark dark:via-bg-secondary-dark dark:to-bg-primary-dark rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] border-2 border-bg-accent-light dark:border-bg-accent-dark"
                            style={{
                              animationDelay: `${featureIndex * 150}ms`,
                            }}
                          >
                            {/* Removed purple blur div */}
                            <div className="relative z-10">
                              <div className="flex items-center space-x-4 md:space-x-6 mb-6 md:mb-8">
                                <div
                                  className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${gradient} rounded-3xl flex items-center justify-center text-2xl md:text-3xl shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                                >
                                  {icon}
                                </div>
                                <div>
                                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark group-hover:bg-gradient-to-r group-hover:from-brand-primary-600 group-hover:to-brand-secondary-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 mb-1 md:mb-2">
                                    {name}
                                  </h3>
                                  <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-base md:text-lg">
                                    {description}
                                  </p>
                                </div>
                              </div>
                              <div className="grid gap-3 md:gap-4">
                                {points.map((point, i) => (
                                  <div
                                    key={i}
                                    className="flex items-start space-x-3 p-4 rounded-2xl bg-bg-primary-light/80 dark:bg-bg-primary-dark/80 hover:bg-bg-primary-light dark:hover:bg-bg-primary-dark transition-all duration-300"
                                  >
                                    <div className="w-3 h-3 bg-brand-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-txt-primary-light dark:text-txt-primary-dark leading-relaxed text-sm md:text-base">
                                      {point}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : title === "GitHub Setup" ? (
                    <div className="mt-4 md:mt-8 px-2 md:px-0">
                      <div className="bg-gradient-to-br from-bg-accent-light via-bg-secondary-light to-bg-primary-light dark:from-bg-accent-dark dark:via-bg-secondary-dark dark:to-bg-primary-dark rounded-3xl p-6 md:p-10 shadow-xl border-2 border-bg-accent-light dark:border-bg-accent-dark">
                        <div className="flex items-center space-x-3 md:space-x-4 mb-6 md:mb-8">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-3xl flex items-center justify-center shadow-xl">
                            <span className="text-white text-xl md:text-2xl">
                              🔗
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl md:text-2xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark mb-1 md:mb-2">
                              Step-by-Step Integration Guide
                            </h3>
                            <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-sm md:text-base">
                              Connect your GitHub repository seamlessly
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                          {[
                            "Navigate to your project's Integrations tab and enter your GitHub repository URL.",
                            "Generate a secret key and copy both the secret URL and secret value.",
                            "Go to GitHub > Repository Settings > Webhooks > Add Webhook.",
                            "Paste the secret URL as the Payload URL and the secret key in the Secret field.",
                            "Select content type as application/json and enable the events you want to trigger the webhook.",
                            "Save the webhook and follow any additional on-screen instructions in YojanaDesk.",
                          ].map((step, index) => (
                            <div
                              key={index}
                              className="group flex items-start space-x-4 p-4 md:p-6 bg-bg-primary-light/80 dark:bg-bg-primary-dark/80 rounded-2xl hover:bg-bg-primary-light dark:hover:bg-bg-primary-dark transition-all duration-300 hover:scale-[1.01]"
                            >
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-white font-bold text-base md:text-lg">
                                  {index + 1}
                                </span>
                              </div>
                              <p className="text-txt-primary-light dark:text-txt-primary-dark leading-relaxed text-sm md:text-base">
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-brand-primary-50 via-brand-secondary-50 to-brand-accent-50 dark:from-brand-primary-900/20 dark:via-brand-secondary-900/20 dark:to-brand-accent-900/20 rounded-2xl border-l-4 border-brand-primary-500">
                          <div className="flex items-start space-x-3">
                            <div className="w-7 h-7 md:w-8 md:h-8 bg-brand-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm md:text-base">
                                💡
                              </span>
                            </div>
                            <p className="text-brand-primary-800 dark:text-brand-primary-200 leading-relaxed text-sm md:text-base">
                              <strong>Pro Tip:</strong> Make sure your
                              repository has appropriate permissions set for
                              webhook functionality. Test the connection after
                              setup to ensure everything works properly.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 md:mt-8">{content}</div>
                  )}
                </AccordionSection>
              </section>
            ))}
          </div>
        </div>
      </main>

      <style>{`
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.8s ease-out forwards;
  }
`}</style>
    </div>
  );
}
