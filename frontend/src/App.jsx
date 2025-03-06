import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import ProjectHomePage from './pages/ProjectManager/ProjectHomePage';

// Team Member Pages
import TeamMemberDashboardPage from './pages/TeamMember/TeamMemberDashboardPage';
import MyTasksPage from './pages/TeamMember/MyTasksPage';
import TaskSubmissionPage from './pages/TeamMember/TaskSubmissionMemberPage';
import TeamMemberHome from './pages/TeamMember/TeamMemberHome';

// Team Lead Pages
import TeamLeadDashboard from './pages/TeamLead/teamLeadDashboard';
import TaskManagementPage from './pages/TeamLead/TaskManagementPage';
import DisplayTeamTaskPage from './pages/TeamLead/DisplayTeamTaskPage';
import TaskDistributionPage from './pages/TeamLead/TaskDistributionPage';
import LeadProjectHome from './pages/TeamLead/LeadProjectHomePage';
import TeamDetails from './pages/TeamLead/Teamdetails';

function App() {
  const { userRole } = useAuth();  // ✅ Get user role


  const hideNavbarFooterRoutes = ["/login", "/signup"];
  return (

    <Router>
     <Navbar />

      {/* {!shouldHideNavbarFooter && <Navbar />} Show Navbar only if not hidden */}
      <div className="mt-16 main-content">
      
        <Routes>
          {/* 🟢 Public Routes */}
          <Route path="/*" element={<Dashboard />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/" element={< />} /> */}

          {/* Project Manager Only */}
          <Route path="/projectDashboard" element={<ProtectedRoute allowedRoles={["Project_Manager"]}><ProjectDashboard /></ProtectedRoute>} />
          <Route path="/createproject" element={<ProtectedRoute allowedRoles={["Project_Manager"]}><CreateProjectPage /></ProtectedRoute>} />
          <Route
            path="/assignLead/:projectId"
            element={
              <ProtectedRoute allowedRoles={["Project_Manager"]}>
                <AssignLeadPage />
              </ProtectedRoute>
            }
          />
          <Route path="/projectHome/:projectId" element={<ProtectedRoute allowedRoles={["Project_Manager"]}><ProjectHomePage /></ProtectedRoute>} />
          <Route path="/assigntask" element={<ProtectedRoute allowedRoles={["Project_Manager"]}><AssignTaskPage /></ProtectedRoute>} />
          <Route path="/taskapproval" element={<ProtectedRoute allowedRoles={["Project_Manager"]}><TaskApprovalPage /></ProtectedRoute>} />

          {/* Team Member Only */}
          <Route path="/teamMember/project/:projectId" element={<ProtectedRoute allowedRoles={["Team_Member"]}><TeamMemberHome /></ProtectedRoute>} />
          <Route path="/teammemberdashboard" element={<ProtectedRoute allowedRoles={["Team_Member"]}><TeamMemberDashboardPage /></ProtectedRoute>} />
          <Route path="/teammembertask" element={<ProtectedRoute allowedRoles={["Team_Member"]}><MyTasksPage /></ProtectedRoute>} />
          <Route
  path="/teammembertasksubmission/:projectId/:taskId"
  element={
    <ProtectedRoute allowedRoles={["Team_Member"]}>
      <TaskSubmissionPage/>
    </ProtectedRoute>
  }
/>

          {/* Team Lead Only */}
          <Route path="/teamleaddashboard" element={<ProtectedRoute allowedRoles={["Team_Lead"]}><TeamLeadDashboard /></ProtectedRoute>} />
          <Route
            path="/teamLead/project/:projectId"
            element={
              <ProtectedRoute allowedRoles={["Team_Lead"]}>
                <>
                  <LeadProjectHome />
                </>
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

          <Route path="/teamleadtaskm" element={<ProtectedRoute allowedRoles={["Team_Lead"]}><TaskManagementPage /></ProtectedRoute>} />
          <Route path="/teamleadteamtask" element={<ProtectedRoute allowedRoles={["Team_Lead"]}><DisplayTeamTaskPage /></ProtectedRoute>} />
          <Route path="/teamleadtaskDis" element={<ProtectedRoute allowedRoles={["Team_Lead"]}><TaskDistributionPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


//HIl hfsgh