import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../../components/Other/NavBar';
import Sidebar from '../../components/Other/sideBar';
import ManageTask from '../../components/tasks/ManageTask';

const ProjectDashboard = () => {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Navbar />
      <Box display="flex" flex="1">
        <Sidebar />
        <Box flex="1" p={3}>
          <ManageTask />
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectDashboard;
