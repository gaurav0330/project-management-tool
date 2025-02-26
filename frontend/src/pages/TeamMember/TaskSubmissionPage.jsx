import React, { useState } from "react";
import TaskHeader from "../../components/TeamMember/TaskHeader";
import ProgressBar from "../../components/TeamMember/ProgressBar";
import FileUpload from "../../components/TeamMember/FileUpload";
import AttachmentList from "../../components/TeamMember/Attachment";
import { useNavigate } from "react-router-dom";

const TaskSubmissionPage = () => {
  const [progress, setProgress] = useState(75);
  const [status, setStatus] = useState("In Progress");
  const [files, setFiles] = useState([
    { name: "design-mockup.fig", size: 2.4 * 1024 * 1024 },
    { name: "requirements.pdf", size: 1.8 * 1024 * 1024 },
  ]);

  const navigate = useNavigate();

  const handleFileUpload = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDeleteFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-4">
      <button  onClick={()=>{
        navigate('/teammemberdashboard') 
      }}> submit  </button>
      <TaskHeader
        title="Website Redesign Project"
        dueDate="Mar 15, 2025"
        priority="High Priority"
        teamMembers={[
          "https://randomuser.me/api/portraits/men/1.jpg",
          "https://randomuser.me/api/portraits/women/2.jpg",
          "https://randomuser.me/api/portraits/men/3.jpg",
        ]}
      />
      <ProgressBar progress={progress} status={status} setStatus={setStatus} />
      <FileUpload onFileUpload={handleFileUpload} />
      <AttachmentList files={files} onDelete={handleDeleteFile} />
    </div>
  );
};

export default TaskSubmissionPage;
