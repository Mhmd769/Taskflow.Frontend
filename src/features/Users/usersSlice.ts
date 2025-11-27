import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "Admin" | "ProjectManager" | "User";
}

interface UsersState {
  list: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
};

// Fetch all users
export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => {
    const res = await axiosClient.get("/Users");
    return res.data;
  }
);


// Create a new user
export const createUser = createAsyncThunk<User, User>(
  "users/createUser",
  async (user) => {
    const res = await axiosClient.post("/Users", user);
    return res.data;
  }
);

// Update an existing user
export const updateUser = createAsyncThunk<User, User>(
  "users/updateUser",
  async (user) => {
    const res = await axiosClient.put("/Users", user);
    return res.data;
  }
);

// Delete user by ID
export const deleteUser = createAsyncThunk<string, string>(
  "users/deleteUser",
  async (id) => {
    await axiosClient.delete(`/Users/${id}`);
    return id; // return deleted user id
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter((user) => user.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
