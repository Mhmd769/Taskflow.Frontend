import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// User interface
interface User {
  fullName: string;
  email: string;
  [key: string]: any;
}

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
}

// Safely parse user from localStorage
const storedUser = localStorage.getItem("user");
let parsedUser: User | null = null;

try {
  parsedUser = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
} catch {
  parsedUser = null;
}

// Initial state
const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  user: parsedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set credentials after login
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      // Persist to localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    // Logout
    logout: (state) => {
      state.token = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
