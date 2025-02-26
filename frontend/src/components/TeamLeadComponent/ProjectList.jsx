import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectList = ({ projects }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
