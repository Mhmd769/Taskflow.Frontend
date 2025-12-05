import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "Pending" | "InProgress" | "Completed";
  createdAt: string;
  dueDate?: string;
  projectId: string;
  projectName?: string;
  assignedUserIds: string[];
  assignedUserNames: string[];
}

interface TasksState {
  list: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  list: [],
  loading: false,
  error: null,
};

// Helper function to convert status string to numeric enum
const statusToNumber = (status: "Pending" | "InProgress" | "Completed" | string | number | undefined): number => {
  if (typeof status === "number") return status;
  if (typeof status === "string") {
    switch (status) {
      case "Pending":
        return 0;
      case "InProgress":
        return 1;
      case "Completed":
        return 2;
      default:
        return 0; // Default to Pending
    }
  }
  return 0; // Default to Pending if undefined
};

// Payloads
export interface CreateTaskPayload {
  title: string;
  description?: string;
  projectId: string;
  status: "Pending" | "InProgress" | "Completed" | string | number;
  dueDate?: string;
  assignedUserIds: string[];
}

export interface UpdateTaskPayload {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  status: "Pending" | "InProgress" | "Completed" | string | number;
  dueDate?: string;
  assignedUserIds: string[];
}

// Thunks
export const fetchTasks = createAsyncThunk<Task[]>(
  "tasks/fetchTasks",
  async () => {
    const res = await axiosClient.get("/Tasks");
    return res.data;
  }
);

export const createTask = createAsyncThunk<Task, CreateTaskPayload>(
  "tasks/createTask",
  async (task) => {
    const payload = {
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      status: statusToNumber(task.status), // Convert to numeric enum
      dueDate: task.dueDate,
      assignedUserIds: task.assignedUserIds,
    };

    console.log("📤 Sending CREATE payload:", payload);
    const res = await axiosClient.post("/Tasks", payload);
    return res.data;
  }
);

export const updateTask = createAsyncThunk<Task, UpdateTaskPayload>(
  "tasks/updateTask",
  async (task, { rejectWithValue }) => {
    try {
      // Use camelCase to match CREATE payload format (which works)
      const payload: any = {
        id: task.id,
        title: task.title,
        description: task.description || "",
        projectId: task.projectId, // camelCase to match CREATE
        status: statusToNumber(task.status), // Convert to numeric enum
        dueDate: task.dueDate,
        assignedUserIds: Array.isArray(task.assignedUserIds) ? task.assignedUserIds : [],
      };

      // Remove undefined values to ensure clean payload
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      console.log("📤 Sending UPDATE payload:", JSON.stringify(payload, null, 2));
      console.log("📤 projectId:", payload.projectId);
      console.log("📤 assignedUserIds:", payload.assignedUserIds);
      
      const res = await axiosClient.put("/Tasks", payload);
      
      console.log("📥 UPDATE response:", JSON.stringify(res.data, null, 2));
      
      // If the response has empty assignedUserIds but we sent some, log a warning
      if (payload.assignedUserIds.length > 0 && (!res.data.assignedUserIds || res.data.assignedUserIds.length === 0)) {
        console.warn("⚠️ Backend returned empty AssignedUserIds despite sending:", payload.assignedUserIds);
        console.warn("⚠️ This indicates the backend UpdateTaskDto or handler is not processing AssignedUserIds");
      }
      
      // If the response has different projectId, log a warning
      if (payload.projectId && res.data.projectId !== payload.projectId) {
        console.warn("⚠️ Backend returned different ProjectId. Sent:", payload.projectId, "Received:", res.data.projectId);
        console.warn("⚠️ This indicates the backend UpdateTaskDto or handler is not processing ProjectId");
      }
      
      return res.data;
    } catch (error: any) {
      console.error("❌ UPDATE error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteTask = createAsyncThunk<string, string>(
  "tasks/deleteTask",
  async (taskId) => {
    await axiosClient.delete(`/Tasks/${taskId}`);
    return taskId;
  }
);

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.list.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.list.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter((t) => t.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
