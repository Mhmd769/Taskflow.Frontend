import { useState } from "react";
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
  const [status, setStatus] = useState<Task["status"]>(task?.status || "Pending");
  const [dueDate, setDueDate] = useState(task?.dueDate?.slice(0, 16) || "");
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>(task?.assignedUserIds || []);

  const toggleUser = (id: string) => {
    setAssignedUserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      title,
      description,
      projectId,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      assignedUsers: assignedUserIds.map((id) => ({ id })),
    };

    if (task?.id) {
      payload.id = task.id; // only for update
    }

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4">
        <h2 className="text-xl font-bold">{task ? "Edit Task" : "Create Task"}</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />

        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Task["status"])}
          className="w-full p-2 border rounded"
        >
          <option value="Pending">Pending</option>
          <option value="InProgress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div className="flex flex-wrap gap-2">
          {users.map((u) => (
            <button
              key={u.id}
              type="button"
              className={`px-3 py-1 border rounded ${
                assignedUserIds.includes(u.id) ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
              onClick={() => toggleUser(u.id)}
            >
              {u.fullName}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            {task ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
