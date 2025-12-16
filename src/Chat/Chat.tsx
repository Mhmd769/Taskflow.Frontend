import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchConversation, sendMessage, receiveMessage } from "./chatSlice";
import { startChatHub, stopChatHub } from "./chatHub";

interface ChatProps {
  otherUserId: string;
}

export default function Chat({ otherUserId }: ChatProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, loading } = useSelector((state: RootState) => state.chat);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // 1️⃣ Fetch conversation
    dispatch(fetchConversation({ otherUserId }));

    // 2️⃣ Start SignalR
    startChatHub((message) => dispatch(receiveMessage(message)));

    return () => {
      stopChatHub();
    };
  }, [dispatch, otherUserId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    dispatch(sendMessage({ receiverId: otherUserId, content: newMessage }));
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full border p-2 rounded">
      <div className="flex-1 overflow-y-auto mb-2">
        {loading ? (
          <p>Loading...</p>
        ) : messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((msg:any) => (
            <div
              key={msg.id}
              className={`p-2 my-1 rounded ${
                msg.senderId === localStorage.getItem("userId")
                  ? "bg-blue-100 self-end"
                  : "bg-gray-100 self-start"
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleTimeString()}</span>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded p-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">Send</button>
      </form>
    </div>
  );
}
