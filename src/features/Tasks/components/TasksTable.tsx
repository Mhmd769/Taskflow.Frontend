// TaskTable.tsx - ENHANCED DESIGN ONLY
import { Pencil, Trash2, Calendar, Users, CheckCircle2, Circle, PlayCircle, FolderKanban } from "lucide-react";
import type { Task } from "../TasksSlice";
import type { JSX } from "react";

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskTable({ tasks, loading, onEdit, onDelete }: TaskTableProps) {
  const getStatusBadge = (status: string | number) => {
    // Convert number status to string status
    const statusMap: Record<string | number, string> = {
      0: "Pending",
      1: "InProgress", 
      2: "Completed"
    };
    
    const statusText = typeof status === 'number' || !isNaN(Number(status)) 
      ? statusMap[status as string | number] || "Pending"
      : status;
    
    const styles: Record<string, string> = {
      Pending: "bg-blue-100 text-blue-700 border-blue-200",
      InProgress: "bg-amber-100 text-amber-700 border-amber-200",
      Completed: "bg-emerald-100 text-emerald-700 border-emerald-200"
    };
    
    const icons: Record<string, JSX.Element> = {
      Pending: <Circle size={14} />,
      InProgress: <PlayCircle size={14} />,
      Completed: <CheckCircle2 size={14} />
    };
    
    const displayText = statusText === "InProgress" ? "In Progress" : statusText;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[statusText] || styles.Pending}`}>
        {icons[statusText] || icons.Pending}
        {displayText}
      </span>
    );
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) return (
    <div className="p-20 text-center bg-white rounded-2xl shadow-sm">
      <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
      <p className="text-gray-600 text-lg font-medium">Loading tasks...</p>
    </div>
  );

  if (!tasks.length) return (
    <div className="p-20 text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200">
      <div className="text-6xl mb-4">📋</div>
      <p className="text-gray-600 text-lg font-medium mb-2">No tasks yet</p>
      <p className="text-gray-500">Create your first task to get started!</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
                    <FolderKanban size={14} className="text-blue-600" />
                    {task.projectName || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {task.assignedUserNames.length > 0 ? (
                      task.assignedUserNames.map((name, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                          <Users size={12} />
                          {name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">Unassigned</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(task.status)}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                    <Calendar size={14} className="text-gray-400" />
                    {formatDate(task.dueDate)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(task)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit task"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}