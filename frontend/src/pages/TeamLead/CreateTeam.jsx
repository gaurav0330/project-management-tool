import React, { useState } from "react";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([{ email: "", role: "Member" }]);
  const [isPublic, setIsPublic] = useState(false);
  const [allowInvites, setAllowInvites] = useState(false);

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const addMember = () => {
    setMembers([...members, { email: "", role: "Member" }]);
  };

  const removeMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-2 text-2xl font-semibold">Create New Team</h2>
        <p className="mb-4 text-gray-600">
          Set up your team and invite members to collaborate
        </p>

        {/* Team Name Input */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Team Name*</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Description</label>
          <textarea
            className="w-full p-2 border rounded-md"
            placeholder="Describe your team’s purpose"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Invite Members */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Invite Team Members</label>
          {members.map((member, index) => (
            <div key={index} className="flex items-center mb-2 space-x-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="flex-1 p-2 border rounded-md"
                value={member.email}
                onChange={(e) => handleMemberChange(index, "email", e.target.value)}
              />
              <select
                className="p-2 border rounded-md"
                value={member.role}
                onChange={(e) => handleMemberChange(index, "role", e.target.value)}
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
              {members.length > 1 && (
                <button
                  className="text-red-500"
                  onClick={() => removeMember(index)}
                >
                  🗑
                </button>
              )}
            </div>
          ))}
          <button onClick={addMember} className="text-sm text-blue-600">
            + Add another member
          </button>
        </div>

        {/* Team Settings */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Team Settings</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
            />
            <span>Make this team public</span>
          </div>
          <div className="flex items-center mt-2 space-x-2">
            <input
              type="checkbox"
              checked={allowInvites}
              onChange={() => setAllowInvites(!allowInvites)}
            />
            <span>Allow members to invite others</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded">Create Team</button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
