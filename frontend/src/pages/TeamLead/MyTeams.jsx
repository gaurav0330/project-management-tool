import React, { useState } from "react";
import { FaPlus, FaUserPlus, FaEllipsisH } from "react-icons/fa";

const teams = [
  {
    name: "Design Team",
    createdAt: "Jan 15, 2025",
    description: "Our creative team responsible for UI/UX design and brand identity.",
    members: ["https://i.pravatar.cc/40?img=1", "https://i.pravatar.cc/40?img=2"],
    memberCount: 2,
  },
  {
    name: "Development Team",
    createdAt: "Jan 10, 2025",
    description: "Frontend and backend development team for our main product.",
    members: ["https://i.pravatar.cc/40?img=3", "https://i.pravatar.cc/40?img=4", "https://i.pravatar.cc/40?img=5"],
    memberCount: 4,
  },
  {
    name: "Marketing Team",
    createdAt: "Jan 5, 2025",
    description: "Digital marketing and growth team focused on user acquisition.",
    members: ["https://i.pravatar.cc/40?img=6", "https://i.pravatar.cc/40?img=7"],
    memberCount: 3,
  },
];

const MyTeams = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl p-6 mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Teams Dashboard</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg">
            <FaPlus /> Create Team
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3 p-2 border rounded-md"
          />
          <div className="flex gap-4">
            <select className="p-2 border rounded-md">
              <option>Sort by</option>
            </select>
            <select className="p-2 border rounded-md">
              <option>All Teams</option>
            </select>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {teams
            .filter((team) => team.name.toLowerCase().includes(search.toLowerCase()))
            .map((team, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{team.name}</h3>
                  <FaEllipsisH className="text-gray-500 cursor-pointer" />
                </div>
                <p className="mb-2 text-sm text-gray-500">Created {team.createdAt}</p>
                <p className="mb-3 text-gray-700">{team.description}</p>
                <div className="flex items-center gap-2">
                  {team.members.map((member, idx) => (
                    <img
                      key={idx}
                      src={member}
                      alt="member"
                      className="w-8 h-8 -ml-2 border-2 border-white rounded-full first:ml-0"
                    />
                  ))}
                  <span className="text-sm text-gray-500">+{team.memberCount}</span>
                  <button className="flex items-center gap-1 ml-auto text-blue-600">
                    <FaUserPlus /> Invite
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyTeams;
