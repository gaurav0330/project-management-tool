import { useQuery, gql } from "@apollo/client";

const GET_LEADS_BY_PROJECT_ID = gql`
  query GetLeadsByProjectId($projectId: ID!) {
    getLeadsByProjectId(projectId: $projectId) {
      success
      message
      teamLeads {
        teamLeadId
        leadRole
        user {
          id
          username
          email
          role
        }
      }
    }
  }
`;

const TeamLeadsList = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_LEADS_BY_PROJECT_ID, {
    variables: { projectId },
  });

  if (loading) return <p className="text-center text-gray-500">Loading team leads...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const { success, message, teamLeads } = data.getLeadsByProjectId;

  if (!success) return <p className="text-red-500">{message}</p>;

  // Remove duplicate team leads based on user ID
  const uniqueTeamLeads = Array.from(new Map(teamLeads.map((lead) => [lead.user.id, lead])).values());

  return (
    <div className="max-w-3xl p-6 mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Assigned Team Leads</h2>
      {uniqueTeamLeads.length === 0 ? (
        <p className="text-gray-500">No team leads assigned yet.</p>
      ) : (
        <ul className="space-y-4">
          {uniqueTeamLeads.map((lead) => (
            <li key={lead.teamLeadId} className="p-4 border rounded-lg shadow-md bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700">{lead.user.username}</h3>
              <p className="text-sm text-gray-500">Role: {lead.user.role}</p>
              <p className="text-sm text-gray-500">Email: {lead.user.email}</p>
              <p className="text-sm font-medium text-blue-600">Lead Role: {lead.leadRole}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeamLeadsList;
