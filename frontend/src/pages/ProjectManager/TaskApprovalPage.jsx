import { useState } from "react";
import TaskList from "../../components/tasks/TaskList";
import TaskDetails from "../../components/tasks/TaskDetails";
import Sidebar from "../../components/Other/sideBar";

const tasks = [
    {
      id: 1,
      title: "Website Redesign Homepage",
      assignedTo: "Sarah Miller",
      submittedDate: "Jan 15, 2025",
      deadline: "January 20, 2025",
      description: "Complete redesign of the company website homepage following the new brand guidelines and improving user experience.",
      status: "Pending",
      attachments: [
        { name: "Design Specs.pdf", size: "2.4 MB", type: "pdf" },
        { name: "Preview.jpg", size: "1.8 MB", type: "image" },
      ],
    },
    {
      id: 2,
      title: "Mobile App UI Components",
      assignedTo: "John Cooper",
      submittedDate: "Jan 14, 2025",
      deadline: "January 18, 2025",
      description: "Develop UI components for the mobile application as per the new design system.",
      status: "Approved",
      attachments: [],
    },
  ];
  
  export default function TaskApprovalPage() {
    const [selectedTask, setSelectedTask] = useState(tasks[0]);
  
    return (
      <div className="flex h-screen">
    
        {/* Main content takes remaining width */}
        <div className="flex-1 flex p-4 bg-gray-100">
          <div className="w-1/3 p-4 bg-white rounded-lg shadow">
            <TaskList tasks={tasks} onSelectTask={setSelectedTask} />
          </div>
          <div className="w-2/3 p-4 bg-white rounded-lg shadow ml-4">
            <TaskDetails task={selectedTask} />
          </div>
        </div>
      </div>
    );
  }