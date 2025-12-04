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

// Payload type for create/update
export interface CreateUpdateTaskPayload {
  id?: string;
  title: string;
  description?: string;
  projectId: string;
  status: "Pending" | "InProgress" | "Completed";
  dueDate?: string;
  assignedUsers: { id: string }[];
}

// Fetch all tasks
export const fetchTasks = createAsyncThunk<Task[]>(
  "tasks/fetchTasks",
  async () => {
    const res = await axiosClient.get("/Tasks");
    return res.data;
  }
);

export const createTask = createAsyncThunk<Task, CreateUpdateTaskPayload>(
  "tasks/createTask",
  async (task) => {
    const res = await axiosClient.post("/Tasks", task);
    return res.data;
  }
);

export const updateTask = createAsyncThunk<Task, CreateUpdateTaskPayload>(
  "tasks/updateTask",
  async (task) => {
    const res = await axiosClient.put("/Tasks", task);
    return res.data;
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
