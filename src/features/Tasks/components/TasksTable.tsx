import { Pencil, Trash2 } from "lucide-react";
import type { Task } from "../TasksSlice";

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskTable({ tasks, loading, onEdit, onDelete }: TaskTableProps) {
  if (loading)
    return (
      <div className="p-12 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading tasks...</p>
      </div>
    );

  if (tasks.length === 0)
    return <p className="text-center p-12">No tasks available. Create your first task.</p>;

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">Title</th>
            <th className="px-6 py-3 text-left">Project</th>
            <th className="px-6 py-3 text-left">Assigned Users</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{task.title}</td>
              <td className="px-6 py-4">{task.projectName || "N/A"}</td>
              <td className="px-6 py-4">{task.assignedUserNames.join(", ") || "N/A"}</td>
              <td className="px-6 py-4">{task.status}</td>
              <td className="px-6 py-4 text-right flex gap-2 justify-end">
                <button onClick={() => onEdit(task)} className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                  <Pencil />
                </button>
                <button onClick={() => onDelete(task.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
