// ProjectsTable.tsx
import { Pencil, Trash2, FileText } from "lucide-react";
import type { Project } from "../ProjectSlice";

interface ProjectsTableProps {
  projects: Project[];
  loading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectsTable({
  projects,
  loading,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600">Get started by creating your first project</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Project Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md mr-3">
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{project.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-md">
                    {project.description || <span className="italic text-gray-400">No description</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 shadow-md">
                      {project.owner?.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {project.owner?.fullName || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(project)}
                      className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110"
                      title="Edit project"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => onDelete(project.id)}
                      className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                      title="Delete project"
                    >
                      <Trash2 className="w-5 h-5" />
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
