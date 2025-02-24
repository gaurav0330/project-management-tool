import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../../components/Other/NavBar';
import Sidebar from '../../components/Other/sideBar';
import ManageTask from '../../components/tasks/ManageTask';
import AssignTask from '../../components/tasks/AssignTask';
import ProjectForm from '../../components/projects/ProjectComponent/projectForm';
import CreateProject from '../../components/projects/CreateProject';

const ProjectDashboard = () => {
  return (
    // <Box display="flex" flexDirection="column" height="100vh">
    //   <Navbar />
    //   <Box display="flex" flex="1">
    //     <Sidebar />
    //     <Box flex="1" p={3}>
    //       {/* 
    //        */}
          
    //        {/* <ProjectForm /> */}
    //     </Box>
    //   </Box>
    // </Box>
    // <AssignTask />
    <CreateProject />
  );
};

export default ProjectDashboard;
