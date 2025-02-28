import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/Other/NavBar';
import Footer from './components/Other/Footer';
import ProtectedRoute from './components/protectedRoute';  // ✅ Import ProtectedRoute
import { useAuth } from './components/authContext';  // ✅ Import Auth Context

import Dashboard from './pages/Home/Dashboard';
import SignUpPage from './pages/Auth/Signup/SignupPage';
import LoginPage from './pages/Auth/Login/Login';
  // ✅ Unauthorized page

// Project Manager Pages
import ProjectDashboard from './pages/ProjectManager/ProjectDashboardPage';
import AssignLeadPage from './pages/ProjectManager/AssignTeamLeadPage';
import CreateProjectPage from './pages/ProjectManager/CreateProjectPage';
import AssignTaskPage from './pages/ProjectManager/AssignTaskPage';
import TaskApprovalPage from './pages/ProjectManager/TaskApprovalPage';

// Team Member Pages
import TeamMemberDashboardPage from './pages/TeamMember/teamMemberDashboardPage';
import MyTasksPage from './pages/TeamMember/MyTasksPage';
import TaskSubmissionPage from './pages/TeamMember/TaskSubmissionPage';

// Team Lead Pages
import TeamLeadDashboard from './pages/TeamLead/TeamLeadDashboard';
import TaskManagementPage from './pages/TeamLead/TaskManagementPage';
import DisplayTeamTaskPage from './pages/TeamLead/DisplayTeamTaskPage';
import TaskDistributionPage from './pages/TeamLead/TaskDistributionPage';

function App() {
  const { userRole } = useAuth();  // ✅ Get user role

  return (
    <Router>
      <Navbar />
      <div className="mt-16 main-content">
        <Routes>
          {/* 🟢 Public Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/" element={< />} /> */}

          {/* 🔴 Protected Routes */}
          
          {/* Project Manager Only */}
          <Route path="/projectDashboard" element={<ProtectedRoute allowedRoles={["Project_Manager"]}><ProjectDashboard /></ProtectedRoute>} />
          <Route path="/createproject" element={<ProtectedRoute allowedRoles={["Project_Manager"]}><CreateProjectPage /></ProtectedRoute>} />
          <Route path="/assignLead" element={<ProtectedRoute allowedRoles={["Project_Manager"]}><AssignLeadPage /></ProtectedRoute>} />
          <Route path="/assigntask" element={<ProtectedRoute allowedRoles={["Project_Manager"]}><AssignTaskPage /></ProtectedRoute>} />
          <Route path="/taskapproval" element={<ProtectedRoute allowedRoles={["Project_Manager"]}><TaskApprovalPage /></ProtectedRoute>} />
          
          {/* Team Member Only */}
          <Route path="/teammemberdashboard" element={<ProtectedRoute allowedRoles={["Team_Member"]}><TeamMemberDashboardPage /></ProtectedRoute>} />
          <Route path="/teammembertask" element={<ProtectedRoute allowedRoles={["Team_Member"]}><MyTasksPage /></ProtectedRoute>} />
          <Route path="/teammembertasksubmission" element={<ProtectedRoute allowedRoles={["Team_Member"]}><TaskSubmissionPage /></ProtectedRoute>} />
          
          {/* Team Lead Only */}
          <Route path="/teamleaddashboard" element={<ProtectedRoute allowedRoles={["Team_Lead"]}><TeamLeadDashboard /></ProtectedRoute>} />
          <Route path="/teamleadtaskm" element={<ProtectedRoute allowedRoles={["Team_Lead"]}><TaskManagementPage /></ProtectedRoute>} />
          <Route path="/teamleadteamtask" element={<ProtectedRoute allowedRoles={["Team_Lead"]}><DisplayTeamTaskPage /></ProtectedRoute>} />
          <Route path="/teamleadtaskDis" element={<ProtectedRoute allowedRoles={["Team_Lead"]}><TaskDistributionPage /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
