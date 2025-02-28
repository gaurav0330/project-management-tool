import React, { useState } from "react";
import Header from "../../components/TeamLeadComponent/Header";
import Filters from "../../components/TeamLeadComponent/Filters";
import ProjectList from "../../components/TeamLeadComponent/ProjectList";

const TeamLeadDashboard = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const projects = [
    {
      title: "Website Redesign",
      status: "Active",
      description: "Redesigning the company website with modern UI/UX.",
      team: [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/2.jpg",
        "https://randomuser.me/api/portraits/men/3.jpg",
      ],
      dates: "Jan 15 - Mar 30",
    },
    {
      title: "Mobile App Development",
      status: "On Hold",
      description: "Creating a new mobile application for iOS and Android.",
      team: [
        "https://randomuser.me/api/portraits/men/4.jpg",
        "https://randomuser.me/api/portraits/women/5.jpg",
      ],
      dates: "Feb 1 - Apr 15",
    },
    {
      title: "Marketing Campaign",
      status: "Completed",
      description: "Q1 2025 Digital Marketing Campaign for product launch.",
      team: [
        "https://randomuser.me/api/portraits/men/6.jpg",
        "https://randomuser.me/api/portraits/women/7.jpg",
        "https://randomuser.me/api/portraits/men/8.jpg",
      ],
      dates: "Jan 1 - Mar 15",
    },
  ];

  const filteredProjects = projects.filter((project) => {
    return (
      (statusFilter === "All" || project.status === statusFilter) &&
      project.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Header />
      
      <Filters search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      <ProjectList projects={filteredProjects} />
    </div>
  );
};

export default TeamLeadDashboard;
