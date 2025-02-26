import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project }) {
const navigate = useNavigate();

    return (
      <div className="p-4 bg-white shadow rounded-lg">
        <div className="flex justify-between">
          <h3 className="font-semibold">{project.title}</h3>
          <span
            className={`px-2 py-1 text-sm font-semibold rounded ${
              project.status === "Active" ? "bg-green-100 text-green-700"
              : project.status === "On Hold" ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
            }`}
          >
            {project.status}
          </span>
        </div>
        <p className="text-gray-600 mt-2">{project.description}</p>
        
        <div className="flex items-center mt-2">
          {project.members.slice(0, 3).map((member, index) => (
            <span key={index} className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold -ml-2">
              {member[0]}
            </span>
          ))}
          {project.members.length > 3 && (
            <span className="ml-2 text-gray-500 text-sm">+{project.members.length - 3} more</span>
          )}
        </div>
  
        <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
          <p>📅 {project.startDate} - {project.endDate}</p>
          <button className="text-blue-600 font-semibold"
          onClick={()=>{
            navigate('/teammembertask')
          }}
          >View Details</button>
        </div>
      </div>
    );
  }
  