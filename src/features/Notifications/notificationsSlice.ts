// features/notifications/notificationsSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

// ------------- TYPES -------------
export interface Notification {
  id: string;
  userId: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsState {
  unread: Notification[];
  all: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  unread: [],
  all: [],
  loading: false,
  error: null,
};

// ------------- API CALLS -------------

export const createNotification = createAsyncThunk<
  Notification,
  { userId: string; message: string; link?: string }
>("notifications/createNotification", async (payload) => {
  const res = await axiosClient.post("/Notifications", payload);
  return res.data;
});

export const fetchUnreadNotifications = createAsyncThunk<Notification[]>(
  "notifications/fetchUnread",
  async () => {
    const res = await axiosClient.get("/Notifications/unread");
    return res.data;
  }
);

export const fetchAllNotifications = createAsyncThunk<Notification[]>(
  "notifications/fetchAll",
  async () => {
    const res = await axiosClient.get("/Notifications/all");
    return res.data;
  }
);

// ------------- SLICE -------------
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAsRead(state, action: PayloadAction<string>) {
      const notif = state.unread.find((n) => n.id === action.payload);
      if (notif) {
        notif.isRead = true;
        state.unread = state.unread.filter((n) => n.id !== action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUnreadNotifications.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          state.unread = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch unread notifications";
      })

      .addCase(fetchAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllNotifications.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          state.all = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      })

      .addCase(createNotification.fulfilled, (state, action: PayloadAction<Notification>) => {
        state.unread.unshift(action.payload);
        state.all.unshift(action.payload);
      });
  },
});

export const { markAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
