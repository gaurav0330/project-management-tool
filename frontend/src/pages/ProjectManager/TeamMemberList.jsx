import { useQuery, gql } from "@apollo/client";

const GET_MEMBERS_BY_PROJECT_ID = gql`
  query GetMembersByProjectId($projectId: ID!) {
    getMembersByProjectId(projectId: $projectId) {
      success
      message
      members {
        id
        username
        email
        role
      }
    }
  }
`;

const TeamMembersList = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_MEMBERS_BY_PROJECT_ID, {
    variables: { projectId }, // ✅ Dynamically passing projectId
  });

  if (loading) return <p className="text-center text-gray-500">Loading team members...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const { success, message, members } = data?.getMembersByProjectId || {};

  console.log("Fetched Members:", members); // ✅ Debugging

  if (!success) return <p className="text-red-500">{message}</p>;

  // ✅ Remove duplicate team members based on user ID
  const uniqueMembers = Array.from(new Map(members.map((member) => [member.id, member])).values());

  return (
    <div className="max-w-3xl p-6 mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Assigned Team Members</h2>
      {uniqueMembers.length === 0 ? (
        <p className="text-gray-500">No team members assigned yet.</p>
      ) : (
        <ul className="space-y-4">
          {uniqueMembers.map((member) => (
            <li key={member.id} className="p-4 border rounded-lg shadow-md bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700">{member.username}</h3>
              <p className="text-sm text-gray-500">Role: {member.role}</p>
              <p className="text-sm text-gray-500">Email: {member.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeamMembersList;
