import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import Navbar from './components/Other/NavBar';
import Footer from './components/Other/Footer';
import ProtectedRoute from './components/protectedRoute';
import { useAuth } from './components/authContext';
import { useTheme } from './contexts/ThemeContext';

import Dashboard from './pages/Home/Dashboard';
import SignUpPage from './pages/Auth/Signup/SignupPage';
import LoginPage from './pages/Auth/Login/Login';

// Project Manager Pages
import ProjectDashboard from './pages/ProjectManager/ProjectDashboardPage';
import AssignLeadPage from './pages/ProjectManager/AssignTeamLeadPage';
import CreateProjectPage from './pages/ProjectManager/CreateProjectPage';
import AssignTaskPage from './pages/ProjectManager/AssignTaskPage';
import TaskApprovalPage from './pages/ProjectManager/TaskApprovalPage';
import ProjectHomePage from './pages/ProjectManager/ProjectHomePage';
// import ProjectManagerChat from './pages/ProjectManager/Chat';

// Team Member Pages
import TeamMemberDashboardPage from './pages/TeamMember/TeamMemberDashboardPage';
import MyTasksPage from './pages/TeamMember/MyTasksPage';
import TaskSubmissionPage from './pages/TeamMember/TaskSubmissionMemberPage';
import TeamMemberHome from './pages/TeamMember/TeamMemberHome';
// import TeamMemberChat from './pages/TeamMember/Chat';

// Team Lead Pages
import TeamLeadDashboard from './pages/TeamLead/teamLeadDashboard';
import TaskManagementPage from './pages/TeamLead/TaskManagementPage';
import DisplayTeamTaskPage from './pages/TeamLead/DisplayTeamTaskPage';
import TaskDistributionPage from './pages/TeamLead/TaskDistributionPage';
import LeadProjectHome from './pages/TeamLead/LeadProjectHomePage';
import TeamDetails from './pages/TeamLead/TeamDetails';
// import TeamLeadChat from './pages/TeamLead/Chat';

import CreateGroupPage from './pages/Chat/CreateGroup';
import ChatPage from './pages/Chat/ChatPage';

import Chat from './pages/Chat';

// ✅ ADD THIS - Import your VideoCall component
import VideoCall from './components/VideoCall/VideoCall'; // Adjust path as needed

import { Toaster } from 'react-hot-toast';

function App() {
  const { userRole } = useAuth();
  const { isDark, theme } = useTheme();
  const location = useLocation();

  const hideFooterRoutes = [
    "/login", 
    "/signup",
    "/projectDashboard",
    "/teammemberdashboard",
    "/teamleaddashboard",
    "/projectHome",
    "/teamLead",
    "/teamlead/project",
    "/teamMember/project",
    "/teammembertasksubmission",
    "/chat",
    "/videocall" // ✅ ADD THIS - Hide footer for video calls
  ];

  const containerRoutes = [
    "/projectDashboard",
    "/createproject",
    "/assigntask",
    "/taskapproval",
    "/teammemberdashboard",
    "/teammembertask",
    "/teamleaddashboard",
    "/teamleadtaskm",
    "/teamleadteamtask",
    "/teamleadtaskDis",
    "/create-group",
    "/chat"
    // Note: Don't add /videocall here as it uses full screen layout
  ];

  const shouldHideFooter = hideFooterRoutes.some(route => location.pathname.startsWith(route));
  const shouldUseContainer = containerRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="page-bg min-h-screen">
      <Navbar />
      <Toaster position="top-right" />
      <main className={`mt-8 main-content ${shouldUseContainer ? 'px-4 sm:px-24 md:px-24 section-padding' : ''}`}>
        <Routes>
          {/* 🟢 Public Routes */}
          <Route path="/*" element={<Dashboard />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 🔵 Project Manager Only Routes */}
          <Route 
            path="/projectDashboard" 
            element={
              <ProtectedRoute allowedRoles={["Project_Manager"]}>
                <ProjectDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/createproject" 
            element={
              <ProtectedRoute allowedRoles={["Project_Manager"]}>
                <CreateProjectPage />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/assignLead/:projectId"
            element={
              <ProtectedRoute allowedRoles={["Project_Manager"]}>
                <AssignLeadPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/projectHome/:projectId" 
            element={
              <ProtectedRoute allowedRoles={["Project_Manager"]}>
                <ProjectHomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assigntask" 
            element={
              <ProtectedRoute allowedRoles={["Project_Manager"]}>
                <AssignTaskPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/taskapproval" 
            element={
              <ProtectedRoute allowedRoles={["Project_Manager"]}>
                <TaskApprovalPage />
              </ProtectedRoute>
            } 
          />
         

          {/* 🟠 Team Member Only Routes */}
          <Route 
            path="/teamMember/project/:projectId" 
            element={
              <ProtectedRoute allowedRoles={["Team_Member"]}>
                <TeamMemberHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teammemberdashboard" 
            element={
              <ProtectedRoute allowedRoles={["Team_Member"]}>
                <TeamMemberDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teammembertask" 
            element={
              <ProtectedRoute allowedRoles={["Team_Member"]}>
                <MyTasksPage />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/teammembertasksubmission/:projectId/:taskId"
            element={
              <ProtectedRoute allowedRoles={["Team_Member"]}>
                <TaskSubmissionPage />
              </ProtectedRoute>
            }
          />
          

          {/* 🟡 Team Lead Only Routes */}
          <Route 
            path="/teamleaddashboard" 
            element={
              <ProtectedRoute allowedRoles={["Team_Lead"]}>
                <TeamLeadDashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/teamLead/project/:projectId"
            element={
              <ProtectedRoute allowedRoles={["Team_Lead"]}>
                <LeadProjectHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teamlead/project/:projectId/:teamId"
            element={
              <ProtectedRoute allowedRoles={["Team_Lead"]}>
                <TeamDetails />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/teamleadtaskm" 
            element={
              <ProtectedRoute allowedRoles={["Team_Lead"]}>
                <TaskManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teamleadteamtask" 
            element={
              <ProtectedRoute allowedRoles={["Team_Lead"]}>
                <DisplayTeamTaskPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teamleadtaskDis" 
            element={
              <ProtectedRoute allowedRoles={["Team_Lead"]}>
                <TaskDistributionPage />
              </ProtectedRoute>
            } 
          />
         

          {/* 💬 Chat Routes */}
          <Route 
            path="/create-group" 
            element={
              <ProtectedRoute allowedRoles={["Team_Lead"]}>
                <CreateGroupPage />
              </ProtectedRoute>
            } 
          />
          {/* <Route path="/chat/:projectId" component={Chat} /> */}

          <Route 
            path="/chat/:projectId"
            element={
              <ProtectedRoute allowedRoles={["Project_Manager", "Team_Lead", "Team_Member"]}>
                <Chat />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/videocall" 
            element={
              <ProtectedRoute allowedRoles={["Project_Manager", "Team_Lead", "Team_Member"]}>
                <VideoCall />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
