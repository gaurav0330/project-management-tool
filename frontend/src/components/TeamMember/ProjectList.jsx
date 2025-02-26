import ProjectCard from "../TeamMember/ProjectCard";

export default function ProjectList({ projects }) {
  return (
    <div className="grid grid-cols-3 gap-6 mt-6">
      {projects.length > 0 ? (
        projects.map((project) => <ProjectCard key={project.id} project={project} />)
      ) : (
        <p className="text-gray-500 col-span-3 text-center">No projects found.</p>
      )}
    </div>
  );
}
