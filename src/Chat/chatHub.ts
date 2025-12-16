import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import type { MessageDto } from "./chatSlice";

let connection: HubConnection | null = null;

export const startChatHub = (onMessage: (msg: MessageDto) => void) => {
  // Avoid creating multiple connections (React StrictMode mounts effects twice in dev)
  if (connection) {
    if (connection.state === "Connected" || connection.state === "Connecting") {
      return;
    }
  }

  connection = new HubConnectionBuilder()
    .withUrl("https://localhost:55358/hubs/chat", {
      accessTokenFactory: () => localStorage.getItem("token") || ""
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  connection
    .start()
    .catch(err => {
      // Ignore AbortError when React dev mode double‑invokes effects
      if (err && err.name === "AbortError") return;
      console.error("SignalR chat connection error:", err);
    });

  connection.on("ReceiveMessage", (message: MessageDto) => onMessage(message));
};

export const stopChatHub = () => {
  if (!connection) return;
  connection.stop();
  connection = null;
};
