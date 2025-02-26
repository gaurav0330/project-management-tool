import Attachments from "./Attachments";
import Feedback from "./Feedback";

export default function TaskDetails({ task }) {
  if (!task) return <p>Select a task to view details</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
      <p className="text-sm text-gray-600">
        <strong>Assigned To:</strong> {task.assignedTo}
      </p>
      <p className="text-sm">
        <strong>Deadline:</strong> {task.deadline}
      </p>
      <p className="mt-2 text-gray-700">{task.description}</p>

      <Attachments files={task.attachments} />
      <Feedback />
    </div>
  );
}
