import React from "react";
import { useParams } from "react-router-dom";
import AssignTeamLead from "../../components/tasks/AssignTeamLead";

const AssignLeadPage = () => {
  const { projectId } = useParams();  // ✅ Extract projectId from the URL

  console.log("✅ Project ID from URL params:", projectId);

  if (!projectId) {
    return <p className="text-red-500">Error: Invalid Project ID</p>;
  }

  return <AssignTeamLead projectId={projectId} />;
};

export default AssignLeadPage;
