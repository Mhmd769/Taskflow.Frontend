// ProjectForm.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { createProject, updateProject } from "../ProjectSlice";
import { fetchUsers, type User } from "../../Users/usersSlice";
import { successAlert, errorAlert } from "../../../utils/alerts";
import { X, User as UserIcon, FileText, UserCircle } from "lucide-react";

import type { Project } from "../ProjectSlice";

interface ProjectFormProps {
    project?: Project;
    onClose: () => void;
}

export default function ProjectForm({ project, onClose }: ProjectFormProps) {
    const dispatch = useAppDispatch();

    const [name, setName] = useState(project?.name || "");
    const [description, setDescription] = useState(project?.description || "");
    const [ownerId, setOwnerId] = useState(project?.owner.id || "");

    // Fetch users list from Redux store
    const users = useAppSelector((state) => state.users.list || []);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let res;

            if (project?.id) {
                res = await dispatch(
                    updateProject({
                        id: project.id,
                        name,
                        description,
                        ownerId,
                    })
                );
            } else {
                res = await dispatch(
                    createProject({
                        name,
                        description,
                        ownerId,
                    })
                );
            }

            if (updateProject.fulfilled.match(res) || createProject.fulfilled.match(res)) {
                successAlert(project ? "Project updated!" : "Project created!");
                onClose();
            } else {
                errorAlert("Something went wrong!");
            }
        } catch {
            errorAlert("Unexpected error occurred!");
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {project ? "Edit Project" : "Create New Project"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {project ? "Update project information" : "Fill in the details below"}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Name Field */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FileText className="w-4 h-4" />
                        Project Name
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter project name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Description Field */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FileText className="w-4 h-4" />
                        Description
                    </label>
                    <textarea
                        rows={4}
                        className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder="Enter project description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                {/* Owner Dropdown */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <UserCircle className="w-4 h-4" />
                        Project Owner
                    </label>
                    <select
                    className="w-full border px-3 py-2 rounded"
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    >
                    <option value="">Select an owner...</option>
                    {users?.map((u: User) => (
                        <option key={u.id} value={u.id}>
                        {u.fullName}
                        </option>
                    ))}
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        {project ? "Update Project" : "Create Project"}
                    </button>
                </div>
            </form>
        </div>
    );
}