import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

// ------------ TYPES ------------
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "Admin" | "ProjectManager" | "User";
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: number;
  createdAt: string;
  dueDate: string;
  projectId: string;
  projectName: string;
  assignedUserIds: string[];
  assignedUserNames: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  owner: User;
  tasks?: Task[];
  taskCount?: number;
}


interface ProjectsState {
  list: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  list: [],
  loading: false,
  error: null,
};

// ------------ API CALLS ------------

// GET ALL
export const fetchProjects = createAsyncThunk<Project[]>(
  "projects/fetchProjects",
  async () => {
    const res = await axiosClient.get("/Projects");
    return res.data;
  }
);

// Request payload types matching API spec
interface CreateProjectRequest {
  name: string;
  description: string;
  ownerId: string;
}

interface UpdateProjectRequest {
  id: string;
  name: string;
  description: string;
  ownerId: string;
}

// CREATE
export const createProject = createAsyncThunk<Project, CreateProjectRequest>(
  "projects/createProject",
  async (project) => {
    const res = await axiosClient.post("/Projects", {
      name: project.name,
      description: project.description,
      ownerId: project.ownerId,
    });
    return res.data;
  }
);

// UPDATE
export const updateProject = createAsyncThunk<Project, UpdateProjectRequest>(
  "projects/updateProject",
  async (project) => {
    const res = await axiosClient.put("/Projects", {
      id: project.id,
      name: project.name,
      description: project.description,
      ownerId: project.ownerId,
    });
    return res.data;
  }
);

// DELETE
export const deleteProject = createAsyncThunk<string, string>(
  "projects/deleteProject",
  async (projectId) => {
    await axiosClient.delete(`/Projects/${projectId}`);
    return projectId;
  }
);

//get potject by id 

export const getProjectById = createAsyncThunk<Project, string>(
  "projects/getProjectById",
  async (projectId) => {
    const res = await axiosClient.get(`/Projects/${projectId}`);
    return res.data;
  }
);

// ------------ SLICE ------------

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH PROJECTS
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch projects";
      })

      // CREATE PROJECT
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.list.push(action.payload);
      })

      // UPDATE PROJECT
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // DELETE PROJECT
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      });
  },
});

export default projectsSlice.reducer;
