import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export interface MessageDto {
  id: string;
  senderId: string;
  senderFullName: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface ChatState {
  messages: MessageDto[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

// Fetch conversation messages
export const fetchConversation = createAsyncThunk<MessageDto[], { otherUserId: string }>(
  "chat/fetchConversation",
  async ({ otherUserId }) => {
    const res = await axiosClient.get(`/Chat/${otherUserId}`);
    return res.data;
  }
);

// Send a message
export const sendMessage = createAsyncThunk<MessageDto, { receiverId: string; content: string }>(
  "chat/sendMessage",
  async ({ receiverId, content }) => {
    const res = await axiosClient.post("/Chat/send", { receiverId, content });
    return res.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    receiveMessage(state, action: PayloadAction<MessageDto>) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversation.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchConversation.fulfilled, (state, action: PayloadAction<MessageDto[]>) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch conversation";
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<MessageDto>) => {
        state.messages.push(action.payload);
      });
  },
});

export const { receiveMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
