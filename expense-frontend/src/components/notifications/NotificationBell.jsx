import { useEffect, useRef, useState } from "react";
import API from "../../api/axiosInstance";

const TYPE_ICONS = {
  EMI_DUE: "⏰",
  EMI_OVERDUE: "⚠️",
  BUDGET_EXCEEDED: "📊",
  PAYMENT_SUCCESS: "✅",
  AI_ADVICE: "✨",
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // poll every 60s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  const markOneRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="notif-wrap" ref={wrapRef}>
      <style>{`
        .notif-wrap { position: relative; }
        .notif-btn { background: none; border: none; cursor: pointer; position: relative; padding: 0.4rem; display: flex; align-items: center; color: #fff; }
        .notif-dot { position: absolute; top: 2px; right: 2px; background: #dc2626; color: #fff; font-size: 0.6rem; font-weight: 700; border-radius: 10px; min-width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; padding: 0 3px; }
        .notif-dropdown { position: absolute; top: calc(100% + 8px); right: 0; width: 340px; max-height: 420px; overflow-y: auto; background: #fff; border-radius: 12px; box-shadow: 0 10px 35px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; z-index: 200; }
        .notif-header { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; border-bottom: 1px solid #f3f4f6; }
        .notif-header h4 { font-size: 0.85rem; font-weight: 600; color: #111; margin: 0; }
        .notif-mark-all { background: none; border: none; color: #2563eb; font-size: 0.75rem; cursor: pointer; }
        .notif-list { padding: 0.4rem; }
        .notif-item { display: flex; gap: 0.6rem; padding: 0.6rem 0.7rem; border-radius: 8px; cursor: pointer; transition: background 0.1s; }
        .notif-item:hover { background: #f9fafb; }
        .notif-item.unread { background: #eff6ff; }
        .notif-icon { font-size: 1rem; flex-shrink: 0; }
        .notif-body { flex: 1; min-width: 0; }
        .notif-title { font-size: 0.8rem; font-weight: 600; color: #111; }
        .notif-msg { font-size: 0.75rem; color: #6b7280; margin-top: 0.15rem; line-height: 1.4; }
        .notif-time { font-size: 0.68rem; color: #9ca3af; margin-top: 0.25rem; }
        .notif-empty { padding: 2rem 1rem; text-align: center; color: #9ca3af; font-size: 0.8rem; }
      `}</style>

      <button className="notif-btn" onClick={() => setOpen((p) => !p)} aria-label="Notifications">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unreadCount > 0 && <span className="notif-dot">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && <button className="notif-mark-all" onClick={markAllRead}>Mark all read</button>}
          </div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">You're all caught up 🎉</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`notif-item${!n.read ? " unread" : ""}`}
                  onClick={() => !n.read && markOneRead(n._id)}
                >
                  <span className="notif-icon">{TYPE_ICONS[n.type] || "🔔"}</span>
                  <div className="notif-body">
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-msg">{n.message}</div>
                    <div className="notif-time">{timeAgo(n.createdAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;