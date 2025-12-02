
// ProjectsPage.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  fetchProjects,
  deleteProject,
  type Project,
} from "./ProjectSlice";

import ProjectsTable from "./components/ProjectsTable";
import ProjectForm from "./components/ProjectForm";

import { PlusCircle } from "lucide-react";
import { successAlert } from "../../utils/alerts";

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state: any) => state.project);

  const [openForm, setOpenForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Load projects on mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Open create modal
  const handleAdd = () => {
    setSelectedProject(null);
    setOpenForm(true);
  };

  // Open edit modal
  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setOpenForm(true);
  };

  // Delete project
  const handleDelete = async (id: string) => {
    const confirmed = await successAlert(`User "${name}" has been deleted.`);
    if (!confirmed) return;

    const res = await dispatch(deleteProject(id));
    if (deleteProject.fulfilled.match(res)) {
      successAlert("Project deleted successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Projects</h1>
              <p className="text-gray-600 text-lg">Manage and organize all your projects in one place.</p>
            </div>

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="font-semibold">Add Project</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <ProjectsTable
          projects={list}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modal Form */}
        {openForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
              <ProjectForm
                project={selectedProject || undefined}
                onClose={() => setOpenForm(false)}
              />
            </div>
          </div>    
        )}
      </div>
    </div>
  );
}