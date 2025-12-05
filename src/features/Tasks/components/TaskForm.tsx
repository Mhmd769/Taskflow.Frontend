
// TaskForm.tsx - ENHANCED DESIGN ONLY
import { useState } from "react";
import { X, Calendar, Users, FolderKanban, FileText, Clock } from "lucide-react";
import type { Task } from "../TasksSlice";

interface TaskFormProps {
  task?: Task;
  projects: { id: string; name: string }[];
  users: { id: string; fullName: string }[];
  onSubmit: (task: any) => void;
  onClose: () => void;
}

export default function TaskForm({ task, projects, users, onSubmit, onClose }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [projectId, setProjectId] = useState(task?.projectId || "");
  const [status, setStatus] = useState<"Pending" | "InProgress" | "Completed">(task?.status || "Pending");
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.slice(0, 16) : "");
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>(task?.assignedUserIds || []);

  const toggleUser = (id: string) => {
    setAssignedUserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    type Payload = {
      id?: string;
      title: string;
      description: string;
      projectId: string;
      status: string | number;
      dueDate?: string;
      assignedUserIds?: string[];
    };

    const payload: Payload = {
      title,
      description,
      projectId,
      status: status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    };

    if (task?.id) {
      payload.id = task.id;
      payload.assignedUserIds = assignedUserIds;
    } else {
      payload.assignedUserIds = assignedUserIds;
    }

    console.log("📤 Final Payload:", payload);
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">{task ? "✏️ Edit Task" : "✨ Create New Task"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText size={18} className="text-blue-600" />
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              required
              placeholder="Enter task title..."
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText size={18} className="text-blue-600" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all min-h-[100px] resize-none"
              placeholder="Add task description..."
            />
          </div>

          {/* Project & Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FolderKanban size={18} className="text-blue-600" />
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white"
                required
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock size={18} className="text-blue-600" />
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white"
              >
                <option value="Pending">🔵 Pending</option>
                <option value="InProgress">🟡 In Progress</option>
                <option value="Completed">🟢 Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar size={18} className="text-blue-600" />
              Due Date
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Assigned Users */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users size={18} className="text-blue-600" />
              Assign Team Members
            </label>
            <div className="flex flex-wrap gap-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    assignedUserIds.includes(u.id)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => toggleUser(u.id)}
                >
                  {assignedUserIds.includes(u.id) ? "✓ " : ""}{u.fullName}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all"
            >
              {task ? "💾 Update Task" : "✨ Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
