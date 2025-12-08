import { useEffect, useState, type JSX } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  FolderKanban, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  PlayCircle,
  Clock,
  Users,
  ArrowLeft
} from "lucide-react";
import axiosClient from "../../api/axiosClient";
import type { Project, Task } from "../Projects/ProjectSlice";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axiosClient.get(`/Projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error("Failed to fetch project", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const getStatusBadge = (status: number | string) => {
    type StatusKey = "Pending" | "InProgress" | "Completed";
    
    const statusMap: Record<number | string, StatusKey> = {
      0: "Pending",
      1: "InProgress",
      2: "Completed"
    };

    const statusText: StatusKey = typeof status === 'number' || !isNaN(Number(status))
      ? (statusMap[status] || "Pending")
      : (status as StatusKey);

    const styles: Record<StatusKey, string> = {
      Pending: "bg-blue-100 text-blue-700 border-blue-200",
      InProgress: "bg-amber-100 text-amber-700 border-amber-200",
      Completed: "bg-emerald-100 text-emerald-700 border-emerald-200"
    };

    const icons: Record<StatusKey, JSX.Element> = {
      Pending: <Circle size={14} />,
      InProgress: <PlayCircle size={14} />,
      Completed: <CheckCircle2 size={14} />
    };

    const displayText = statusText === "InProgress" ? "In Progress" : statusText;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border ${styles[statusText]}`}>
        {icons[statusText]}
        {displayText}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-500 text-xl font-semibold">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors">
           <Link to={"/projects"}>
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </Link>
          </button>
          
          <div className="flex items-start gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
              <FolderKanban size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {project.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <Calendar size={16} />
                <span className="text-sm">Created: {formatDate(project.createdAt)}</span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {project.description || "No description provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Owner Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User size={20} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Project Owner</h2>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {project.owner.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{project.owner.fullName}</h3>
                <span className="inline-block px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-semibold mt-1">
                  {project.owner.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                <Mail size={18} className="text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{project.owner.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                <Phone size={18} className="text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{project.owner.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle2 size={20} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                {project.taskCount}
              </span>
            </div>
          </div>

          {project.tasks && project.tasks.length > 0 ? (
            <div className="space-y-4">
              {project.tasks.map((task: Task) => (
                <div
                  key={task.id}
                  className="border-2 border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">{task.title}</h3>
                    {getStatusBadge(task.status)}
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {task.description || "No description"}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} className="text-blue-500" />
                      <span className="font-medium">Due:</span>
                      <span>{formatDate(task.dueDate)}</span>
                    </div>

                    {task.assignedUserNames && task.assignedUserNames.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-purple-500" />
                        <div className="flex flex-wrap gap-1">
                          {task.assignedUserNames.map((name, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-400 font-mono">ID: {task.id}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-3">📝</div>
              <p className="text-gray-500 font-medium">No tasks yet</p>
              <p className="text-gray-400 text-sm mt-1">Tasks will appear here once created</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}