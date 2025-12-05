// TaskPage.tsx - ENHANCED DESIGN ONLY
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import type { RootState } from "../../store/store";
import { fetchTasks, deleteTask, createTask, updateTask, type Task } from "../Tasks/TasksSlice";
import TaskTable from "./components/TasksTable";
import TaskForm from "./components/TaskForm";
import axiosClient from "../../api/axiosClient";

export default function TaskPage() {
  const dispatch = useDispatch<any>();
  const { list: tasks, loading } = useSelector((state: RootState) => state.task);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; fullName: string }[]>([]);

  useEffect(() => {
    dispatch(fetchTasks());
    axiosClient.get("/Projects").then((res) => setProjects(res.data));
    axiosClient.get("/Users").then((res) => setUsers(res.data));
  }, [dispatch]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) dispatch(deleteTask(id));
  };

  const handleSubmit = async (taskData: any) => {
    if (editingTask) {
      await dispatch(updateTask(taskData));
    } else {
      await dispatch(createTask(taskData));
    }
    dispatch(fetchTasks());
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Task Management
              </h1>
              <p className="text-gray-600 mt-1">Organize and track your team's work</p>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              New Task
            </button>
          </div>
        </div>

        {/* Task Table */}
        <TaskTable tasks={tasks} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

        {/* Task Form Modal */}
        {showForm && (
          <TaskForm
            task={editingTask || undefined}
            projects={projects}
            users={users}
            onClose={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}