import TaskCard from "./TaskCard";

export default function TaskList({ tasks, setTasks }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      {tasks.length > 0 ? (
        tasks.map((task) => <TaskCard key={task.id} task={task} setTasks={setTasks} />)
      ) : (
        <p className="text-center text-gray-500">No tasks found</p>
      )}
    </div>
  );
}
