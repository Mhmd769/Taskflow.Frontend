import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import type { Notification } from "./notificationsSlice";

let connection: HubConnection | null = null;

export const startNotificationHub = (onNotification: (notif: Notification) => void) => {
  connection = new HubConnectionBuilder()
     .withUrl("https://localhost:55358/hubs/notifications", {
    accessTokenFactory: () => localStorage.getItem('token') || '',
  })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  connection.start()
    .then(() => console.log("SignalR connected"))
    .catch(err => console.error("SignalR connection error:", err));

  connection.on("ReceiveNotification", (notification: Notification) => {
    onNotification(notification);
  });
};

export const stopNotificationHub = () => {
  connection?.stop();
};
