import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import type { Notification } from "./notificationsSlice";

let connection: HubConnection | null = null;

export const startNotificationHub = (onNotification: (notif: Notification) => void) => {
  // Avoid duplicate connections in React StrictMode
  if (connection) {
    if (connection.state === "Connected" || connection.state === "Connecting") {
      return;
    }
  }

  connection = new HubConnectionBuilder()
     .withUrl("https://localhost:55358/hubs/notifications", {
    accessTokenFactory: () => localStorage.getItem('token') || '',
  })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  connection.start()
    .then(() => console.log("SignalR connected"))
    .catch(err => {
      // Ignore AbortError caused by dev-mode double invocation
      if (err && err.name === "AbortError") return;
      console.error("SignalR connection error:", err);
    });

  connection.on("ReceiveNotification", (notification: Notification) => {
    onNotification(notification);
  });
};

export const stopNotificationHub = () => {
  if (!connection) return;
  connection.stop();
  connection = null;
};
