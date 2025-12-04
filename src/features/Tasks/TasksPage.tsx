import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  fetchTasks,
  deleteTask,
  createTask,
  updateTask,
  type Task,
  type CreateUpdateTaskPayload,
} from "../Tasks/TasksSlice";
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
    if (confirm("Are you sure?")) {
      dispatch(deleteTask(id));
    }
  };

  const handleSubmit = (taskData: CreateUpdateTaskPayload) => {
    if (editingTask) {
      dispatch(updateTask(taskData));
    } else {
      dispatch(createTask(taskData));
    }
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setShowForm(true)}
        >
          + New Task
        </button>
      </div>

      <TaskTable tasks={tasks} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

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
  );
}
