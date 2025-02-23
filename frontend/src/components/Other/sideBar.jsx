import { useState } from 'react';
import { 
  MdDashboard,
  MdAssignment,
  MdPeople,
  MdCalendarToday,
  MdSettings,
  MdMenu,
  MdClose,
  MdNotifications,
  MdBarChart,
  MdFolderOpen,
  MdDescription,
  MdTimeline,
  MdAttachMoney,
  MdInsights,
  MdMessage,
  MdArchive,
  MdSupportAgent,
  MdBuild
} from 'react-icons/md';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      category: "Overview",
      items: [
        { name: 'Dashboard', icon: MdDashboard },
        { name: 'Analytics', icon: MdInsights },
        { name: 'Reports', icon: MdBarChart },
      ]
    },
    {
      category: "Project Management",
      items: [
        { name: 'Projects', icon: MdFolderOpen },
        { name: 'Tasks', icon: MdAssignment },
        { name: 'Timeline', icon: MdTimeline },
        { name: 'Documents', icon: MdDescription },
      ]
    },
    {
      category: "Team & Communication",
      items: [
        { name: 'Team Members', icon: MdPeople },
        { name: 'Messages', icon: MdMessage },
        { name: 'Calendar', icon: MdCalendarToday },
        { name: 'Meetings', icon: MdPeople },
      ]
    },
    {
      category: "Resources",
      items: [
        { name: 'Budget', icon: MdAttachMoney },
        { name: 'Resources', icon: MdBuild },
        { name: 'Archives', icon: MdArchive },
      ]
    },
    {
      category: "System",
      items: [
        { name: 'Notifications', icon: MdNotifications },
        { name: 'Support', icon: MdSupportAgent },
        { name: 'Settings', icon: MdSettings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-primary-600 text-white lg:hidden hover:bg-primary-700"
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          w-64 z-40 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-center h-16 bg-primary-600">
          <h1 className="text-xl font-bold text-white">Project Manager</h1>
        </div>

        {/* Navigation with scroll */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-4">
            {menuItems.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-6">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
                  {category.category}
                </h2>
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <a
                      key={itemIndex}
                      href="#"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-600 transition-colors duration-200 rounded-lg hover:bg-primary-50 hover:text-primary-600 group"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile - Fixed at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-semibold">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">Project Manager</p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-gray-100">
              <MdSettings className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;