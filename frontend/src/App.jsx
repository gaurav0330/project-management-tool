import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Home/Dashboard';


import Navbar from './components/Other/NavBar';

import ProjectDashboard from './pages/ProjectManager/ProjectDashboardPage';
import AssignLeadPage from './pages/ProjectManager/AssignTeamLeadPage';
import SignUpPage from './pages/Auth/Signup/SignupPage';
import Footer from './components/Other/Footer';
import LoginPage from './pages/Auth/Login/Login';
import CreateProjectPage from '../src/pages/ProjectManager/CreateProjectPage'
import AssignTaskPage from './pages/ProjectManager/AssignTaskPage';
import TaskApprovalPage from './pages/ProjectManager/TaskApprovalPage';
import TeamMemberDashboardPage from './pages/TeamMember/teamMemberDashboardPage';
import MyTasksPage from './pages/TeamMember/MyTasksPage';
import TaskSubmissionPage from './pages/TeamMember/TaskSubmissionPage';
import TeamLeadDashboard from '../src/pages/TeamLead/TeamLeadDashboard';
import TaskManagementPage from './pages/TeamLead/TaskManagementPage';
import DisplayTeamTaskPage from './pages/TeamLead/DisplayTeamTaskPage';
import TaskDistributionPage from './pages/TeamLead/TaskDistributionPage';


// for protected routes synatx
{/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content mt-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
     
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
     {/* peoject manager */}
          <Route path="/projectDashboard" element={<ProjectDashboard />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/createproject" element={< CreateProjectPage/>} />
          <Route path="/assignLead" element={< AssignLeadPage/>} />
          <Route path="/assigntask" element={< AssignTaskPage/>} />
          <Route path="/taskapproval" element={< TaskApprovalPage/>} />
         
          {/* team member */}
          <Route path="/teammemberdashboard" element={< TeamMemberDashboardPage/>} />
          <Route path="/teammembertask" element={< MyTasksPage/>} />
          <Route path="/teammembertasksubmission" element={< TaskSubmissionPage/>} />
          
          {/* Team lead */}
          <Route path="/teamleaddashboard" element={< TeamLeadDashboard/>} />
          <Route path="/teamleadtaskm" element={<   TaskManagementPage/>} />
          <Route path="/teamleadteamtask" element={< DisplayTeamTaskPage/>} />
          <Route path="/teamleadtaskDis" element={<TaskDistributionPage/>} />    

        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
