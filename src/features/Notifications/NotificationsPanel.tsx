// features/notifications/NotificationsPanel.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  fetchUnreadNotifications,
  fetchAllNotifications,
  markAsRead,
} from "./notificationsSlice";

export default function NotificationsPanel() {
  const dispatch = useAppDispatch();
  const { unread, all, loading } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchUnreadNotifications());
    dispatch(fetchAllNotifications());
  }, [dispatch]);

  const handleMarkRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  if (loading) return <p className="p-4">Loading notifications...</p>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Unread Notifications ({unread.length})</h2>
      <ul className="space-y-2">
        {unread.map((n) => (
          <li
            key={n.id}
            className="p-2 border rounded flex justify-between items-center"
          >
            <div>
              <p>{n.message}</p>
              {n.link && (
                <a href={n.link} className="text-blue-600 underline text-sm">
                  View
                </a>
              )}
            </div>
            <button
              onClick={() => handleMarkRead(n.id)}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Mark read
            </button>
          </li>
        ))}
        {unread.length === 0 && <p>No unread notifications.</p>}
      </ul>

      <h2 className="text-xl font-bold mt-6">All Notifications</h2>
      <ul className="space-y-2">
        {all.map((n) => (
          <li
            key={n.id}
            className={`p-2 border rounded flex justify-between items-center ${
              n.isRead ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div>
              <p>{n.message}</p>
              {n.link && (
                <a href={n.link} className="text-blue-600 underline text-sm">
                  View
                </a>
              )}
            </div>
            {!n.isRead && (
              <button
                onClick={() => handleMarkRead(n.id)}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Mark read
              </button>
            )}
          </li>
        ))}
        {all.length === 0 && <p>No notifications yet.</p>}
      </ul>
    </div>
  );
}
